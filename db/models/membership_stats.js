module.exports = function linkReceipt(sequelize, DataTypes) {
    /**
     * membership_stats
     * @prop {number} id primary key
     * @prop {number} eventid of the class
     * @prop {string} email of the user
     * @prop {number} userid where available
     */
    const membershipStats = sequelize.define('membership_stats', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      dibs_studio_id: {
        type: DataTypes.INTEGER,
      },
      num_memberships: {
        type: DataTypes.INTEGER,
      },
      num_visits: {
        type: DataTypes.INTEGER,
      },
      total_revenue: {
        type: DataTypes.FLOAT,
      },
      total_stripe_fees: {
        type: DataTypes.FLOAT,
      },
      total_tax: {
        type: DataTypes.FLOAT,
      },
      total_net_rev: {
        type: DataTypes.FLOAT,
      },
      rev_per_visit: {
        type: DataTypes.FLOAT,
      }, 
      avg_tax_per_visit: {
        type: DataTypes.FLOAT,
      },
      avg_stripe_fee_per_visit: {
        type: DataTypes.FLOAT,
      },
      net_rev_per_visit: {
        type: DataTypes.FLOAT,
      },
      valid_from: {
        type: DataTypes.DATE,
      },
      valid_to: {
        type: DataTypes.DATE,
      },
      createdAt: {
        type: DataTypes.DATE,
      },
      updatedAt: {
        type: DataTypes.DATE,
      },
      deletedAt: {
        type: DataTypes.DATE,
      },
    }, {});
  
    return membershipStats;
  };
  