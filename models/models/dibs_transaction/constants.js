const TRANSACTION_TYPES = {
  CLASS: 'class',
  CREDIT: 'cred',
  COMP_CREDIT: 'ccred',
  GIFT_CARD: 'gift',
  CHARITY_DONATION: 'chrty',
  WAITLIST: 'wait',
  PACKAGE: 'pack',
  REFER_A_FRIEND_CREDIT: 'raf',
  RETAIL: 'retail',
};

const TRANSACTION_TYPE_VALUES = ['class', 'cred', 'ccred', 'gift', 'chrty', 'wait', 'pack', 'raf'];

const PURCHASE_PLACES = {
  WIDGET: 'widget',
  STUDIO_ADMIN: 'studio admin',
  SUBSCRIPTION: 'subscription',
  USER_ADMIN: 'user admin',
  MOBILE_APP: 'mobile app',
  DIBS_ADMIN: 'dibs admin',
  OFFSITE: 'offsite',
};

module.exports = {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_VALUES,
  PURCHASE_PLACES,
};
