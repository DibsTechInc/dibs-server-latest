const moment = require('moment-timezone');
const Decimal = require('decimal.js');
const ErrorHelper = require('../../../../../lib/helpers/error-helper');
const autopayEmailLib = require('../../../../../lib/emails/autopay');
const StripeClient = require('../../../../../lib/stripe/client');
const resolveUnpaidBookings = require('../../../../../lib/helpers/resolve-unpaid-bookings');

const sc = new StripeClient();

/**
 * paymentSucceeded - Description
 *
 * @param {type} req Description
 * @param {type} res Description
 *
 * @returns {type} Description
 */
async function paymentSucceeded(req, res) {
    const event = req.body;
    const invoice = event.data.object;
    const subscription = invoice.subscription;
    const subscriptionData = invoice.lines.data[0];

    if (!subscription || (!event.livemode && process.env.NODE_ENV === 'production')) return res.status(204).send();

    if (invoice.subtotal === 0) return res.status(204).send();

    try {
        const [autopaySubscription, dibsTransaction] = await Promise.all([
            models.dibs_user_autopay_packages.findOne({
                include: [
                    {
                        model: models.studio_packages,
                        as: 'studio_package',
                        include: [
                            {
                                model: models.dibs_studio,
                                as: 'studio',
                                include: [
                                    {
                                        model: models.whitelabel_custom_email_text,
                                        as: 'custom_email_text',
                                        key: 'dibs_studio_id'
                                    },
                                    {
                                        model: models.dibs_config,
                                        as: 'dibs_config'
                                    },
                                    {
                                        model: models.dibs_studio_locations,
                                        as: 'locations'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        model: models.dibs_user,
                        as: 'user',
                        include: [
                            {
                                model: models.dibs_user_studio,
                                as: 'userStudios',
                                attributes: ['dibs_studio_id', 'clientid']
                            }
                        ]
                    }
                ],
                where: {
                    stripe_subscription_id: subscription
                }
            }),
            models.dibs_transaction.findOne({
                where: {
                    stripe_invoice_id: invoice.id
                }
            })
        ]);

        if (!autopaySubscription) throw new Error(`No subscription exists with that stripe_subscription_id ${subscription}`);
        if (!dibsTransaction) throw new Error(`No transaction exists with that stripe_invoice_id ${invoice.id}`);

        const user = autopaySubscription.user;
        const studio = autopaySubscription.studio_package.studio;
        const pass = await models.passes.createNewPass({
            user,
            studioPackage: autopaySubscription.studio_package,
            studio,
            purchaseTransactionId: dibsTransaction.id,
            amountPaid: +Decimal(dibsTransaction.original_price).minus(dibsTransaction.discount_amount),
            userAutopayPackageId: autopaySubscription.id,
            autopay: autopaySubscription.shouldPassRenew(),
            save: true
        });

        if (!autopaySubscription.shouldPassRenew()) {
            await sc.cancelSubscriptionPlan({
                stripeSubscriptionId: autopaySubscription.stripe_subscription_id,
                stripeAccountId: studio.stripe_account_id
            });
        }
        const [oldPass] = await models.passes.findAll({
            where: {
                dibs_autopay_id: autopaySubscription.id,
                userid: user.id
            },
            limit: 1,
            order: [['createdAt', 'DESC']]
        });

        const charge = await sc.retrieveChargeDetails(invoice.charge, event.account);
        await models.sequelize.transaction(async (sqlTransaction) => {
            // invoice tax can change from created to payment_succeeded if a user applied studio credit
            dibsTransaction.tax_amount = invoice.tax ? new Decimal(invoice.tax).dividedBy(100).toDP(2).toNumber() : 0;
            dibsTransaction.stripe_fee = new Decimal(charge.balance_transaction.fee)
                .minus(invoice.application_fee)
                .dividedBy(100)
                .toDP(2)
                .toNumber();
            await dibsTransaction
                .calculateTaxWithheld(Decimal(studio.locations[0].tax_rate).dividedBy(100))
                .calculateDibsFeeForSubscription(studio)
                .calculateStudioPayment();
            dibsTransaction.setStripeChargeId(invoice.charge);

            dibsTransaction.for_passid = pass.id;
            dibsTransaction.description = `${dibsTransaction.description} | Payment succeeded`;

            if (oldPass) {
                oldPass.expiresAt = moment();
            }
            return Promise.all([
                dibsTransaction.success({ save: true, transaction: sqlTransaction }),
                pass.restore({ transaction: sqlTransaction }),
                oldPass && oldPass.save()
            ]);
        });
        await resolveUnpaidBookings({ user, pass, studio });

        await autopayEmailLib.sendAutopaySuccessEmail(autopaySubscription, dibsTransaction, pass);
        await autopayEmailLib.sendAutopayTransactionsEmail(user, autopaySubscription, 'Payment Succeeded');

        return res.status(204).send();
    } catch (err) {
        return ErrorHelper.handleError({
            opsSubject: 'Package Subscription Payment Succeeded Error',
            res,
            resStatus: 204,
            resSend: true,
            opsIncludes: `Payment Succeeded Webhook failed for User Autopay Package with Stripe Subscription Id ${subscription}. Stripe Invoice ${invoice.id}`
        })(err);
    }
}

module.exports = paymentSucceeded;
