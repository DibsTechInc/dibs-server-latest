const errorHelper = require('@dibs-tech/dibs-error-handler');
const { apiFailureWrapper, apiSuccessWrapper } = require('../../../lib/helpers/api-wrappers');
const { format: formatCurrency } = require('currency-formatter');
const redisInterface = require('@dibs-tech/redis-interface');

module.exports = async function applyCredits(user, { source } = {}) {
  try {
    if (
      ![
        this.constructor.Types.GIFT_CARD,
        this.constructor.Types.ADD_CREDIT,
      ].includes(this.type)
    ) throw new Error('This code is not for adding credit.');

    let { studio } = this;
    if (!studio) {
      studio = await this.sequelize.models.dibs_studio.findById(
        this.dibs_studio_id,
        { attributes: ['currency', 'name'] }
      );
    }
    let currency = 'USD';
    if (studio) currency = studio.currency || 'USD';

    const [credit] = await models.credit.findOrCreate({
      where: {
        dibs_studio_id: this.dibs_studio_id, // TODO global credits won't work here?
        userid: user.id,
        source: source
      },
    });

    await this.sequelize.transaction(transaction =>
      Promise.all([
        this.applyCodeToUser(user.id, transaction),
        credit.addAmount(this.amount, {
          associatedPromoid: this.id,
          creditTransactionType: this.sequelize.models.credit_transaction.Types.PROMO_CODE,
          transaction,
        }),
        this.type === this.constructor.Types.GIFT_CARD
        && models.dibs_gift_card.redeem({
          promoid: this.id,
          userid: user.id,
          transaction,
        }),
      ]));

    const formattedAmount = formatCurrency(this.amount, {
      code: currency,
      precision: this.amount % 1 && 2,
    });
    const message = this.dibs_studio_id ?
      `You have added ${formattedAmount} credit for ${studio.name} to your account.`
      : `You have added ${formattedAmount} to your Dibs Account`;

    await user.reload();
    await redisInterface.updateInstance(user);
    return apiSuccessWrapper({ promoCode: this, user: user.clientJSON() }, message);
  } catch (err) {
    errorHelper.handleError({
      opsSubject: 'Promo Code Credit Application Error',
      opsIncludes: `Promo Code ${this.code}`,
      userid: user.id,
    })(err);
    return apiFailureWrapper(
      Object.assign({}, err), 'Oops. Something went wrong. Please re-attempt or call 646.760.3427.');
  }
};
