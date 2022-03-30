module.exports = function DibsStudioModel(sequelize, DataTypes) {
  /**
   * dibs_studio
   * @class dibs_studio
   * @prop {string} name the studio name
   * @prop {string} login the studio login
   * @prop {string} password the studio password
   * @prop {number} studioid the studio id
   * @prop {string} source the studio source
   * @prop {string} dibs_contact the dibs contact
   * @prop {string} dibs_phone the dibs contact phone
   * @prop {string} dibs_email the dibs contact email
   * @prop {string} billing_contact the billing contact
   * @prop {boolean} [live=false] whether the studio is live
   * @prop {object} optimizations the studios optimizations
   * @prop {object} [optimizations.direct_engagement=false] the studios direct_engagement
   * @prop {object} [optimizations.new_stuff=false] the studios new_stuff
   * @prop {object} [optimizations.reduce_abandonment=false] the studios reduce_abandonment
   * @prop {object} [optimizations.drive_traffic=false] the studios drive_traffic
   * @prop {object} [optimizations.shift_focus=false] the studios shift_focus
   * @prop {object} [optimizations.remove_cap=false] the studios remove_cap
   * @prop {object} [optimizations.weather=false] the studios weather
   * @prop {boolean} [incentives=false] whether the studio has incentives
   * @prop {number} [incentive_amount=100] the incentive amount
   * @prop {string} iframe the iframe url
   * @prop {string} google_analytics_tracking_id the ga id
   * @prop {string} paramName the parameter name
   * @prop {string} currency the currency
   * @prop {object} dibs_config variables
   * @prop {string} short_name shortened studio name
   * @prop {Number} widget_fee_rate Dibs fee rate on Widget
   * @prop {Number} admin_fee_rate Dibs fee rate on User Admin
   * @prop {STRING} stripe_account_id   account id for managed accounts
   * @prop {boolean} sync flags if we should sync the studio
   * @prop {Object} dashboard_json data for the dashboard views
   * @prop {string} widget_url url for widget if different for domain
   * @prop {boolean} clicked_mb_link whether the studio has given us mindbody access by clicking link
   * @prop {string} stripeid customer id in stripe
   * @prop {string} stripe_cardid the cardid for stripe
   * @prop {Number} subscription_fee how much a studio pays per month
   * @prop {Number} total_monthly_charge total subscription fee including tax
   * @prop {Number} date_of_charge day of the month that their subscription renews
   */
  const DibsStudio = sequelize.define('dibs_studio', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    studioid: DataTypes.INTEGER,
    source: DataTypes.STRING(4),
    billing_contact: DataTypes.STRING,
    billing_email: DataTypes.STRING,
    mailing_address1: DataTypes.STRING,
    mailing_address2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    live: DataTypes.BOOLEAN,
    primary_locationid: DataTypes.INTEGER,
    google_analytics_tracking_id: DataTypes.STRING,
    paramName: DataTypes.STRING,
    tmp_dibs_config: DataTypes.JSON,
    description: DataTypes.TEXT,
    country: DataTypes.STRING,
    mainTZ: {
      type: DataTypes.STRING,
      defaultValue: 'America/New_York',
    },
    cp_amount: {
      type: DataTypes.FLOAT,
      defaultValue: 16,
    },
    short_name: {
      type: DataTypes.TEXT,
    },
    canRemotelyLogin: {
      type: DataTypes.BOOLEAN,
    },
    defaultCreditTiers: {
      type: DataTypes.JSONB,
      defaultValue: [{
        payAmount: 50,
        receiveAmount: 55,
      },
      {
        payAmount: 100,
        receiveAmount: 110,
      },
      {
        payAmount: 150,
        receiveAmount: 165,
      }],
    },
    widget_fee_rate: {
      type: DataTypes.FLOAT,
    },
    admin_fee_rate: {
      type: DataTypes.FLOAT,
    },
    stripe_account_id: DataTypes.STRING,
    intro_promo_code_id: DataTypes.INTEGER,
    domain: DataTypes.STRING,
    studio_email: DataTypes.STRING,
    logo: DataTypes.TEXT,
    color_logo: DataTypes.TEXT,
    welcome_text: DataTypes.TEXT,
    hero_url: DataTypes.STRING,
    currency: DataTypes.STRING(3),
    cancel_time: DataTypes.INTEGER,
    source_sandbox: DataTypes.BOOLEAN,
    source_dibscode: DataTypes.TEXT,
    onboardingDescription: DataTypes.STRING,
    liveWidget: DataTypes.BOOLEAN,
    liveAdmin: DataTypes.BOOLEAN,
    client_token: DataTypes.STRING,
    client_id: DataTypes.STRING,
    client_secret: DataTypes.STRING,
    widget_url: {
      type: DataTypes.STRING,
      defaultValue: '',
    },
    pike13_dibs_product_id: DataTypes.INTEGER,
    api_version: DataTypes.INTEGER,
    widgetReferAFriend: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    front_desk: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    allowPackages: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    offboard_at: DataTypes.DATE,
    custom_email_template: DataTypes.JSON,
    requiresWaiverSigned: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    customSendingDomain: DataTypes.STRING,
    onboardedAt: DataTypes.DATE,
    zf_reporting_id: DataTypes.STRING,
    zf_reporting_secret: DataTypes.STRING,
    clicked_mb_link: DataTypes.BOOLEAN,
    hasPackages: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
    hasPayouts: DataTypes.VIRTUAL(DataTypes.BOOLEAN),
    stripeid: DataTypes.STRING,
    stripe_cardid: DataTypes.STRING,
    subscription_fee: DataTypes.FLOAT,
    total_monthly_charge: DataTypes.FLOAT,
    date_of_charge: DataTypes.INTEGER,
  }, {
    hooks: {
      /**
       * sets the param name
       * @memberof studio
       * @instance
       * @param {string} studio the studio
       * @returns {undefined}
       */
      beforeCreate(studio) {
        studio.paramName = studio.getParamName(); // eslint-disable-line no-param-reassign
      },
      /**
       * sets the param name
       * @memberof studio
       * @instance
       * @param {string} studio the studio
       * @returns {undefined}
       */
      beforeUpdate(studio) {
        if (studio.changed('name') || studio.paramName === null) {
          studio.paramName = studio.getParamName(); // eslint-disable-line no-param-reassign
        }
      },
    },
  });
  DibsStudio.associate = function associate(models) {
    DibsStudio.hasMany(models.dibs_studio_locations, {
      foreignKey: 'dibs_studio_id',
      as: 'locations',
    });
    DibsStudio.hasMany(models.dibs_studio_instructors, {
      foreignKey: 'dibs_studio_id',
      as: 'instructors',
    });
    DibsStudio.hasMany(models.event, {
      foreignKey: 'dibs_studio_id',
      as: 'events',
    });
    DibsStudio.hasMany(models.attendees, {
      foreignKey: 'dibs_studio_id',
      as: 'attendees',
    });
    DibsStudio.belongsTo(models.promo_code, {
      foreignKey: 'intro_promo_code_id',
      as: 'intro_promo_code',
      targetKey: 'id',
      constraints: false,
    });
    DibsStudio.hasMany(models.special_notifications, {
      foreignKey: 'dibs_studio_id',
      as: 'special_notifications',
    });
    DibsStudio.hasMany(models.studio_packages, {
      foreignKey: 'dibs_studio_id',
      as: 'studio_packages',
    });
    DibsStudio.hasOne(models.dibs_config, {
      foreignKey: 'dibs_studio_id',
      as: 'dibs_config',
    });
    DibsStudio.hasMany(models.whitelabel_custom_email_text, {
      foreignKey: 'dibs_studio_id',
      as: 'custom_email_text',
    });
    DibsStudio.hasMany(models.stripe_payouts, {
      foreignKey: 'dibs_studio_id',
      as: 'studio_payouts',
    });
    DibsStudio.hasMany(models.dibs_transaction, {
      foreignKey: 'dibs_studio_id',
      as: 'transactions',
    });
    DibsStudio.hasMany(models.credit_tier, {
      foreignKey: 'dibs_studio_id',
      as: 'creditTiers',
    });
  };

  DibsStudio.prototype.getParamName = function /**
       * getParamName - Description
       * @memberof studio
       * @instance
       * @returns {string} parameterized string name
       */
    getParamName() {
    return this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };
  return DibsStudio;
};
