const defaultCheckItemForCharge = item => (item.dibsTransaction.chargeAmount > 0);

module.exports = {
  checkEventItemForCharge: item => (!item.passid && item.dibsTransaction.chargeAmount > 0),
  checkPackItemForCharge: defaultCheckItemForCharge,
  checkGiftCardItemForCharge: defaultCheckItemForCharge,
};
