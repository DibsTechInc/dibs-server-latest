const _ = require('lodash');

module.exports = function linkEvent(sequelize, DataTypes) {
    /**
     * event
     *
     * @class event
     * @prop {number} eventid
     * @prop {string} name
     * @prop {string} address
     * @prop {string} eventtype
     * @prop {number} trainerid
     * @prop {number} price
     * @prop {number} mb_price
     * @prop {string} description
     * @prop {DateTime} start
     * @prop {DateTime} end
     * @prop {DateTime} start_date
     * @prop {DateTime} end_date
     * @prop {number} seats
     * @prop {number} spots_booked
     * @prop {string} status
     * @prop {boolean} popular
     * @prop {number} canceled
     * @prop {number} deleted
     * @prop {string} source
     * @prop {boolean} disable_sync_location
     * @prop {number} manual_track_id
     * @prop {number} price_dibs
     * @prop {number} zfstudio_id
     * @prop {boolean} is_recurring
     * @prop {string} zoom_password
     * @prop {string} post_class_zoom_link
     * @prop {boolean} private
     * @prop {DateTime} lastPricedAt
     * @prop {number} dibsclassid
     * @prop {string} category
     * @prop {boolean} on_demand
     * @prop {boolean} copy_zoomlink_forward
     */
    const Event = sequelize.define(
        'event',
        {
            eventid: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: DataTypes.STRING,
            address: DataTypes.STRING,
            eventtype: DataTypes.STRING,
            trainerid: DataTypes.INTEGER,
            price: DataTypes.FLOAT,
            mb_price: DataTypes.FLOAT,
            description: DataTypes.TEXT,
            start: DataTypes.INTEGER,
            end: DataTypes.INTEGER,
            start_date: DataTypes.DATE,
            end_date: DataTypes.DATE,
            seats: DataTypes.INTEGER,
            spots_booked: DataTypes.INTEGER,
            status: DataTypes.BOOLEAN,
            popular: DataTypes.BOOLEAN,
            canceled: DataTypes.INTEGER,
            deleted: DataTypes.INTEGER,
            source: DataTypes.STRING,
            disable_sync_location: DataTypes.BOOLEAN,
            manual_track_id: DataTypes.STRING,
            price_dibs: DataTypes.FLOAT,
            lastPricedAt: DataTypes.DATE,
            free_class: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            studioid: DataTypes.INTEGER,
            classid: DataTypes.STRING(30),
            programid: DataTypes.INTEGER,
            locationid: DataTypes.INTEGER,
            isFull: DataTypes.BOOLEAN,
            syncExceptions: DataTypes.VIRTUAL,
            renameExceptions: DataTypes.VIRTUAL,
            dibs_studio_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'dibs_studios',
                    key: 'id'
                }
            },
            has_waitlist: DataTypes.BOOLEAN,
            private: DataTypes.BOOLEAN,
            can_apply_pass: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false
            },
            zf_series_types: DataTypes.JSONB,
            room_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: 'rooms',
                    key: 'id'
                }
            },
            class_notes: {
                type: DataTypes.TEXT
            },
            is_recurring: DataTypes.BOOLEAN,
            zoom_password: DataTypes.STRING,
            post_class_zoom_link: DataTypes.STRING,
            dibsclassid: DataTypes.INTEGER,
            category: DataTypes.STRING,
            copy_zoomlink_forward: DataTypes.BOOLEAN,
            on_demand: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            hooks: {
                beforeCreate(event) {
                    event.setPriceByExceptions();
                    event.checkRename();
                }
            }
        }
    );

    Event.prototype.checkRename = function checkRename() {
        const except = _.find(this.renameExceptions, (exception) => this.name.match(new RegExp(exception.pattern, 'i')));
        // const this.name = except ? except.new_name : this.name;
        return { fixthiswhenyoucan: true };
    };
    // eslint-disable-next-line no-unused-expressions
    (Event.prototype.setPriceByExceptions = function setPriceByExceptions(price = 1) {
        if (!this.syncExceptions) return price;
        const except =
            this.syncExceptions.some((exception) => this.name.match(new RegExp(exception.pattern, 'i'))) ||
            this.syncExceptions.some((exception) => this.trainerid === exception.instructorid) ||
            this.syncExceptions.some((exception) => this.classid === exception.classid) ||
            this.syncExceptions.some((exception) => this.locationid === exception.locationid);

        if (except && this.price !== 0) console.log(`${this.eventid} repriced by exception`);

        this.price_dibs = except ? 0 : this.price_dibs;
        this.price = except ? 0 : price;
        return [this.price, this.price_dibs];
        // eslint-disable-next-line no-sequences
    }),
        (Event.associate = function associate(models) {
            // Event.belongsTo(models.dibs_studio, {
            //     foreignKey: 'dibs_studio_id',
            //     targetKey: 'id',
            //     as: 'studio'
            // });
            // Event.hasMany(models.dibs_transaction, {
            //     foreignKey: 'eventid',
            //     targetKey: 'eventid',
            //     as: 'transactions'
            // });
            Event.belongsTo(models.dibs_studio_locations, {
                foreignKey: 'locationid',
                as: 'location'
            });
            Event.belongsTo(models.dibs_studio_instructors, {
                foreignKey: 'trainerid',
                as: 'instructor'
            });
            Event.hasMany(models.pricing_history, {
                foreignKey: 'eventid',
                as: 'pricingHistory'
            });
            Event.belongsTo(models.room, {
                foreignKey: 'room_id'
            });
        });

    Event.addSpotsBooked = async function addSpotsBooked(eventid, quantity, { returning = false } = {}) {
        if (Number.isNaN(quantity)) throw new Error('You must use a numeric value for the 2nd argument of models.event.addSpotsBooked');
        return this.update({ spots_booked: sequelize.literal(`spots_booked + ${Number(quantity)}`) }, { where: { eventid }, returning });
    };

    return Event;
};
