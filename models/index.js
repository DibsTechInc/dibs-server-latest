// const fs = require('fs');
// const path = require('path');
const Sequelize = require('sequelize');
const settings = require('./config/config');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line
  require('dotenv').config();
}
const env = process.env.NODE_ENV || 'development';
const config = settings[env];
const db = {};

const sequelize =
    env === 'production'
        ? new Sequelize(process.env.DATABASE_URL, config)
        : new Sequelize(config.database, config.username, config.password, config);

const models = [
    require('./models/attendee'),
    require('./models/exceptions'),
    require('./models/removal_requests'),
    require('./models/blog_post'),
    require('./models/exchange_rate'),
    require('./models/revenue_reference'),
    require('./models/contact_forms'),
    require('./models/favorite'),
    require('./models/sms_category'),
    require('./models/credit'),
    require('./models/flash_credit'),
    require('./models/sms_phrase'),
    require('./models/credit_promo_code'),
    require('./models/friend_referral_reminders'),
    require('./models/special_notifications'),
    require('./models/credit_promo_user'),
    require('./models/friend_referrals'),
    require('./models/dibs_admin'),
    require('./models/get_dibs_requests'),
    require('./models/stripe_payouts'),
    require('./models/dibs_api_user'),
    require('./models/incentive'),
    require('./models/studio_admin_tile_datas'),
    require('./models/dibs_effects'),
    require('./models/studio_brands'),
    require('./models/dibs_studio'),
    require('./models/mb_service'),
    require('./models/studio_credit_special_tier_users'),
    require('./models/dibs_studio_instructors'),
    require('./models/membership_plan'),
    require('./models/studio_credit_special_tiers'),
    require('./models/dibs_studio_locations'),
    require('./models/membership_subscription'),
    require('./models/studio_employee'),
    require('./models/dibs_transaction'),
    require('./models/newsletter_subscriptions'),
    require('./models/studio_feedback'),
    require('./models/dibs_user'),
    require('./models/password_reset'),
    require('./models/studio_invoice'),
    require('./models/dibs_user_studio'),
    require('./models/pricing_history'),
    require('./models/studio_pricing'),
    require('./models/email_campaign'),
    require('./models/promo_code'),
    require('./models/studio_suggestion'),
    require('./models/email_verification'),
    require('./models/promo_codes_user'),
    require('./models/user-studio-requests'),
    require('./models/event'),
    require('./models/pseudo_client_services'),
    require('./models/manual_event_pricing'),
    require('./models/passes'),
    require('./models/studio_packages'),
    require('./models/dibs_user_autopay_packages'),
    require('./models/dibs_gift_card'),
    require('./models/dibs_config'),
    require('./models/dibs_recurring_event'),
    require('./models/whitelabel_custom_email_text'),
    require('./models/studio_package_discount'),
    require('./models/experiment'),
    require('./models/retail_product'),
    require('./models/sync_exception'),
    require('./models/sync_rename'),
    require('./models/dibs_portal_user'),
    require('./models/duplicate_user'),
    require('./models/room'),
    require('./models/spot'),
    require('./models/credit_transaction'),
    require('./models/credit_tier'),
    require('./models/custom_events_attribute'),
    require('./models/dibs_prelaunch_user'),
    require('./models/dibs_brand'),
    require('./models/short_code'),
    require('./models/receipt'),
    require('./models/favorite_brand'),
    require('./models/dibs_portal_transaction'),
    require('./models/dibs_cash_out_request'),
    require('./models/portal_credit_transaction'),
    require('./models/price_band'),
    require('./models/zoom-notification'),
    require('./models/membership_stats'),
    require('./models/on_demand_events'),
    require('./models/vod_user_access')
];

models.forEach((module) => {
    const model = module(sequelize, Sequelize, config);
    db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
