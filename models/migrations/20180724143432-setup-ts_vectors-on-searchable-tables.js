'use strict';
const Promise = require('bluebird');

const tableColumns = [{
  table: 'dibs_users',
  columns: ['"firstName"', '"lastName"', 'email'],
}, {
    table: 'attendees',
    columns: ['"firstname"', '"lastname"', 'email'],
}
]

function combineColumnText(columns) {
  return columns.map(column => `COALESCE(${column}, '')`).join(" || ' ' || ");
}

function toVector(columns) {
  return `to_tsvector('english', ${combineColumnText(columns)})`
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('attendees', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
    });
    await queryInterface.addIndex('attendees', ['id'], { unique: true });
      return Promise.map(tableColumns, async (tc) => {
        await queryInterface.sequelize.query(`ALTER TABLE ${tc.table} ADD COLUMN IF NOT EXISTS ft_search TSVECTOR;`)
        await queryInterface.sequelize.query(`CREATE INDEX IF NOT EXISTS ${tc.table}_ft_search_idx ON ${tc.table} USING GIN (ft_search);`)
        await queryInterface.sequelize.query(`UPDATE ${tc.table} SET ft_search = ${toVector(tc.columns)}`)
        await queryInterface.sequelize.query(`CREATE OR REPLACE FUNCTION update_${tc.table}_ft_search() 
          RETURNS TRIGGER
          AS $$
          BEGIN
            UPDATE ${tc.table}
            SET ft_search = ${toVector(tc.columns.map(c => `NEW.${c}`))}
            WHERE id = NEW.id;
            RETURN NEW;
          END
          $$ LANGUAGE plpgsql;
        `);
        return queryInterface.sequelize.query(`CREATE TRIGGER ${tc.table}_ft_search_update_tgr
        AFTER UPDATE OF ${tc.columns.join(', ')}
        ON ${tc.table}
        FOR EACH ROW
        EXECUTE PROCEDURE update_${tc.table}_ft_search();
        `)
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('attendees', 'id');
    await queryInterface.removeIndex('attendees', ['id']);
      return Promise.map(tableColumns, async (tc) => {
        await queryInterface.sequelize.query(`ALTER TABLE ${tc.table} DROP COLUMN IF EXISTS ft_search;`)
        await queryInterface.sequelize.query(`DROP INDEX IF EXISTS ${tc.table}_ft_search_id;`)
        await queryInterface.sequelize.query(`DROP TRIGGER ${tc.table}_ft_search_update_tgr ON ${tc.table};`)
        return queryInterface.sequelize.query(`DROP FUNCTION update_${tc.table}_ft_search;`);
    });
  }
};
