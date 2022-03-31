module.exports = function linkFlashCredit(sequelize, DataTypes) {
    /**
     * flash_credit
     *
     * @class flash_credit
     * @prop {number} userid
     * @prop {number} studioid
     * @prop {number} credit
     * @prop {datetime} expiration
     * @prop {string} source
     * @prop {number} dibs_studio_id
     * @prop {boolean} is_secret
     * @swagger
     *  definitions:
     *    flash_credit:
     *      type: object
     *      description: information about a user's flash_credits
     *      properties:
     *        userid:
     *          type: integer
     *          description: foreign key reference to dibs_user
     *        studioid:
     *          type: integer
     *          description: reference to studio
     *        credit:
     *          type: number
     *          format: float
     *          description: amount of flash_credit available to user
     *        source:
     *          type: string
     *          description: reference to studio
     *        user_category:
     *          type: string
     *          description: category string for tracking
     *        expiration:
     *          type: string
     *          format: date
     *          description: expiration date of flash_credit
     *        dibs_studio_id:
     *          type: number
     *          description: dibs studio id
     *        is_secret:
     *          type: boolean
     *          description: is_secret is true if the flash credit is secret
     */
    const FlashCredit = sequelize.define(
        'flash_credit',
        {
            userid: {
                type: DataTypes.INTEGER
            },
            studioid: {
                type: DataTypes.INTEGER
            },
            credit: {
                type: DataTypes.INTEGER
            },
            expiration: {
                type: DataTypes.DATE
            },
            source: {
                type: DataTypes.STRING
            },
            user_category: {
                type: DataTypes.STRING
            },
            dibs_studio_id: {
                type: DataTypes.INTEGER
            },
            dibs_brand_id: {
                type: DataTypes.INTEGER
            },
            dibs_portal_userid: {
                type: DataTypes.INTEGER
            },
            is_secret: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            num_receipts_to_redeem: {
                type: DataTypes.INTEGER
            },
            num_receipts: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            }
        },
        {
            paranoid: true
        }
    );

    // FlashCredit.associate = function associate(models) {
    //     models.flash_credit.belongsTo(models.dibs_studio, { as: 'studio', foreignKey: 'dibs_studio_id' });
    //     models.flash_credit.belongsTo(models.dibs_brand, { as: 'brand', foreignKey: 'dibs_brand_id' });
    //     models.flash_credit.belongsTo(models.dibs_transaction, { as: 'transaction', targetKey: 'flash_credit_id', foreignKey: 'id' });
    // };

    FlashCredit.prototype.apiJSON = function apiJSON() {
        return {
            id: this.id,
            dibs_studio_id: this.dibs_studio_id,
            currency: this.currency,
            credit: this.credit,
            expiration: this.expiration,
            num_receipts_to_redeem: this.num_receipts_to_redeem,
            num_receipts: this.num_receipts
        };
    };

    return FlashCredit;
};
