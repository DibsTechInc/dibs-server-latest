module.exports = function linkFriendReferralReminders(sequelize, DataTypes) {
  const FriendReferralReminder = sequelize.define('friend_referral_reminders', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    friendReferralId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'friend_referrals',
        key: 'id',
      },
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
  }, {
    paranoid: true,
    indexes: [{
      fields: ['id'],
      unique: true,
    }, {
      fields: ['friendReferralId', 'createdAt'],
      unique: true,
    }],
  });
  // FriendReferralReminder.associate = function associate(models) {
  //   const FriendReferral = models.friend_referrals;
  //   const FriendReferralReminders = models.friend_referral_reminders;
  //   FriendReferralReminders.belongsTo(FriendReferral, { foreignKey: 'id', as: 'referral' });
  // };
  return FriendReferralReminder;
};
