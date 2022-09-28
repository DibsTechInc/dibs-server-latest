/**
 * @returns {Array<Object>} list of drop includes for events
 */
function getEventsSQLInclude() {
  return [{
    model: models.dibs_studio,
    as: 'studio',
    include: [{
      model: models.dibs_config,
      as: 'dibs_config',
    }],
  }, {
    model: models.dibs_studio_instructors,
    as: 'instructor',
    attributes: [
      'id',
      'firstname',
      'lastname',
    ],
  }, {
    model: models.dibs_studio_locations,
    as: 'location',
    attributes: [
      'name',
      'short_name',
      'cityOverride',
      'tax_rate',
      'address',
      'city',
      'state',
      'zipcode',
      'id',
      'region_id',
    ],
  }];
}

/**
 * @returns {Array<Object>} list of drop includes for transactions
 */
function getTransactionsSQLInclude() {
  return [{
    model: models.flash_credit,
    as: 'flashCredit',
    paranoid: false,
    attributes: [
      'id',
      'credit',
    ],
  }, {
    model: models.promo_code,
    as: 'promo_code',
    attributes: [
      'id',
      'code',
      'type',
      'amount',
      'refundable',
    ],
    include: [{
      model: models.promo_codes_user,
      as: 'currentPCUser',
      attributes: ['createdAt'],
    }],
  }, {
    model: models.dibs_studio,
    as: 'dibs_studio',
    key: 'dibs_studio_id',
    include: [{
      model: models.whitelabel_custom_email_text,
      as: 'custom_email_text',
      key: 'dibs_studio_id',
    },
    {
      model: models.dibs_config,
      as: 'dibs_config',
    }],
  }, {
    model: models.passes,
    as: 'pass',
    include: [{
      model: models.studio_packages,
      as: 'studioPackage',
      attributes: ['passesValidFor', 'validForInterval'],
    }],
  }, {
    model: models.event,
    as: 'event',
    attributes: [
      'classid',
      'description',
      'dibs_studio_id',
      'eventid',
      'name',
      'source',
      'start_date',
    ],
    include: getEventsSQLInclude(),
  }];
}

module.exports = {
  getTransactionsSQLInclude,
  getEventsSQLInclude,
};
