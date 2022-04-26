const userIncludeConfig = (models) => [
    {
        model: models.credit,
        as: 'credits',
        attributes: [
            'id',
            'studioid',
            'credit',
            'source',
            [models.sequelize.literal('COALESCE("credits->studio".currency, credits.currency)'), 'currency'],
            'userid',
            'dibs_studio_id',
            'load_bonus'
        ],
        include: [
            {
                model: models.dibs_studio,
                as: 'studio',
                attributes: ['currency'],
                include: [{ model: models.dibs_config, as: 'dibs_config' }]
            }
        ]
    },
    // TODO make this work - currently super slow
    // {
    //   model: models.dibs_user_studio,
    //   as: 'userStudios',
    // },
    {
        model: models.flash_credit,
        attributes: ['id', 'studioid', 'credit', 'source', 'expiration', 'dibs_studio_id', 'is_secret']
    },
    {
        model: models.passes,
        as: 'passes',
        attributes: [
            'id',
            'dibs_studio_id',
            'userid',
            'totalUses',
            'usesCount',
            'studio_package_id',
            'autopay',
            'passValue',
            'expiresAt',
            'source_serviceid',
            'onDibs',
            'clientid',
            'private_pass'
        ],
        // where: { $lte: { expiresAt: moment().format('YYYY-MM-DD HH:mm').toString() } },
        // required: false,
        include: [
            {
                model: models.studio_packages,
                as: 'studioPackage',
                attributes: [
                    'id',
                    'classAmount',
                    'name',
                    'dibs_studio_id',
                    'unlimited',
                    'dailyUsageLimit',
                    'commitment_period',
                    'member_class_fixed_price',
                    'notification_period',
                    'autopayIncrement',
                    'zf_series_type_id',
                    'autopay',
                    'private',
                    'on_demand_access'
                ]
            },
            {
                model: models.dibs_user_autopay_packages,
                as: 'userAutopayPackage',
                attributes: ['id', 'cancel_notified_at', 'createdAt']
            },
            {
                model: models.dibs_transaction,
                as: 'purchaseTransaction',
                attributes: ['stripe_refund_id']
            }
        ]
    }
];
const employeeIncludeConfig = (models) => [
    {
        model: models.dibs_studio,
        as: 'studio',
        attributes: [
            'id',
            'billing_email',
            'billing_contact',
            'name',
            'studioid',
            'source',
            'currency',
            'live',
            'zip',
            'city',
            'state',
            'country',
            'mailing_address1',
            'mailing_address2',
            'mainTZ',
            'currency',
            'stripe_account_id',
            'stripeid',
            'stripe_cardid',
            'subscription_fee',
            'total_monthly_charge',
            'date_of_charge',
            'defaultCreditTiers',
            'front_desk',
            'requiresWaiverSigned',
            'domain',
            'color_logo',
            'hero_url',
            'customSendingDomain',
            'custom_email_template',
            'widget_fee_rate',
            'admin_fee_rate',
            'clicked_mb_link',
            'client_id',
            'client_secret',
            [
                models.sequelize.literal('(SELECT COUNT(*) > 0 FROM studio_packages WHERE studio_packages.dibs_studio_id = studio.id)'),
                'hasPackages'
            ],
            [models.sequelize.literal('stripe_account_id IS NOT NULL'), 'hasPayouts'],
            'onboardedAt',
            'cancel_time'
        ],
        include: [
            {
                model: models.dibs_studio_locations,
                as: 'locations',
                attributes: ['tax_rate', 'retail_tax_rate']
            },
            {
                model: models.whitelabel_custom_email_text,
                as: 'custom_email_text'
            },
            {
                model: models.dibs_config,
                as: 'dibs_config'
            }
        ]
    }
];

module.exports = {
    userIncludeConfig,
    employeeIncludeConfig
};
