const moment = require('moment-timezone');
const { normalizeEmail } = require('validator');
const { Op } = require('sequelize');


module.exports = function linkFriendReferrals(sequelize, DataTypes) {
  const FriendReferral = sequelize.define('friend_referrals', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    },
    firstName: DataTypes.STRING,
    email: DataTypes.STRING,
    normalizedEmail: DataTypes.STRING,
    referredUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    },
    referredTransactionId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_transactions',
        key: 'id',
      },
    },
    amount: DataTypes.INTEGER,
    raf_source: DataTypes.STRING,
    creditsAwarded: DataTypes.INTEGER,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    method: DataTypes.STRING(20),
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
  }, {
    paranoid: true,
    hooks: {
      beforeCreate(friendReferral) {
        // eslint-disable-next-line no-param-reassign
        friendReferral.firstName = `${friendReferral.firstName[0].toUpperCase()}${friendReferral.firstName.slice(1)}`;
      },
    },
    indexes: [{
      fields: ['id'],
      unique: true,
    }, {
      fields: ['userid'],
    }, {
      fields: ['email'],
    }, {
      fields: ['normalizedEmail'],
    }, {
      fields: ['referredTransactionId'],
    }],
  });

  FriendReferral.GLOBAL_RAF_AWARD = 5;

  FriendReferral.associate = function associate(models) {
    FriendReferral.belongsTo(
      models.dibs_user, { foreignKey: 'userid', as: 'referringUser' });
    FriendReferral.belongsTo(
      models.dibs_user, { foreignKey: 'referredUserId', as: 'referredUser' });
    FriendReferral.hasMany(
      models.friend_referral_reminders, { foreignKey: 'friendReferralId', as: 'reminders' });
    FriendReferral.belongsTo(
      models.dibs_transaction, { foreignKey: 'referredTransactionId', as: 'referredTransaction' });
    FriendReferral.belongsTo(
      models.dibs_studio, { foreignKey: 'dibs_studio_id', as: 'studio' });
  };

  FriendReferral.referralCreditValidDate = function referralCreditValidDate() {
    return moment().startOf('day').subtract(90, 'days').format();
  };

  /**
   * @param {number} dibsStudioId the id of the studio for the referral, global is 0
   * @param {Object} referrer user making the referral
   * @param {Object} referree user who is getting referral, if they exist
   * @param {string} email of referree
   * @param {string} firstName of referree
   * @param {string} rafSource where referral was made
   * @param {number} amount of credit to reward
   *
   * @returns {Promise<Object>} resolves the newly created referral instance
   */
  FriendReferral.createNew = async function createNew({
    amount,
    dibsStudioId,
    email,
    firstName,
    method = 'refer-a-friend',
    rafSource,
    referree,
    referrer,
    transaction,
  }) {
    const normalizedEmail = normalizeEmail(email);
    const [
      referral,
      created,
    ] = await FriendReferral.findOrCreate({
      where: {
        normalizedEmail,
        createdAt: {
          [Op.gt]: moment().subtract(90, 'days').startOf('day').toDate(),
        },
        dibs_studio_id: dibsStudioId,
      },
      include: [{
        model: models.dibs_user,
        as: 'referringUser',
        attributes: ['id', 'firstName', 'lastName', 'email', 'default_currency'],
      }, {
        model: this.sequelize.models.friend_referral_reminders,
        as: 'reminders',
        attributes: ['id', 'createdAt'],
      }],
      defaults: {
        createdAt: new Date(),
        amount,
        userid: referrer.id,
        email,
        method,
        normalizedEmail,
        firstName,
        referredUserId: referree && referree.id,
        reminders: [{
          createdAt: new Date(),
          updatedAt: new Date(),
        }],
        raf_source: rafSource,
        transaction: transaction || undefined,
      },
    });
    if (!created) {
      throw this.AlreadyInvitedError;
    }
    return referral;
  };

  FriendReferral.AlreadyInvitedError = new Error('Already invited');

  return FriendReferral;
};
