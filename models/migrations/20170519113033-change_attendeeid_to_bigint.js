'use strict'

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE public.attendees DROP CONSTRAINT attendees_pkey;')
    .then(() => queryInterface.changeColumn('attendees', 'attendeeID', { type: Sequelize.BIGINT }))
    .then(() => queryInterface.changeColumn('data_attendees', 'attendeeID', { type: Sequelize.BIGINT }))
    .then(() => queryInterface.sequelize.query('ALTER TABLE public.attendees ADD CONSTRAINT "attendees_pkey" PRIMARY KEY ("studioID", "attendeeID");'))
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.query('ALTER TABLE public.attendees DROP CONSTRAINT attendees_pkey;')
    .then(() =>
    queryInterface.changeColumn('attendees', 'attendeeID', { type: Sequelize.INTEGER })
  )
    .then(() => queryInterface.changeColumn('data_attendees', 'attendeeID', { type: Sequelize.BIGINT }))

    .then(() => queryInterface.sequelize.query('ALTER TABLE public.attendees ADD CONSTRAINT "attendees_pkey" PRIMARY KEY ("studioID", "attendeeID");'))
  }
}
