module.exports = function linkNewsletterSubscriptions(sequelize, DataTypes) {
  /**
   * newsletter_subscriptions
   * @class newsletter_subscriptions
   * @prop {number} id the attendee/visitid
   * @prop {number} email the studio id
   * @prop {number} name thhe class id
   */
  return sequelize.define('newsletter_subscriptions', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
    },
  }, {

  });
};
