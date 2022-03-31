const parseSQL = require('../lib/helpers/sql-query-reader');

module.exports = function linkStudioInvoice(sequelize, DataTypes) {
    /**
     * studio_invoice
     * @class studio_invoice
     *
     * @prop {Number} id
     * @prop {String} source
     * @prop {Number} studioid (relates to dibs_studios)
     * @prop {Number} locationid (relates to mb/zf studioid for brands)
     * @prop {Date} start_date
     * @prop {Date} end_date
     * @prop {Number} balance
     * @prop {Boolean} paid
     * @prop {String} notes
     * @prop {Date} createdAt
     * @prop {Date} updatedAt
     * @prop {Date} deletedAt
     * @prop {String} brand_source
     * @prop {Boolean} studio_total
     */
    const StudioInvoice = sequelize.define(
        'studio_invoice',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            dibs_studio_id: DataTypes.INTEGER,
            source: DataTypes.STRING(4),
            studioid: DataTypes.INTEGER,
            locationid: { type: DataTypes.INTEGER, allowNull: true },
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE,
            balance: DataTypes.FLOAT,
            paid: { type: DataTypes.BOOLEAN, defaultValue: false },
            notes: { type: DataTypes.TEXT, allowNull: true },
            brand_source: { type: DataTypes.STRING(4), allowNull: true },
            studio_total: { type: DataTypes.BOOLEAN, defaultValue: false },
            primary_locationid: DataTypes.INTEGER,
            createdAt: DataTypes.DATE,
            updatedAt: { type: DataTypes.DATE, allowNull: true },
            deletedAt: { type: DataTypes.DATE, allowNull: true }
        },
        {
            paranoid: true
        }
    );
    StudioInvoice.associate = function associate(models) {
        models.studio_invoice.belongsTo(models.dibs_studio, { as: 'studio', foreignKey: 'dibs_studio_id' });
        // models.studio_invoice.hasMany(models.dibs_transaction, { as: 'transactions', foreignKey: 'invoiceid' });
        models.studio_invoice.belongsTo(models.dibs_studio_locations, { as: 'location', foreignKey: 'locationid' });
    };
    /**
     * getGeographicInfo - gets the name, address of the location and currency
     * @returns {Promise} resolves instance with added props
     */
    StudioInvoice.prototype.getGeographicInfo = async function getGeographicInfo() {
        const QUERY = parseSQL(`${__dirname}/sql_queries/studio_invoice-get_location.sql`);
        const [location] = await sequelize.query(QUERY, {
            bind: {
                dibsStudioId: this.dibs_studio_id,
                locationid: this.locationid
            },
            type: 'SELECT'
        });

        const { currency, address, city, zipCode, numberOfLocations, allowPackages } = location;
        let locationName = location.name;

        if (this.locationid === 0) {
            locationName = allowPackages ? 'Credit + Packages' : 'Credit Loads';
        } else if (this.locationid === null) {
            locationName = 'Total';
        } else if (numberOfLocations === 1) {
            locationName = 'Bookings';
        }
        this.locationName = locationName;
        this.currency = currency;
        this.address = address;
        this.city = city;
        this.zipCode = zipCode;

        return this;
    };
    /**
     * getClientJSON - returns useable object for frontend
     * @returns {Object} the JSON
     */
    StudioInvoice.prototype.getClientJSON = function getClientJSON() {
        return {
            id: this.id,
            source: this.source,
            studioid: this.studioid,
            locationid: this.locationid,
            startDate: this.start_date,
            endDate: this.end_date,
            balance: this.balance,
            paid: this.paid,
            notes: this.notes,
            locationName: this.locationName,
            currency: this.currency,
            address: this.address,
            city: this.city,
            zipCode: this.zipCode,
            studioTotal: this.studio_total
        };
    };
    return StudioInvoice;
};
