module.exports = function linkMembershipSubscription(sequelize, DataTypes) {
  /**
   * membership_subscription
   *
   * @class membership_subscription
   * @prop {number} userid the user id
   * @prop {number} planid the plan id
   * @prop {string} stripe_subscription_id the subscription id
   */
  const MembershipSubscription = sequelize.define('membership_subscription', {
    userid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_users',
        key: 'id',
      },
    },
    planid: {
      type: DataTypes.INTEGER,
      references: {
        model: 'membership_plans',
        key: 'id',
      },
    },
    stripe_subscription_id: DataTypes.STRING,
  }, {
    paranoid: true,
  });
  MembershipSubscription.associate = function associate(models) {
    models.membership_subscription.belongsTo(models.membership_plan, { foreignKey: 'planid', targetKey: 'id', as: 'plan' });
  };
  return MembershipSubscription;
};
