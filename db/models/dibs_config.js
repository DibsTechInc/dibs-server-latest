module.exports = function linkDibsConfig(sequelize, DataTypes) {
  return sequelize.define('dibs_config', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    dibs_studio_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'dibs_studios',
        key: 'id',
      },
    },
    autopay_minimum: DataTypes.INTEGER,
    studio_fonts: DataTypes.JSON,
    color: DataTypes.STRING(6),
    customTimeFormat: DataTypes.STRING,
    terms: DataTypes.STRING,
    custom_front_text: DataTypes.TEXT,
    textColor: {
      type: DataTypes.STRING(6),
      defaultValue: 'ffffff',
    },
    onlyLocations: DataTypes.JSON,
    interval_end: {
      type: DataTypes.INTEGER,
      defaultValue: 14,
    },
    default_region: DataTypes.BIGINT,
    custom_back_text: DataTypes.TEXT,
    showWidgetPopup: DataTypes.BOOLEAN,
    autopayNotice: DataTypes.BOOLEAN,
    raf_award: {
      type: DataTypes.FLOAT,
      defaultValue: 5,
    },
    long_signup: DataTypes.BOOLEAN,
    use_spot_booking: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    show_credit_load: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    send_source_welcome_email: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    show_chatbot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    // Zingfit isn't giving us access to the reporting API so there's a fake attendee sync that can run on studios that needs it.
    // use_pseudo_attendees lets us turn that sync on and off
    use_pseudo_attendees: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    trainer_change_email_cutoff: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    first_class_fixed_price: {
      type: DataTypes.INTEGER,
    },
    vod_access_period: {
      type: DataTypes.INTEGER,
      defaultValue: 48,
    },
    late_drop_text: {
      type: DataTypes.STRING,
    },
    send_flash_credits: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    high_value_spend_threshold: {
      type: DataTypes.FLOAT,
      defaultValue: 120,
    },
    display_giftcards: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    spot_label: {
      type: DataTypes.STRING,
    },
    display_widget_button: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    maximum_allowed_client_enrollment: {
      type: DataTypes.INTEGER,
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
  }, {
    paranoid: true,
  });
};
