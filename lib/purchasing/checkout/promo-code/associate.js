const purchaseErrorLib = require('../../../errors/purchasing');
const Promise = require('bluebird');
const { uniq } = require('lodash');
const { Op } = require('sequelize');

const { PACKAGE, CLASS, UNIVERSAL } = models.promo_code.Products;

module.exports = async function associatePromoCodeToCart(user, cart, promoCode) {
  if (!promoCode || (!promoCode.id && !promoCode.code)) return cart;
  try {
    let promoApplied = false;
    let { packages: packageItems, events: eventItems } = cart;

    const promoCodeToApply = await models.promo_code.findOne({
      where: {
        [Op.or]: [
          { id: promoCode.id },
          {
            code: promoCode.code,
            [Op.or]: [
              { source: 'dibs' },
              {
                dibs_studio_id: uniq([
                  ...cart.events.map(item => item.event),
                  ...cart.packages.map(item => item.studioPackage),
                ].map(obj => obj.dibs_studio_id)),
              },
            ],
          },
        ],
      },
    });

    if ([PACKAGE, UNIVERSAL].includes(promoCodeToApply.product)) {
      packageItems = await Promise.reduce(packageItems, async (acc, item) => {
        if (promoApplied || !item.price) {
          acc.push(item);
          return acc;
        }
        if (promoCodeToApply.source === 'dibs' || promoCodeToApply.dibs_studio_id === item.studioPackage.dibs_studio_id) {
          const promoValidationResult = await models.promo_code.verifyPromoCode(promoCodeToApply.code, user, {
            dibs_studio_id: item.studioPackage.dibs_studio_id,
            product: promoCodeToApply.product,
          });
          if (promoValidationResult.success) {
            item.promoCode = promoCodeToApply;
            promoApplied = true;
            acc.push(item);
            return acc;
          }
          throw new purchaseErrorLib.PromoCodeAssociationError(promoValidationResult.message);
        }
        acc.push(item);
        return acc;
      }, []);
    }

    const eventids = uniq(eventItems.map(({ eventid }) => eventid));
    if (!promoApplied && [CLASS, UNIVERSAL].includes(promoCodeToApply.product)) {
      eventItems = await Promise.reduce(eventItems, async (acc, item) => {
        if (promoApplied || !item.price) {
          acc.push(item);
          return acc;
        }
        if (promoCodeToApply.source === 'dibs' || promoCodeToApply.dibs_studio_id === item.event.dibs_studio_id) {
          const promoValidationResult = await models.promo_code.verifyPromoCode(promoCodeToApply.code, user, {
            dibs_studio_id: item.event.dibs_studio_id,
            eventids,
            product: promoCodeToApply.product,
          });
          if (!promoValidationResult.success) {
            throw new purchaseErrorLib.PromoCodeAssociationError(promoValidationResult.message);
          }
          promoApplied = true;
          item.promoCode = promoCodeToApply;
          acc.push(item);
          return acc;
        }
        acc.push(item);
        return acc;
      }, []);
    }

    if (promoCodeToApply && !promoApplied) {
      throw new purchaseErrorLib.PromoCodeAssociationError('Cart had a promo code that could not be applied.');
    }

    return {
      ...cart,
      packages: packageItems,
      events: eventItems,
    };
  } catch (err) {
    if (err.constructor === purchaseErrorLib.PromoCodeAssociationError) throw err;
    throw new purchaseErrorLib.PromoCodeAssociationError(err);
  }
};
