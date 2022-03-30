const _ = require('lodash');
const { apiFailureWrapper, apiSuccessWrapper } = require('../../../lib/helpers/api-wrappers');
const errorHelper = require('../../../../lib/dibs-error-handler');
const { Op } = require('sequelize');

/**
 * Handling weirdness between SQLite and Postgres <- WTF does this mean? Does anyone remember?
 * @param {Number} val to type cast to boolean
 * @returns {Number|Boolean} proper value for proper database
 */
function testDumbnessBool(val) {
  return process.env.NODE_ENV === 'test' ? val : Boolean(val);
}

/**
 * @param {String} code  promo code to verify
 * @param {Object} user  user instance
 * @param {Object} options options object
 * @param {Number} options.studioid external studio identifier
 * @param {String} options.source studio source
 * @param {Array} options.eventids specific event ids being purchased to check for a match against
 * @param {Array} option.packageids specific package ids being purchased to check for a match against
 * @param {Number} options.locationid specific location to check for a match against - feature incomplete
 * @param {Enum} options.product  what type of product this is valid for (package, class or universal)
 * @param {Boolen} options.thirdParty if this is a third party api call
 * @returns {Object} success or failure JSON
 */
module.exports = async function verifyPromoCode(code, user, {
  studioid = 0,
  source = 'dibs',
  dibs_studio_id: dibsStudioId = null,
  eventids = [],
  product = this.Products.CLASS,
  thirdParty = false,
} = {}) {
  const sequelize = this.sequelize;
  try {
    if (!code) {
      return apiFailureWrapper({ err: 'No Code' }, 'You must provide a promo code for verifcation', 404);
    }
    if (!user) {
      return apiFailureWrapper({ err: 'No User' }, 'Promo codes must be validated by a user', 404);
    }
    const studioWhere = forPromoCodeQuery => (
      dibsStudioId !== null ?
        { [forPromoCodeQuery ? 'dibs_studio_id' : 'id']: dibsStudioId }
        : { source, studioid });
    const [promoCode, classTransactions, studio, events] = await Promise.all([
      this.findOne(
        {
          where: {
            code: code.toUpperCase(),
            [Op.or]: [
              studioWhere(true),
              { dibs_studio_id: 0 },
            ],
            expiration: { [Op.gt]: new Date() },
          },
          include: [
            {
              model: this.sequelize.models.promo_codes_user,
              as: 'currentPCUser',
              where: { userid: user.id },
              attribute: ['id', 'studioid', 'source'],
              required: false,
            },
            {
              model: this.sequelize.models.promo_codes_user,
              as: 'allPCUsers',
            },
            {
              model: this.sequelize.models.dibs_studio,
              as: 'studio',
              attributes: ['name'],
            },
          ],
          attributes: {
            include: [
              [sequelize.literal(`(SELECT pc2.id FROM promo_codes as pc2 LEFT JOIN promo_codes_users AS pcu2 ON pc2.id = pcu2.promoid WHERE pc2.code = promo_code.code AND promo_code.grouped_code = ${testDumbnessBool(1)} AND pcu2.userid IS NOT NULL LIMIT 1)`), 'used_as_group'],
            ],
          },
          // order to prioritize studio promo over global promo, then order by expiration
          order: [
            [sequelize.fn('abs', sequelize.col('promo_code.studioid')), 'DESC'],
            ['expiration', 'ASC'],
          ],
        }
      ),
      this.sequelize.models.dibs_transaction.findAll({
        where: { userid: user.id, type: 'class', status: 1 },
      }),
      //    this.sequelize.models.dibs_transaction.findAll({ where: { userid: user.id, type: 'pack', status: 1 }, transaction }),
      this.sequelize.models.dibs_studio.findOne({ where: studioWhere(false) }),
      this.sequelize.models.event.findAll({ where: { eventid: eventids } }),
    ]);
    // does the code exist
    switch (true) {
      case (promoCode === null):
        return apiFailureWrapper(
          {}, 'This promo code does not exist or has expired.', 412);

      // Is this the right type of purchase for the promo code
      case (
        promoCode.product !== product
        && promoCode.product !== this.Products.UNIVERSAL
      ):
        return apiFailureWrapper(
          {}, 'This promo code is not applicable to this purchase. Please check the promotion details.');

      // is the code unique and has it already been used?  - bypass built in useage limit
      case (
        promoCode.unique
        && promoCode.allPCUsers.length >= 1
      ):
        return apiFailureWrapper(
          {}, 'You have already used this one-time use promo code.', 412);

      // is the code used max times by specific user
      case (promoCode.currentPCUser.length >= promoCode.user_usage_limit):
        return apiFailureWrapper(
          {}, 'You have already used this promo code the maximum number of times allowed.', 412);

      // is the code used max times by all users
      case (
        (promoCode.user_usage_limit === 1)
        && promoCode.code_usage_limit !== null
        && promoCode.allPCUsers.length >= promoCode.code_usage_limit
      ):
        return apiFailureWrapper(
          {}, 'This promo code is no longer available.', 412);

      // do one of the events in cart match the pattern for the promo code for a specific class name.
      // promo codes do not get assigned to specific classes except by studio)
      case (
        promoCode.class_name_pattern
        && !events.some(e => RegExp(promoCode.class_name_pattern, 'i').test(e.name))
      ):
        return apiFailureWrapper(
          { notSpecifiedClassSkip: true }, 'Oops! This promo code does not apply to any class in your cart.', 412);

      // is the code the first time a dibs user is using this
      case (
        promoCode.first_time_dibs
        && classTransactions.length > 0
      ):
        return apiFailureWrapper(
          {}, 'Looks like you\'ve booked before! Unfortunately, this code is for first booking only.', 412);

      // is the code the first time someone is using this at a studio
      case Boolean(
        promoCode.first_time_studio_dibs
        && _.find(classTransactions, { studioid: Number(studioid), source })
      ):
        return apiFailureWrapper(
          {}, `Looks like you've booked at ${promoCode.studio ? promoCode.studio.name : 'this studio'} before! Unfortunately, this code is for first time visits only.`, 412);

      // is the code part of a group of studios and only used one time at that group
      case (
        (promoCode.grouped_code
          && promoCode.studios.some(p => p === studio.id))
        || !promoCode.used_as_group === null
      ):
        return apiFailureWrapper(
          {}, 'You have already used this one-time use promo code.', 412);

      // is the code location specific (feature needs to be completed)
      // case (promoCode.locations && promoCode.locations.some(p => p === locationid)):
      // return apiFailureWrapper({}, 'This code may not be used at this location');

      // is this a 3rd party api user
      case thirdParty:
        return apiSuccessWrapper({
          promo_code: {
            code: promoCode.code,
            type: promoCode.type,
            amount: promoCode.amount,
            dibs_studio_id: promoCode.dibs_studio_id,
            locations: promoCode.locations,
          },
        }, 'Valid Promo Code'); // eslint-disable-lie

      // SUCCESS!!
      default:
        return apiSuccessWrapper({ promoCode, user: user.clientJSON() }, 'Valid Promo Code');
    }
  } catch (err) {
    errorHelper.handleError({
      opsSubject: 'Promo Verify Error',
      opsIncludes: `Promo Code ${code}`,
      userid: user.id,
    })(err);
    return apiFailureWrapper({ err }, 'Oops. Something went wrong verifying the promo code.');
  }
};
