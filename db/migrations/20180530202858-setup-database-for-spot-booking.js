'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.addIndex('rooms', ['dibs_studio_id'], { unique: false, transaction }),
        queryInterface.addIndex('spots', ['room_id'], { unique: false, transaction }),
        queryInterface.addConstraint('spots', ['room_id', 'x', 'y'], { type: 'unique', transaction }),
        queryInterface.addColumn('dibs_transactions', 'spot_id', {
          type: Sequelize.INTEGER,
          onDelete: 'SET NULL',
          references: {
            model: 'spots',
            key: 'id',
          }
        }, { transaction }),
        queryInterface.addColumn('attendees', 'spot_id', {
          type: Sequelize.INTEGER,
          onDelete: 'SET NULL',
          references: {
            model: 'spots',
            key: 'id',
          }
        }, { transaction })
      ]));
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(transaction =>
      Promise.all([
        queryInterface.removeIndex('rooms', ['dibs_studio_id'], { transaction }),
        queryInterface.removeIndex('spots', ['room_id'], { transaction }),
        queryInterface.sequelize.query(
          'ALTER TABLE spots DROP CONSTRAINT spots_room_id_x_y_uk;', {transaction}
        ),
        queryInterface.removeColumn('dibs_transactions', 'spot_id', { transaction }),
        queryInterface.removeColumn('attendees', 'spot_id', { transaction })
      ]));
  }
};
