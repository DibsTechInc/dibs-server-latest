const Promise = require('bluebird');
const bcrypt = require('bcrypt');
const moment = require('moment');
const shortid = require('shortid');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const PNF = require('google-libphonenumber').PhoneNumberFormat;
const publishCheckReferral = require('../lib/publishers/referral-registration-checker');
const axios = require('axios');
// const { updateInstance } = require('@dibs-tech/redis-interface');
const { Op } = require('sequelize');
const { updateInstance } = require('../../lib/dibs-redis-interface');

const HIGH_VALUE_SPEND_THRESHOLD = 100;
const DEFAULT_PAST_DAYS = 30;

/* eslint-disable no-param-reassign */

/**
 * @swagger
 *  definitions:
 *    userEventObj:
 *      type: object
 *      properties:
 *        eventid:
 *          type: integer
 *        description:
 *          type: string
 *        name:
 *          type: string
 *        price:
 *          type: integer
 *        instructorFirstName:
 *          type: string
 *        instructorLastName:
 *          type: string
 *        start_date:
 *          type: string
 *          format: date
 *        end_date:
 *          type: string
 *          format: date
 *        studioLogo:
 *          type: string
 *        studioName:
 *          type: string
 *        city:
 *          type: string
 *        state:
 *          type: string
 *        zipcode:
 *          type: integer
 *        locationname:
 *          type: string
 *        currency:
 *          type: string
 *
 */
