const MailClient = require('@dibs-tech/mail-client');
const { uniq } = require('lodash');
const Promise = require('bluebird');
const moment = require('moment-timezone');
const { handleError } = require('@dibs-tech/dibs-error-handler');
const generateICSForEventWithTime = require('../../helpers/ics-generator');
const Decimal = require('decimal.js');
const { format: formatCurrency } = require('currency-formatter');

const getEventEmailTransactions = require('./get-event-email-transactions');
const getPackageEmailTransactions = require('./get-package-email-transactions');
const getCreditEmailTransactions = require('./get-credit-email-transactions');
const getGiftCardEmailTransactions = require('./get-gift-card-transactions');

const mc = new MailClient();
const sendTemplateAsync = Promise.promisify(mc.sendTemplatedEmail, { context: mc });

/**
 * @param {Object} cart to send recepit for
 * @returns {Array<Object>} flattened array of transactions
 */
const getCartTransactions = (cart) => [...cart.events, ...cart.packages, ...cart.credits, ...cart.giftCards];

/**
 * @param {Object} cart with transactions separated by type
 * @param {string|number} key to lookup in transaction object
 * @returns {Array<string|number>} array of unique values of the specified key in the transaction objects
 */
const getUniqueKeys = (cart, key) => uniq(getCartTransactions(cart).map((o) => o[key])).filter(Boolean);

/**
 * @param {Object} cart with transactions for receipt
 * @param {string} name of associated object on the transaction
 * @param {Array<Object>} values instances to map to the transaction
 * @param {Object} match parameters, ex:
 *                 { targetKey: x, foreignKey: y } will associate the transaction with t[x] = value[y] where value in values
 * @returns {undefined} just adds children to the transaction objects, doesn't return anything
 */
const addKeyOnMatch = (cart, name, values, { targetKey = 'id', foreignKey }) =>
    getCartTransactions(cart).forEach((transaction) =>
        transaction[foreignKey] ? (transaction[name] = values.find((o) => o[targetKey] === transaction[foreignKey]) || null) : null
    );

/**
 * @param {Object} args named arguments
 * @returns {Promise<undefined>} sends receipt email
 */
module.exports = async function sendCheckoutConfirmationEmail({ user, transactions, employeeid }) {
    try {
        const studio = await models.dibs_studio.findById(transactions[0].dibs_studio_id, {
            include: [
                {
                    model: models.whitelabel_custom_email_text,
                    as: 'custom_email_text',
                    key: 'dibs_studio_id'
                }
            ]
        });
        const emailData = mc.getEmailDataForStudio(studio, MailClient.EmailTypes.CHECKOUT_RECEIPT);

        const cart = transactions.reduce(
            (acc, transaction) => {
                if (transaction.eventid) acc.events.push(transaction);
                if (transaction.studio_package_id) acc.packages.push(transaction);
                if (transaction.credit_tier_id) acc.credits.push(transaction);
                if (transaction.gift_card_id) acc.giftCards.push(transaction);
                return acc;
            },
            { events: [], packages: [], credits: [], giftCards: [] }
        );

        const eventids = getUniqueKeys(cart, 'eventid');
        const events = await models.event.findAll({
            where: { eventid: eventids },
            include: [
                {
                    model: models.dibs_studio_locations,
                    as: 'location',
                    attributes: ['address', 'name']
                },
                {
                    model: models.dibs_studio_instructors,
                    as: 'instructor',
                    attributes: ['firstname', 'lastname']
                }
            ]
        });
        events.forEach((event) => {
            event.start_time = moment.tz(moment(event.start_date).utc().format('YYYY-MM-DDTHH:mm:ss'), studio.mainTZ);
            event.end_time = moment.tz(moment(event.end_date).utc().format('YYYY-MM-DDTHH:mm:ss'), studio.mainTZ);
            event.instructor = { first_name: event.instructor.firstname, last_name: event.instructor.lastname };
        });
        addKeyOnMatch(cart, 'event', events, { targetKey: 'eventid', foreignKey: 'eventid' });

        const withPassids = getUniqueKeys(cart, 'with_passid');
        const withPasses = await models.passes.findAll({
            where: { id: withPassids },
            include: [
                {
                    model: models.studio_packages,
                    as: 'studioPackage',
                    attributes: ['unlimited']
                }
            ]
        });
        addKeyOnMatch(cart, 'pass', withPasses, { foreignKey: 'with_passid' });

        const forPassids = getUniqueKeys(cart, 'for_passid');
        const forPasses = await models.passes.findAll({
            where: { id: forPassids }
        });
        addKeyOnMatch(cart, 'pass', forPasses, { foreignKey: 'for_passid' });

        const studioPackageIds = getUniqueKeys(cart, 'studio_package_id');
        const studioPackages = await models.studio_packages.findAll({
            where: { id: studioPackageIds }
        });
        addKeyOnMatch(cart, 'studioPackage', studioPackages, { foreignKey: 'studio_package_id' });

        const flashCreditIds = getUniqueKeys(cart, 'flash_credit_id');
        const flashCredits = await models.flash_credit.findAll({
            where: { id: flashCreditIds },
            paranoid: false
        });
        addKeyOnMatch(cart, 'flashCredit', flashCredits, { foreignKey: 'flash_credit_id' });

        const promoids = getUniqueKeys(cart, 'promoid');
        const promoCodes = await models.promo_code.findAll({
            where: { id: promoids }
        });
        addKeyOnMatch(cart, 'promoCode', promoCodes, { foreignKey: 'promoid' });

        const creditTierIds = getUniqueKeys(cart, 'credit_tier_id');
        const creditTiers = await models.credit_tier.findAll({
            where: { id: creditTierIds }
        });
        addKeyOnMatch(cart, 'creditTier', creditTiers, { foreignKey: 'credit_tier_id' });

        const chargeAmount = +getCartTransactions(cart).reduce((acc, t) => acc.plus(t.chargeAmount || 0), Decimal(0));

        // TODO add credit transaction associations here

        emailData.events = getEventEmailTransactions(studio, cart.events);
        emailData.packages = getPackageEmailTransactions(studio, cart.packages);
        emailData.credits = getCreditEmailTransactions(studio, cart.credits);
        emailData.giftCards = getGiftCardEmailTransactions(studio, cart.giftCards);
        emailData.user = user;
        emailData.finalPrice = formatCurrency(chargeAmount, { code: studio.currency, precision: 2 });
        emailData.events.forEach((event, i) => {
            event.spot = {
                seatNumber: transactions[i].source_id,
                seatType: transactions[i].spot_label
            };
        });

        // confirmation that is being used

        const attachments = cart.events.map(({ event }) => ({
            type: 'text/calendar',
            name: event.name,
            data: new Buffer(generateICSForEventWithTime(event, studio)).toString('base64')
        }));

        const subject = `${emailData.studioName} Purchase Confirmed`;
        // testing removing attachment for now

        await sendTemplateAsync(user.email, subject, emailData.template, emailData, {
            force: true,
            // attachments,
            pool: 'transactional',
            from: {
                name: emailData.studioName,
                email: emailData.domain
            }
        });
    } catch (err) {
        handleError({
            opsSubject: 'Receipt Email Error',
            userid: user.id,
            employeeid,
            opsBody: `Failed to send a booking confirmation email to ${user.id} after they made a class purchase`
        })(err);
    }
};
