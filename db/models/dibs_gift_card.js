const moment = require('moment-timezone');
const uniqid = require('uniqid');

module.exports = function DibsGiftCardModel(sequelize, DataTypes) {
    const DibsGiftCard = sequelize.define('dibs_gift_card', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        senderid: DataTypes.INTEGER,
        recipientid: DataTypes.INTEGER,
        recipient_email: DataTypes.STRING,
        dibs_studio_id: DataTypes.INTEGER,
        promoid: DataTypes.INTEGER,
        redeemedAt: DataTypes.DATE,
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE
    });

    DibsGiftCard.associate = function associate(models) {
        DibsGiftCard.belongsTo(models.dibs_user, { foreignKey: 'senderid', as: 'sender' });
        DibsGiftCard.belongsTo(models.dibs_user, { foreignKey: 'recipientid', as: 'recipient' });
        DibsGiftCard.belongsTo(models.dibs_user, { foreignKey: 'recipient_email', as: 'email', constraints: false });
        // DibsGiftCard.hasOne(models.dibs_transaction, { foreignKey: 'gift_card_id', as: 'transaction' });
        // DibsGiftCard.belongsTo(models.promo_code, { foreignKey: 'promoid', as: 'promoCode' });
        DibsGiftCard.belongsTo(models.dibs_studio, { foreignKey: 'dibs_studio_id', as: 'studio' });
    };

    /**
     * @param {number} senderid who purchased the gift card (userid)
     * @param {string} recipientEmail email who gift card is for
     * @param {Object} dibsTransaction for gift card
     * @param {Object} sqlTransaction for atomic update
     * @returns {Object} newly created gift card instance
     */
    DibsGiftCard.createInstanceAndPromoCode = async function createInstanceWithPromoCode({
        senderid,
        recipientEmail,
        dibsTransaction,
        sqlTransaction
    }) {
        const giftCardCode = uniqid().toUpperCase();
        const commitTransaction = !sqlTransaction;
        const SQLtransaction = sqlTransaction || (await this.sequelize.transaction());

        const promoCode = await this.sequelize.models.promo_code.create({
            amount: dibsTransaction.amount,
            code: giftCardCode,
            expiration: moment().add(1, 'y'),
            user_usage_limit: 1,
            code_usage_limit: 1,
            unique: true,
            dibs_studio_id: dibsTransaction.dibs_studio_id,
            studioid: dibsTransaction.studioid,
            source: dibsTransaction.source,
            type: this.sequelize.models.promo_code.Types.GIFT_CARD,
            first_time_dibs: false,
            first_time_studio_dibs: false,
            grouped_code: false,
            refundable: true,
            product: 'UNIVERSAL'
        });
        const instance = await this.create(
            {
                senderid,
                recipient_email: recipientEmail,
                transactionid: dibsTransaction.id,
                dibs_studio_id: dibsTransaction.dibs_studio_id,
                promoid: promoCode.id
            },
            {
                transaction: SQLtransaction,
                include: [
                    {
                        model: this.sequelize.models.promo_code,
                        as: 'promoCode'
                    }
                ]
            }
        );
        if (commitTransaction) await SQLtransaction.commit();
        return instance;
    };

    /**
     * @param {number} id of gift card
     * @param {number} promoid of promo code gift card created
     * @param {number} userid of recipient
     * @param {Object} transaction SQL transaction for atomic update
     * @returns {Promise<Object>} updated gift card instance
     */
    DibsGiftCard.redeem = async function redeemGiftCard({ id = null, promoid, userid, transaction }) {
        const queryMethod = id ? 'findById' : 'findOne';
        const queryArg = id || { where: { promoid } };
        const instance = await this[queryMethod](queryArg);
        instance.recipientid = userid;
        instance.redeemedAt = new Date();
        return instance.save(transaction ? { transaction } : undefined);
    };

    return DibsGiftCard;
};
