const dropQueryLib = require('./shared');

module.exports = function queryEvent(where) {
    return models.event.findOne({
        where,
        attributes: ['eventid', 'classid', 'name', 'description', 'start_date', 'source', 'dibs_studio_id'],
        include: dropQueryLib.getEventsSQLInclude()
    });
};
