'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn('dibs_studios', 'api_version', Sequelize.INTEGER)
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.dibs_studio_locations ALTER COLUMN source_location_id TYPE VARCHAR(30) USING source_location_id::VARCHAR(30);'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.dibs_studio_instructors ALTER COLUMN source_instructor_id TYPE VARCHAR(30) USING source_instructor_id::VARCHAR(30);'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.dibs_studio_locations ALTER COLUMN region_id TYPE VARCHAR(30) USING region_id::VARCHAR(30);'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.attendees ALTER COLUMN "attendeeID" TYPE VARCHAR(30) USING "attendeeID"::VARCHAR(30);'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.attendees ALTER COLUMN "classID" TYPE VARCHAR(30) USING "classID"::VARCHAR(30);'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.attendees ALTER COLUMN "serviceID" TYPE VARCHAR(30) USING "serviceID"::VARCHAR(30);'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.events ALTER COLUMN classid TYPE VARCHAR(30) USING classid::VARCHAR(30);'))
    .then(() => queryInterface.sequelize.query('update events set trainerid = (select id from dibs_studio_instructors where events.trainerid::VARCHAR = source_instructor_id and events.studioid = dibs_studio_instructors.studioid and events.source = dibs_studio_instructors.source) where events.studioid != 94148'))
    .then(() => queryInterface.sequelize.query('update events set locationid = (select id from dibs_studio_locations where events.locationid::VARCHAR = source_location_id and events.studioid = dibs_studio_locations.studioid and events.source = dibs_studio_locations.source) where events.studioid != 94148'))

  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('dibs_studios', 'api_version')
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.dibs_studio_locations ALTER COLUMN source_location_id TYPE INTEGER USING source_location_id::INTEGER;'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.dibs_studio_instructors ALTER COLUMN source_instructor_id TYPE INTEGER USING source_instructor_id::INTEGER;'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.dibs_studio_locations ALTER COLUMN region_id TYPE INTEGER USING region_id::INTEGER;'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.attendees ALTER COLUMN "attendeeID" TYPE INTEGER USING "attendeeID"::INTEGER;'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.attendees ALTER COLUMN "classID" TYPE INTEGER USING "classID"::INTEGER;'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.attendees ALTER COLUMN "serviceID" TYPE INTEGER USING "serviceID"::INTEGER;'))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.events ALTER COLUMN classid TYPE INTEGER USING classid::INTEGER;'))
  }
};
