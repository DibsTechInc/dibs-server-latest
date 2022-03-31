const Decimal = require('decimal.js');

module.exports = function linkCredits(sequelize, DataTypes) {
  /**
   * credit
   * @class credit
   * @prop {number} userid the userid
   * @prop {number} studioid the studio id
   * @prop {number} credit the credit amount
   * @prop {string} source the credit source
   * @swagger
   *  definitions:
   *    credit:
   *      type: object
   *      description: information about a user's credits
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
   *          description: amount of credits available to user
   *        source:
   *          type: string
   *          description: reference to studio
   */
  const Credit = sequelize.define('credit', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
    },
    studioid: {
      type: DataTypes.INTEGER,
    },
    credit: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
    currency: DataTypes.STRING(3),
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    dibs_brand_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_brands',
        key: 'id',
      },
    },
    dibs_portal_userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_portal_users',
        key: 'id',
      },
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    load_bonus: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,
    },
  }, {
    paranoid: true,
  });

  Credit.associate = function associate(models) {
    models.credit.belongsTo(models.dibs_studio, { as: 'studio', foreignKey: 'dibs_studio_id' });
    models.credit.belongsTo(models.dibs_brand, { as: 'brand', foreignKey: 'dibs_brand_id' });
  };

  /**
   * @param {Object} options for getting available balance
   * @param {boolean} options.allowLoadBonus if true, consider load bonuses as part of the available balance
   * @returns {number} available credit balance
   */
  Credit.prototype.getAvailableBalance = function getAvailableBalance({ allowLoadBonus = true } = {}) {
    return +Decimal(this.credit).minus(Number(!allowLoadBonus && this.load_bonus));
  };

  /**
   * @param {number} amount of credit to deduct
   * @param {Object} options for credit update
   * @returns {Object} updated instance
   */
  Credit.prototype.deductAmount = async function deductAmount(amount, {
    transaction = null,
    associatedTransactionId = null,
    useLoadBonus = true,
    creditTransactionType = null,
  } = {}) {
    const newCreditAmount = +Decimal(this.credit).minus(Math.min(amount, this.credit));
    const commitTransaction = !transaction;
    transaction = transaction || await this.sequelize.transaction();
    await this.sequelize.models.credit_transaction.create({
      creditid: this.id,
      transaction_id: associatedTransactionId,
      before_credit: +this.credit,
      after_credit: newCreditAmount,
      type: creditTransactionType,
      dibs_studio_id: this.dibs_studio_id,
      userid: this.userid,
    }, { transaction });
    this.credit = newCreditAmount;
    if (useLoadBonus) this.load_bonus = Math.max(0, Decimal(this.load_bonus).minus(amount));
    await this.save({ transaction });
    if (commitTransaction) await transaction.commit();
    return this;
  };

  /**
   * @param {number} amount of credit to add
   * @param {Object} options determines whether to create sql transaction and to associate a dibs_transaction
   * @returns {Object} credit instance after update
   */
  Credit.prototype.addAmount = async function addAmount(amount, {
    transaction = null,
    associatedTransactionId = null,
    associatedPromoid = null,
    creditTier,
    creditTransactionType = null,
  } = {}) {
    const newCreditAmount = +Decimal(+this.credit).plus(amount);
    const commitTransaction = !transaction;

    transaction = transaction || await this.sequelize.transaction();
    await this.sequelize.models.credit_transaction.create({
      creditid: this.id,
      transaction_id: associatedTransactionId,
      before_credit: +this.credit,
      after_credit: newCreditAmount,
      credit_tier_id: creditTier ? creditTier.id : null,
      type: creditTransactionType,
      dibs_studio_id: this.dibs_studio_id,
      userid: this.userid,
      promoid: associatedPromoid,
    }, { transaction });
    this.credit = newCreditAmount;
    this.load_bonus = creditTier ? +Decimal(this.load_bonus).plus(creditTier.loadBonus) : this.load_bonus;
    await this.save({ transaction });
    if (commitTransaction) await transaction.commit();
    return this;
  };

  Credit.prototype.apiJSON = function apiJSON() {
    return {
      id: this.id,
      dibs_studio_id: this.dibs_studio_id,
      currency: this.currency,
      credit: this.credit,
    };
  };

  return Credit;
};
