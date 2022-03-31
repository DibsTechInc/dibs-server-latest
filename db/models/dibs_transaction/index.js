const Decimal = require('decimal.js');
const {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_VALUES,
  PURCHASE_PLACES,
} = require('./constants');
const classMethods = require('./class-methods');
const instanceMethods = require('./instance-methods');

module.exports = function linkDibsTransaction(sequelize, DataTypes) {
  /**
   * dibs_transaction
   * @class dibs_transaction
   * @prop {number} eventid the event id
   * @prop {number} userid the user id
   * @prop {number} stripe_charge_id the stripe charge id
   * @prop {number} stripe_refund_id the stripe refund id
   * @prop {number} amount the transaction amount
   * @prop {string} description the description
   * @prop {string} status the status
   * @prop {string} saleid the sale id
   * @prop {number} studio_credits_spent amount of studio credits spent
   * @prop {number} global_credits_spent amount of Dibs credits spent
   * @prop {number} studioid the studio id
   * @prop {string} source the studio source
   * @prop {number} flash_credit_id the flash credit id
   * @prop {number} promoid the promoid
   * @prop {number} original_price the og price
   * @prop {number} tax_amount the tax amount
   * @prop {number} min_charge_adj the min charge, adjusted
   * @prop {string} type the type of transaction
   * @prop {boolean} void if the transaction has been voided
   * @prop {number} invoiceid relates to studio_invoices table
   * @prop {boolean} late_drop_exception flags if user was awarded credits despite late drop
   * @prop {string} reason_for_late_drop if user gives one
   * @prop {number} dibs_studio_id id of the dibs_studio the transaction belongs to
   * @prop {number} rev_to_attribute how much revenue to attribute to the booking
   * @swagger
   *  definitions:
   *    transaction:
   *      type: object
   *      properties:
   *        eventid:
   *          type: integer
   *        userid:
   *          type: integer
   *        stripe_charge_id:
   *          type: string
   *        stripe_refund_id:
   *          type: string
   *        amount:
   *          type: number
   *          format: float
   *        description:
   *          type: string
   *        status:
   *          type: integer
   *          description: Succesful transactions marked as 1, unsuccesful marked as 0
   *        saleid:
   *          type: integer
   *          description: currently only used by ZingFit for cancelation
   *        studio_credits_spent:
   *          type: number
   *          format: float
   *          description: used to keep track of the number of non_flash credits actually used in transaction
   *        studioid:
   *          type: integer
   *        source:
   *          type: string
   *        flash_credit_id:
   *          type: integer
   *          description: refers to flash credit entry in DB
   *        promoid:
   *          type: integer
   *          description: refers to promo code used on transaction
   *        original_price:
   *          type: number
   *          format: float
   *          description: unmodified price of class at time of booking
   *        tax_amount:
   *          type: number
   *          format: float
   *          description: amount of tax that's on the transaction.amount
   *        min_charge_adj:
   *          type: number
   *          format: float
   *          description: if the transaction amount would be less than 50 cents, but more than 1 cent, this will store the amount of the transaction adjustment
   *        type:
   *          type: string
   *          description: type of transaction
   *        void:
   *          type: boolean
   *          description: if the transaction was voided
   *        invoiceid:
   *          type: number
   *          format: float
   *          description: relates to studio_invoices table
   */
  const DibsTransaction = sequelize.define('dibs_transaction', {
    eventid: {
      type: DataTypes.INTEGER,
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_users',
      },
    },
    stripe_charge_id: {
      type: DataTypes.TEXT,
    },
    stripe_refund_id: {
      type: DataTypes.TEXT,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    description: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.INTEGER,
    },
    saleid: {
      type: DataTypes.STRING,
    },
    studio_credits_spent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    global_credits_spent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    spot_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'spots',
        key: 'id',
      },
    },
    studioid: DataTypes.INTEGER,
    source: DataTypes.STRING(4),
    flash_credit_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'flash_credits',
        key: 'id',
      },
      required: false,
      allowNull: true,
    },
    promoid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'promo_codes',
        key: 'id',
      },
      required: false,
      allowNull: true,
    },
    original_price: DataTypes.FLOAT,
    event_price: DataTypes.FLOAT,
    tax_amount: DataTypes.FLOAT,
    min_charge_adj: DataTypes.FLOAT,
    discount_amount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    early_cancel: DataTypes.BOOLEAN,
    purchasePlace: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: TRANSACTION_TYPE_VALUES,
      allowNull: true,
    },
    drop_source: DataTypes.STRING(6),
    void: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    invoiceid: DataTypes.INTEGER,
    late_drop_exception: DataTypes.BOOLEAN,
    reason_for_late_drop: DataTypes.STRING,
    dibs_studio_id: DataTypes.INTEGER,
    dibs_fee: DataTypes.FLOAT,
    stripe_fee: DataTypes.FLOAT,
    studio_payment: DataTypes.FLOAT,
    tax_withheld: DataTypes.FLOAT,
    stripePayoutId: DataTypes.STRING,
    stripePaymentId: DataTypes.STRING,
    stripeRefundPayoutId: DataTypes.STRING,
    pike13_packid: DataTypes.INTEGER,
    smart_pass_awarded: DataTypes.BOOLEAN,
    raf_credits_spent: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    global_credit_adjustment: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    employeeid: DataTypes.INTEGER,
    stripe_invoice_id: DataTypes.STRING,
    with_passid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'passes',
        key: 'id',
      },
    },
    for_passid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'passes',
        key: 'id',
      },
    },
    passValue: DataTypes.VIRTUAL,
    bonus_amount: DataTypes.FLOAT,
    rev_to_attribute: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    studio_package_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'studio_packages',
        key: 'id',
      },
    },
    retail_product_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'retail_products',
        key: 'id',
      },
    },
    waitlist_id: DataTypes.STRING,
    checkoutUUID: {
      type: DataTypes.UUID,
    },
    unpaid: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    credit_tier_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'credit_tiers',
        key: 'id',
      },
    },
    gift_card_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_gift_cards',
        key: 'id',
      },
    },
    swipe_fees_to_attribute: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    tax_to_attribute: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    net_rev_to_attribute: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },
    amount_charged: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
    amount_refunded: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },
  }, {
    paranoid: true,
    hooks: {
      beforeDestroy(instance) {
        return instance.changed() && instance.changed() !== 'deletedAt' ? instance.save() : null;
      },
    },
    getterMethods: {
      creditsSpent() {
        return +Decimal(this.studio_credits_spent || 0).plus(this.raf_credits_spent || 0);
      },
      applicationFee() {
        if (isNaN(this.dibs_fee) || isNaN(this.tax_withheld)) return undefined;
        if (this.with_passid) return 0;
        return +Decimal(this.dibs_fee).plus(this.tax_withheld);
      },
      applicationFeeWithStripeFee() {
        if (isNaN(this.stripe_fee) || isNaN(this.dibs_fee) || isNaN(this.tax_withheld)) return undefined;
        if (this.with_passid) return 0;
        return +Decimal(this.stripe_fee).plus(this.dibs_fee).plus(this.tax_withheld);
      },
      chargeAmount() {
        if (
          isNaN(this.amount)
          || isNaN(this.studio_credits_spent)
          || isNaN(this.raf_credits_spent)
          || isNaN(this.global_credits_spent)
        ) return undefined;
        if (this.with_passid) return 0;
        return +Decimal(this.amount).minus(this.studio_credits_spent)
          .minus(this.raf_credits_spent)
          .minus(this.global_credits_spent);
      },
      apiJSON() {
        return {
          id: this.id,
          userid: this.userid,
          eventid: this.eventid,
          dibs_studio_id: this.dibs_studio_id,
          amount: this.amount,
          studio_credits_spent: this.studio_credits_spent,
          global_credits_spent: this.global_credits_spent,
          discount_amount: this.discount_amount,
          tax_amount: this.tax_amount,
          original_price: this.original_price,
          min_charge_adj: this.min_charge_adj,
          type: this.type,
          status: this.status,
        };
      },
    },
  });

  DibsTransaction.Types = TRANSACTION_TYPES;
  DibsTransaction.PurchasePlaces = PURCHASE_PLACES;

  Object.keys(classMethods).forEach(method => DibsTransaction[method] = classMethods[method]);
  Object.keys(instanceMethods).forEach(method => DibsTransaction.prototype[method] = instanceMethods[method]);

  return DibsTransaction;
};
