const { format: formatCurrency } = require('currency-formatter');
const Decimal = require('decimal.js');

module.exports = function linkStripePayouts(sequelize, DataTypes) {
  const StripePayouts = sequelize.define('stripe_payouts', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: false,
      unique: true,
    },
    object: DataTypes.STRING,
    stripe_account_id: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    arrival_date: DataTypes.DATE,
    balance_transaction: DataTypes.STRING,
    created: DataTypes.INTEGER,
    currency: DataTypes.STRING(3),
    description: DataTypes.STRING,
    destination: DataTypes.STRING,
    failure_balance_transaction: DataTypes.STRING,
    failure_code: DataTypes.STRING,
    failure_message: DataTypes.STRING,
    livemode: DataTypes.BOOLEAN,
    metadata: DataTypes.JSONB,
    method: DataTypes.STRING,
    source_type: DataTypes.STRING,
    statement_descriptor: DataTypes.STRING,
    status: DataTypes.STRING,
    type: DataTypes.STRING,
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    deletedAt: DataTypes.DATE,
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studio',
        key: 'id',
      },
    },
  }, {
    paranoid: true,
    indexes: [{
      fields: ['id'],
      unique: true,
    }],
  });

  StripePayouts.prototype.formatPayoutsTabJSON = function formatPayoutsTabJSON(stripeBankAccounts) {
    const properPayoutAmount = Decimal(this.amount).dividedBy(100).toNumber();
    const properBankAccount = stripeBankAccounts.find(sBA => sBA.id === this.destination);
    const formattedBankData = `${properBankAccount.bank_name} ****${properBankAccount.last4}`;
    return {
      id: this.id,
      amount: formatCurrency(properPayoutAmount, { code: this.currency && this.currency.toUpperCase() }),
      date: this.arrival_date,
      bankAccount: formattedBankData,
    };
  };

  return StripePayouts;
};