module.exports = function linkDibsUser(sequelize, DataTypes) {
  /**
   * dibs_user
   * @class dibs_user
   * @prop {number} id the user id
   * @prop {string} firstName the user firstname
   * @prop {string} lastName the user last name
   * @prop {string} email the user email
   * @prop {string} password the user password
   * @prop {string} mobilephone the user mobilephone
   * @prop {string} address1 the first line of user address
   * @prop {string} address2 the second line of the user address
   * @prop {string} city the user city
   * @prop {string} state the user state
   * @prop {string} zip the user zip
   * @prop {string} birthday the user birthday
   * @prop {string} pictureUrl the user picture url
   * @prop {string} stripeid the user stripe id
   * @prop {string} stripe_cardid the stripe cardid
   * @prop {string} emergencycontactname the user emergencycontactname
   * @prop {string} emergencycontactemail the user emergencycontactname
   * @prop {string} emergencycontactphone the user emergencycontactname
   * @prop {string} signupMethod the user signup source
   * @prop {number} signupStudioId the user signup source id
   * @prop {string} singupStudioSource the user signup studio source
   * @prop {object} flow_xo_attributes for text to book
   * @prop {string} card_country the country of origin of their credit card
   * @prop {boolean} proof_of_vax did the user provide proof of vaccination
   */
  const DibsUser = sequelize.define('dibs_user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
    },
    lastName: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.TEXT,
    },
    password: {
      type: DataTypes.TEXT,
    },
    mobilephone: {
      type: DataTypes.STRING,
      unique: true,
    },
    address1: {
      type: DataTypes.TEXT,
    },
    address2: {
      type: DataTypes.TEXT,
    },
    city: {
      type: DataTypes.TEXT,
    },
    state: {
      type: DataTypes.STRING,
    },
    zip: {
      type: DataTypes.STRING,
    },
    birthday: {
      type: DataTypes.STRING,
    },
    pictureUrl: {
      type: DataTypes.TEXT,
    },
    stripeid: {
      type: DataTypes.TEXT,
    },
    stripe_cardid: {
      type: DataTypes.TEXT,
    },
    emergencycontactname: {
      type: DataTypes.TEXT,
    },
    emergencycontactemail: {
      type: DataTypes.TEXT,
    },
    emergencycontactphone: {
      type: DataTypes.TEXT,
    },
    signupMethod: {
      type: DataTypes.STRING,
    },
    signupStudioId: {
      type: DataTypes.INTEGER,
    },
    signupStudioSource: {
      type: DataTypes.STRING(4),
    },
    events: {
      type: DataTypes.VIRTUAL,
    },
    widgetConfirmationPhone: {
      type: DataTypes.BOOLEAN,
    },
    campaign_notification: {
      type: DataTypes.STRING,
      defaultValue: 'email',
    },
    country: {
      type: DataTypes.STRING,
    },
    emergencycontactrelationship: {
      type: DataTypes.STRING,
    },
    defaultFilters: {
      type: DataTypes.JSONB,
      defaultValue: {
        city: undefined,
        studios: [],
        classNames: [],
        timeSpread: [],
        locationids: [],
        priceSpread: [],
        instructorids: [],
        durationSpread: [],
      },
    },
    welcome_complete: DataTypes.BOOLEAN,
    referredBy: {
      type: DataTypes.STRING,
    },
    referredByDetails: {
      type: DataTypes.STRING,
    },
    flow_xo_attributes: {
      type: DataTypes.JSONB,
    },
    card_country: {
      type: DataTypes.STRING(2),
    },
    default_currency: DataTypes.STRING(3),
    lastAccessedAt: DataTypes.DATE,
    third_party_generated: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    signup_dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    snooze_flash_credits_until: {
      type: DataTypes.DATE,
    },
    suppression_lists: {
      type: DataTypes.JSON,
      defaultValue: {
        transactional: false,
        nontransactional: false,
      },
    },
    waiverSigned: {
      type: DataTypes.DATE,
      defaultValue: null,
    },
    invite_code_to_refer: {
      type: DataTypes.STRING,
    },
    invite_code_redeemed: {
      type: DataTypes.STRING,
    },
    venmo_name: {
      type: DataTypes.STRING,
    },
    push_token: {
      type: DataTypes.STRING,
    },
    proof_of_vax: {
      type: DataTypes.BOOLEAN,
    },
    userStudio: DataTypes.VIRTUAL,
    studioCredit: DataTypes.VIRTUAL,
    flashCredit: DataTypes.VIRTUAL,
    globalCredit: DataTypes.VIRTUAL,
    rafCredit: DataTypes.VIRTUAL,
    userPass: DataTypes.VIRTUAL,
    passesSyncedAt: DataTypes.DATE,
    classesSyncedAt: DataTypes.DATE,
    fixedPrices: {
      type: DataTypes.VIRTUAL,
      defaultValue: {},
    },
    currency: DataTypes.VIRTUAL,
  }, {
    hooks: {
      /**
       * beforeCreate - Description
       * @memberof dibs_user
       * @instance
       * @param {type} user Description
       *
       * @returns {type} Description
       */
      beforeCreate(user) {
        user.email = user.email.toLowerCase();
        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(8), null);
        if (user.signupMethod === 'Dibs App') {
          user.invite_code_to_refer = shortid.generate();
        }
        if (!user.pictureUrl) {
          user.pictureUrl = '//d1f9yoxjfza91b.cloudfront.net/dibs-user-placeholder.png';
        }
        if (user.mobilephone) {
          user.mobilephone = this.serializePhoneNumber(user.mobilephone);
        }
      },

      /**
       * beforeUpdate - Description
       * @memberof dibs_user
       * @instance
       * @param {type} user Description
       *
       * @returns {type} Description
       */
      beforeUpdate(user) {
        if (user.changed('email')) user.email = user.email.toLowerCase();
        if (user.mobilephone) {
          user.mobilephone = this.serializePhoneNumber(user.mobilephone);
        }
        if (user.flow_xo_attributes
            && ['firstName', 'lastName', 'email'].reduce((bool, str) => bool || user.changed(str), false)) {
          user.flow_xo_attributes = Object.assign({}, user.flow_xo_attributes, {
            firstname: `${user.firstName[0].toUpperCase()}${user.firstName.slice(1)}`,
            lastname: `${user.lastName[0].toUpperCase()}${user.lastName.slice(1)}`,
            email: user.email,
            lastUpdated: moment().utc(),
          });
        }
      },
      async afterFind(user) {
        await updateInstance(user);
      },
      async afterCreate(user) {
        await updateInstance(user);
        if (process.env.NODE_ENV === 'production') publishCheckReferral(user);
      },
      async afterUpdate(user) {
        await updateInstance(user);
      },
      async afterSave(user) {
        await updateInstance(user);
      },
    },
    getterMethods: {
      address() {
        return `${this.address1} ${this.address2}`;
      },
    },
    paranoid: true,
  });

  DibsUser.associate = function associate(models) {
    DibsUser.hasMany(models.dibs_user_studio, {
      foreignKey: 'userid',
      as: 'userStudios',
    });
    models.dibs_user.hasOne(models.email_campaign, {
      foreignKey: 'userid',
      as: 'campaign',
    });
    models.dibs_user.hasMany(models.dibs_transaction, {
      foreignKey: 'userid',
      as: 'transactions',
    });
    models.dibs_user.hasMany(models.dibs_user_autopay_packages, {
      foreignKey: 'userid',
      as: 'membership',
    });
    models.dibs_user.hasMany(models.credit, {
      foreignKey: 'userid',
    });
    models.dibs_user.hasMany(models.flash_credit, {
      foreignKey: 'userid',
    });
    models.dibs_user.hasMany(models.friend_referrals, {
      foreignKey: 'userid',
      as: 'friendReferrals',
    });
    models.dibs_user.hasMany(models.passes, {
      foreignKey: 'userid',
      as: 'passes',
    });
    models.dibs_user.hasOne(models.friend_referrals, {
      foreignKey: 'referredUserId',
      as: 'acceptedReferral',
      soureKey: 'id',
    });
    models.dibs_user.belongsTo(models.dibs_studio, {
      foreignKey: 'signup_dibs_studio_id',
      as: 'signupStudio',
    });
    DibsUser.hasMany(models.attendees, {
      foreignKey: 'userid',
      as: 'attendees',
    });
  };

  /**
   * generateHash - Description
   * @memberof dibs_user
   * @static
   * @param {type} password Description
   *
   * @returns {type} Description
   */
  DibsUser.generateHash = function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };

  /**
   * serializePhoneNumber - Description
   * @memberof dibs_user
   * @static
   * @param {type} phoneNum Description
   *
   * @returns {type} Description
   */
  DibsUser.serializePhoneNumber = function serializePhoneNumber(phoneNum) {
    let newPhoneNum = phoneNum;
    if (newPhoneNum != null) {
      newPhoneNum = newPhoneNum.replace(/\D/g, '');
    }
    if (newPhoneNum.length < 10 || newPhoneNum.length > 12) {
      newPhoneNum = null;
    }
    return newPhoneNum;
  };
  DibsUser.prototype.apiJSON = function apiJSON() {
    return {
      email: this.email,
      id: this.id,
      firstname: this.firstName,
      lastname: this.lastName,
      birthday: this.birthday,
      mobilephone: this.deserializePhoneNumber(),
      picture_url: this.pictureUrl,
      address: this.address,
      city: this.city,
      state: this.state,
      zip: this.zip,
      emergencyContactName: this.emergencycontactname,
      emergencyContactPhone: this.emergencycontactphone,
      emergencyContactEmail: this.emergencycontactemail,
      emergencyContactRelationship: this.emergencycontactrelationship,
      credits: typeof this.credits !== 'undefined' ? this.credits.map(c => c.apiJSON()) : [],
      country: this.country,
      flash_credits: (
        typeof this.flash_credits !== 'undefined' ? this.flash_credits.filter(c => moment() < moment(c.expiration)).map(c => c.apiJSON()) : []
      ),
      passes: typeof this.passes !== 'undefined' ? this.passes.filter(isPassValid) : [],
    };
  };
  /**
   * getFullName - Description
   * @memberof dibs_user
   * @instance
   * @returns {type} Description
   */
  DibsUser.prototype.getFullName = function getFullName() {
    return `${this.firstName} ${this.lastName}`;
  };

  DibsUser.prototype.hasBookedAtStudio = async function hasBookedAtStudio(dibsStudioId) {
    const transactionCount = await this.constructor.sequelize.models.dibs_transaction.count({
      where: { userid: this.id, dibs_studio_id: dibsStudioId },
      paranoid: false,
    });
    const attendeeCount = await this.constructor.sequelize.models.attendees.count({
      where: {
        dibs_studio_id: dibsStudioId,
        email: { [DataTypes.Op.iLike]: this.email },
        dropped: { [Op.or]: [null, false] },
      },
      paranoid: false,
    });
    return (attendeeCount + transactionCount) > 0;
  };

  DibsUser.prototype.hasBookedOnDibs = async function hasBookedOnDibs() {
    return await this.constructor.sequelize.models.dibs_transaction.count({
      where: { userid: this.id, purchasePlace: { [DataTypes.Op.not]: 'offsite' } },
      paranoid: false,
    }) > 0;
  };

  /**
   * validatePassword - Description
   * @memberof dibs_user
   * @instance
   * @param {type} password Description
   *
   * @returns {type} Description
   */
  DibsUser.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  };

  /**
   * serializePhoneNumber - Description
   * @memberof dibs_user
   * @instance
   * @returns {type} Description
   */
  DibsUser.prototype.deserializePhoneNumber = function deserializePhoneNumber() {
    try {
      if (this.mobilephone === null) {
        return null;
      }
      switch (this.mobilephone.length) {
        case 10:
          return phoneUtil.format(phoneUtil.parse(this.mobilephone, 'us'), PNF.NATIONAL);
        case 11:
          return phoneUtil.format(phoneUtil.parse(this.mobilephone, 'gb'), PNF.NATIONAL);
        default:
          return this.mobilephone;
      }
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  /**
   * custom reload handler which updates instance
   * @return {Promise}        user instance including events
   */
  DibsUser.prototype.reloadAndUpdateRedis = async function reloadAndUpdateRedis() {
    await this.reload();
    await updateInstance(this);
    return this;
  };

  /**
   * Alias reloadAndUpdateRedis
   */
  DibsUser.prototype.refresh = function refresh() {
    return this.reloadAndUpdateRedis();
  }

  /**
   * clientJSON - Description
   * @memberof dibs_user
   * @instance
   * @returns {object} Sanitized user object
   * @swagger
   *  definitions:
   *    serializedUser:
   *      type: object
   *      properties:
   *        id:
   *          type: integer
   *        email:
   *          type: string
   *        firstName:
   *          type: string
   *        lastName:
   *          type: string
   *        mobilePhone:
   *          type: string
   *        pictureUrl:
   *          type: string
   *        address:
   *          type: string
   *        city:
   *          type: string
   *        state:
   *          type: string
   *        zip:
   *          type: integer
   *        emergencyContactName:
   *          type: string
   *        emergencyContactPhone:
   *          type: string
   *        emergencyContactEmail:
   *          type: string
   *        events:
   *          $ref: '#/definitions/userEvents'
   *        credits:
   *          type: array
   *          items:
   *            $ref: '#/definitions/credit'
   *        flash_credits:
   *          type: array
   *          items:
   *            $ref: '#/definitions/flash_credit'
   *
   */
  DibsUser.prototype.clientJSON = function clientJSON() {
    updateInstance(this);
    return {
      email: this.email,
      id: this.id,
      firstName: this.firstName,
      lastName: this.lastName,
      birthday: this.birthday,
      mobilePhone: this.deserializePhoneNumber(),
      pictureUrl: this.pictureUrl,
      address: this.address,
      address1: this.address1,
      address2: this.address2,
      city: this.city,
      state: this.state,
      zip: this.zip,
      emergencyContactName: this.emergencycontactname,
      emergencyContactPhone: this.emergencycontactphone,
      emergencyContactEmail: this.emergencycontactemail,
      emergencyContactRelationship: this.emergencycontactrelationship,
      events: this.events,
      credits: this.credits,
      subscriptions: this.subscriptions,
      country: this.country,
      welcome_complete: this.welcome_complete,
      flash_credits: (
        typeof this.flash_credits !== 'undefined' ? this.flash_credits.filter(c => moment() < moment(c.expiration)) : []
      ),
      defaultFilters: this.defaultFilters,
      defaultCurrency: this.default_currency || 'USD',
      third_party_generated: this.third_party_generated,
      firstLogin: moment(this.createdAt).isSame(this.updatedAt),
      passes: typeof this.passes !== 'undefined' ?
        this.passes.filter(p => !p.expiresAt || moment(p.expiresAt).isAfter(moment()))
          .map(p => ({
            ...p.get(),
            isValid: p.isValid(),
          }))
          .sort((a, b) => {
            if (!a.expiresAt && b.expiresAt) return -1;
            if (!a.expiresAt && !b.expiresAt) return 0;
            if (!b.expiresAt) return 1;
            return moment(a.expiresAt) - moment(b.expiresAt);
          })
        : [],
      suppression_lists: this.suppression_lists,
      waiverSigned: this.waiverSigned,
      userStudios: this.userStudios || [],
      hasCreditCard: Boolean(this.stripeid && this.stripe_cardid),
      inviteCode: this.invite_code_to_refer,
      venmoName: this.venmo_name,
    };
  };
  /**
   * Assumes this instance has been queried with
   * the include config that passport uses when
   * deserializing a user session
   *
   * @param {Object} event instance
   * @returns {Promise<Object>} the next pass instance the user can use
   */
  DibsUser.prototype.getNextValidPass = function getNextValidPass(event) {
    if (!this.passes) return null;
    if (!event || !event.can_apply_pass) return null;
    const sortedPasses = this.passes.sort((a, b) => {
      if (!a.expiresAt && !b.expiresAt) return 0;
      if (a.expiresAt && !b.expiresAt) return -1;
      if (!a.expiresAt && b.expiresAt) return 1;
      return moment(a.expiresAt) - moment(b.expiresAt);
    });
    const eventStartTime = moment.tz(event.start_date, event.studio.mainTZ);
    return Promise.reduce(sortedPasses, async (acc, pass) => {
      if (acc) return acc;
      if (!pass.isValidForUseAtStudio(event.dibs_studio_id)) return acc;
      if (pass.studioPackage && !pass.studioPackage.dailyUseLimit) return pass;
      if (await pass.reachedDailyUsageLimit(eventStartTime, 1)) return acc;
      return pass;
    }, null);
  };

  DibsUser.prototype.findCredit = function findCredit(type, dibsStudioId) {
    if (!this.credits) return null;
    const finders = {
      studio: credit => credit.dibs_studio_id === dibsStudioId,
      raf: credit => credit.studioid === 0 && credit.source === 'raf',
    };
    return this.credits.find(finders[type]) || null;
  };

  DibsUser.prototype.addCreditForStudio = async function addCreditForStudio(amount, studio, {
    save = false,
    transaction = null,
    associatedTransactionId = null,
    creditTier = null,
    creditTransactionType = null,
  }) {
    const [creditInstance] = await this.sequelize.models.credit.findOrCreate({
      where: {
        userid: this.id,
        dibs_studio_id: studio.id,
      },
      defaults: {
        source: studio.source,
        studioid: studio.studioid,
      },
    });
    return creditInstance.addAmount(amount, {
      save,
      transaction,
      associatedTransactionId,
      creditTier,
      creditTransactionType,
    });
  };

  DibsUser.prototype.syncOffsitePasses = async function syncOffsitePasses(studioid, source, { throttle = false } = {}) {
    if (process.env.NODE_ENV !== 'production' && !process.env.OFFSITE_SYNC) return;
    if (throttle && this.passesSyncedAt && moment().subtract(10, 'minutes') < this.passesSyncedAt) return;
    const apiKey = Buffer.from(process.env[`${source.toUpperCase()}SYNC_APIKEY`]).toString('base64');
    const host = process.env.NODE_ENV === 'production' ? `https://${source}sync.ondibs.com` : 'http://localhost:3001';
    const { data } = await axios.put(`${host}/api/passes/${studioid}/${this.id}`, {}, {
      headers: { Authorization: `Basic ${apiKey}` },
    });
    if (!data.success) throw data.err;
  };

  DibsUser.prototype.syncOffsiteClasses = async function syncOffsiteClasses(studioid, source, { throttle = false } = {}) {
    if (process.env.NODE_ENV !== 'production' && !process.env.OFFSITE_SYNC) return;
    if (throttle && this.classesSyncedAt && moment().subtract(10, 'minutes') < this.classesSyncedAt) return;
    const apiKey = Buffer.from(process.env[`${source.toUpperCase()}SYNC_APIKEY`]).toString('base64');
    const host = process.env.NODE_ENV === 'production' ? `https://${source}sync.ondibs.com` : 'http://localhost:3001';
    const { data } = await axios.put(`${host}/api/classes/${studioid}/${this.id}`, {}, {
      headers: { Authorization: `Basic ${apiKey}` },
    });
    if (!data.success) throw data.err;
  };

  DibsUser.prototype.getMemberFixedPrice = async function getMemberFixedPrice(dibsStudioId) {
    this.fixedPrices = this.fixedPrices || {}; // memoizing on the instance
    if (this.fixedPrices[dibsStudioId]) return this.fixedPrices[dibsStudioId];

    const { studio_packages } = this.sequelize.models;
    const packageInclude = [{
      model: studio_packages,
      as: 'studioPackage',
      required: true,  // if there's no package there's no membership
    }];
    const membershipPasses = await this.getPasses({ include: packageInclude, paranoid: false });
    if (!membershipPasses.length) return this.fixedPrices[dibsStudioId] = null;

    const potentialMembershipPricePasses = membershipPasses.filter(m => m.studioPackage.dibs_studio_id === dibsStudioId);
    if (potentialMembershipPricePasses.every(pass => moment(pass.expiresAt).isBefore(moment()))) {
      return this.fixedPrices[dibsStudioId] = null;
    }
    const potentialPrices = potentialMembershipPricePasses
      .filter(m => m.studioPackage.member_class_fixed_price !== null)
      .map(m => m.studioPackage.member_class_fixed_price);
    const fixedPrice = potentialPrices.length > 0 ? Math.min(...potentialPrices) : null;
    this.fixedPrices[dibsStudioId] = fixedPrice;
    return fixedPrice;
  };

  /**
   * @param {number} dibsStudioId of studio we are checking if user made purchase at
   * @returns {boolean} if the user has made a purchase at that studio
   */
  DibsUser.prototype.hasMadePurchaseAtStudio = async function hasMadePurchaseAtStudio(dibsStudioId) {
    const attendeeCount = await models.attendees.count({
      where: {
        email: { [Op.iLike]: this.email },
        dibs_studio_id: dibsStudioId,
        [Op.not]: {
          serviceName: {
            [Op.or]: [
              { [Op.iLike]: '%classpass%' },
              { [Op.iLike]: '%gilt%' },
              { [Op.iLike]: '%fitreserve%' },
            ],
          },
        },
        dropped: { [Op.or]: [null, false] },
      },
    });
    const pastTransactionsCount = await models.dibs_transaction.count({
      where: {
        userid: this.id,
        dibs_studio_id: dibsStudioId,
        status: 1,
        void: { [Op.or]: [null, false] },
        type: { [Op.notIn]: [models.dibs_transaction.Types.REFER_A_FRIEND_CREDIT, models.dibs_transaction.Types.COMP_CREDIT] },
        stripe_refund_id: null,
      },
    });
    return (attendeeCount > 0) || (pastTransactionsCount > 0);
  };

  /**
   * @param {number} dibsStudioId of studio client json is for
   * @returns {Promise<Object>} resolves studio specific extended client json
   */
  DibsUser.prototype.studioClientJSON = async function studioClientJSON(dibsStudioId) {
    return {
      ...this.clientJSON(),
      hasMadePurchaseAtStudio: await this.hasMadePurchaseAtStudio(dibsStudioId),
      highValueCustomer: await this.getUserStudioSpend(dibsStudioId) > HIGH_VALUE_SPEND_THRESHOLD,
    };
  };

  DibsUser.fullTextSearch = async function fullTextSearch(str, { where = {}, limit = '' } = {}) {
    const additionalWhere = Object.keys(where).reduce((acc, key) =>
      `${acc} AND "${key}" = ${where[key]}`
    , '');
    return this.sequelize.query(`
      SELECT *, ts_rank_cd(ft_search, to_tsquery('${str}:*')) as rank FROM dibs_users WHERE to_tsquery('${str}:*') @@ ft_search ${additionalWhere}
      ORDER BY rank DESC
      ${limit && `LIMIT ${limit}`}
      ;
    `, {
      type: this.sequelize.QueryTypes.SELECT,
      model: this,
    });
  };

  DibsUser.prototype.getUserStudioSpend = async function getUserStudioSpend(dibsStudioId, pastDays = DEFAULT_PAST_DAYS) {
    const [{ spend }] = await this.sequelize.query(`SELECT ROUND(SUM(amount - studio_credits_spent - raf_credits_spent)::NUMERIC, 2) as spend
    FROM dibs_transactions
    WHERE "createdAt" > now() - INTERVAL '${pastDays}, days'
    AND dibs_studio_id = $dibsStudioId
    AND userid = $userid;`, {
      bind: {
        dibsStudioId,
        userid: this.id,
      },
      type: this.sequelize.QueryTypes.SELECT,
    });
    return spend;
  };


  return DibsUser;
};
