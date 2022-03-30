const moment = require('moment-timezone');
const Decimal = require('decimal.js');
const { Op } = require('sequelize');
// const { handleError } = require('@dibs-tech/dibs-error-handler');
const { handleError } = require('../../lib/dibs-error-handler');

module.exports = function linkPasses(sequelize, DataTypes) {
  /**
   * contact_forms
   * @class contact_forms
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  const Pass = sequelize.define('passes', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    studio_package_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'studio_packages',
        key: 'id',
      },
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
    deletedAt: DataTypes.DATE,
    expiresAt: DataTypes.DATE,
    canceledAt: DataTypes.DATE,
    totalUses: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      validate: {
        min: 0,
        max: Infinity,
      },
      allowNull: true,
    },
    usesCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
        max: Infinity,
      },
    },
    autopay: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    passValue: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    onDibs: DataTypes.BOOLEAN,
    source_serviceid: DataTypes.STRING,
    clientid: DataTypes.STRING,
    dibs_autopay_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_user_autopay_packages',
        key: 'id',
      },
    },
    expiration_set_by_transaction: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
    },
    private_pass: {
      type: DataTypes.BOOLEAN,
    },
    cancel_notified_at: DataTypes.VIRTUAL,
  }, {
    paranoid: true,
    indexes: [{
      fields: ['dibs_studio_id'],
      unique: false,
    }, {
      fields: ['studio_package_id'],
      unique: false,
    }],
  });

  Pass.associate = function associate(models) {
    models.passes.belongsTo(models.studio_packages, {
      foreignKey: 'studio_package_id',
      as: 'studioPackage',
    });
    models.passes.belongsTo(models.dibs_user_autopay_packages, {
      foreignKey: 'dibs_autopay_id',
      as: 'userAutopayPackage',
    });
    models.passes.belongsTo(models.dibs_user, {
      foreignKey: 'userid',
      as: 'user',
    });
    models.passes.belongsTo(models.dibs_transaction, {
      foreignKey: 'id',
      as: 'purchaseTransaction',
    });
  };

  Pass.createNewPass = function createNewPass({
    user,
    studioPackage,
    studio,
    purchaseTransactionId,
    amountPaid,
    autopay = false,
    userAutopayPackageId = null,
    save = false,
  } = {}) {
    let calculatedPassValue = new Decimal(amountPaid).dividedBy(studioPackage.classAmount).toDecimalPlaces(2).toNumber();
    let expirationDate = studioPackage.passesValidFor && !studioPackage.expires_after_first_booking ? (
      moment().tz(studio.mainTZ)
              .endOf('day')
              .add(studioPackage.passesValidFor, studioPackage.validForInterval)
              .toISOString()
    ) : null;
    if (studioPackage.classAmount === 0) {
      calculatedPassValue = 0;
      expirationDate = moment().tz(studio.mainTZ);
    }
    const instance = this.build({
      purchase_transaction_id: purchaseTransactionId,
      userid: user.id,
      dibs_studio_id: studioPackage.dibs_studio_id,
      expiresAt: expirationDate,
      studio_package_id: studioPackage.id,
      totalUses: studioPackage.unlimited ? null : studioPackage.classAmount,
      passValue: studioPackage.unlimited ? 0 : calculatedPassValue,
      autopay,
      deletedAt: new Date(), // prevent the pass from being awarded until the transaction saves
      dibs_autopay_id: userAutopayPackageId,
      onDibs: true,
    });
    if (!save) return instance;
    return instance.save();
  };

  Pass.prototype.addUses = function addUses(uses, { save = false, transaction = null } = {}) {
    this.usesCount += uses;
    if (!save) return this;
    return this.save(transaction ? { transaction } : undefined);
  };

  Pass.prototype.returnUses = function returnUses(uses, { save = false, transaction = null } = {}) {
    this.usesCount -= uses;
    if (!save) return this;
    return this.save(transaction ? { transaction } : undefined);
  };

  Pass.prototype.returnFromTransaction = async function returnFromTransaction({ save = false, transaction = null, associatedTransactionId = null } = {}) {
    if (this.source_serviceid) return;
    if (moment(this.expiresAt).isBefore(moment())
      && !this.studioPackage.unlimited) {
      this.user.addCreditForStudio(this.passValue, this.studioPackage.studio, { save, transaction, associatedTransactionId });
    } else {
      await this.returnUses(1, { save, transaction });
    }
  };

  /**
   * isValidForUseAtStudio - Description
   * @memberof pass
   * @instance
   * @param {number} dibsStudioId the studio to check if its valid at
   * @returns {bool} whether pass is valid for use at a given studio
   */
  Pass.prototype.isValidForUseAtStudio = function isValidForUseAtStudio(dibsStudioId) {
    return (
      (!this.totalUses || this.usesCount < this.totalUses || this.autopay)
      && (!this.expiresAt || (moment() < moment(this.expiresAt)))
      && this.dibs_studio_id === dibsStudioId
    );
  };

  /**
   * isBookingIntoNextMonth - Description
   * @memberof pass
   * @instance
   * @param {Date|string} eventStartDate date of the event
   * @returns {bool} whether pass is valid for use at a given studio
   */
  Pass.prototype.isBookingIntoNextMonth = function isBookingIntoNextMonth(eventStartDate) {
    return this.autopay && moment(eventStartDate) > moment(this.expiresAt) && this.userAutopayPackage;
  };

  /**
   * reachedDailyUsageLimit - Description
   * @memberof pass
   * @instance
   * @param {Date|string} eventStartDate date of the event
   * @param {number} currentUses use count of the pass in the cart on that day
   * @returns {bool} whether pass has reached its daily use limit if it has one
   */
  Pass.prototype.reachedDailyUsageLimit = async function reachedDailyUsageLimit(eventStartDate, currentUses) {
    if (this.studioPackage && !this.studioPackage.dailyUsageLimit) return false;
    const transactionCount = await this.constructor.sequelize.models.dibs_transaction.count({
      where: {
        status: 1,
        void: { $or: [false, null] },
        userid: this.userid,
        early_cancel: { $or: [false, null] },
        eventid: { $ne: null },
        dibs_studio_id: this.dibs_studio_id,
        with_passid: this.id,
      },
      include: [{
        model: models.event,
        as: 'event',
        where: {
          start_date: {
            $and: {
              $lte: moment(eventStartDate).endOf('day'),
              $gte: moment(eventStartDate).startOf('day'),
            },
          },
        },
        required: true,
      }],
    });
    return transactionCount + currentUses > this.studioPackage.dailyUsageLimit;
  };

  Pass.prototype.setExpirationFromEvent = function setExpirationFromEvent({
    event,
    dibsTransactionId,
    save = false,
    transaction,
    overwrite = false,
  } = {}) {
    const eventStart = moment.tz(event.start_date, event.studio.mainTZ);
    if (this.expiresAt && !overwrite) {
      /*
      Passes' expiration should be set the package's interval out after
      the first visit on the pass. So if the user books a class that
      starts sooner than the class that set the expiration, we need to change
      it to be based on the earlier visit date.
      */
      const startOfValidInterval = moment(this.expiresAt).subtract(this.studioPackage.passesValidFor, this.studioPackage.validForInterval);
      if (eventStart >= startOfValidInterval) return this;
    }
    this.expiration_set_by_transaction = dibsTransactionId;
    this.expiresAt = eventStart.add(this.studioPackage.passesValidFor, this.studioPackage.validForInterval)
                               .endOf('day')
                               .toDate();
    if (!save) return this;
    return this.save(transaction ? { transaction } : undefined);
  };

  Pass.prototype.resetExpirationSetByEvent = async function resetExpirationSetByEvent({ save = true, transaction } = {}) {
    try {
      /*
      Passes' expiration should be set the package's interval out after
      the first visit on the pass. So when they drop the transaction that
      set the pass's expiration, it needs to set the expiration based on the
      next soonest class.
      */
      const dibsTransaction = await this.sequelize.models.dibs_transaction.findOne({
        where: {
          id: { [Op.not]: this.expiration_set_by_transaction },
          with_passid: this.id,
          status: 1,
        },
        order: [[{ model: models.event, as: 'event' }, 'start_date', 'ASC']],
        include: [{
          model: this.sequelize.models.event,
          as: 'event',
          include: [{
            model: this.sequelize.models.dibs_studio,
            as: 'studio',
            attributes: ['mainTZ'],
          }],
        }],
      });
      if (dibsTransaction) {
        return this.setExpirationFromEvent({
          event: dibsTransaction.event,
          dibsTransactionId: dibsTransaction.id,
          save,
          transaction,
          overwrite: true,
        });
      }
      this.expiresAt = null;
      this.expiration_set_by_transaction = null;
      if (!save) return this;
      return this.save(transaction ? { transaction } : undefined);
    } catch (err) {
      return handleError({
        opsSubject: 'Pass Expiration Reset Error',
        opsIncludes: `Pass ${this.id}`,
      })(err);
    }
  };

  Pass.prototype.shouldDisplay = function shouldPassDisplay() {
    return (
      (!this.expiresAt || (moment() < moment(this.expiresAt))) // hasn't expired
      && (!this.purchaseTransaction || !this.purchaseTransaction.stripe_refund_id)
    );
  };

  Pass.prototype.isValid = function isPassValid() {
    return this.shouldDisplay() && (
      !this.totalUses || this.usesCount < this.totalUses || this.autopay);
  };

  Pass.prototype.isValidForFrontDesk = function isPassValidForFrontDesk() {
    return this.shouldDisplay() && (
      !this.totalUses
      || this.usesCount < this.totalUses
      || this.autopay
    );
  };

  Pass.prototype.apiJSON = function apiJSON() {
    return {
      id: this.id,
      passValue: this.passValue,
      userid: this.userid,
      autopay: this.autopay,
      totalUses: this.totalUses,
      usesCount: this.usesCount,
      expiresAt: this.expiresAt,
    };
  };
  return Pass;
};
