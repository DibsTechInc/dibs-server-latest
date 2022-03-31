'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize.query(
    `
    UPDATE dibs_studios
SET tmp_dibs_config = REPLACE(tmp_dibs_config::VARCHAR, '#', '')::JSON;
INSERT INTO dibs_configs (
  dibs_studio_id,
  autopay_minimum,
  studio_fonts,
  color,
  "customTimeFormat",
  terms,
  custom_front_text,
  "textColor",
  "onlyLocations",
  default_region,
  custom_back_text,
  "showWidgetPopup",
  interval_end,
  "createdAt",
  "updatedAt",
  "deletedAt"
)
  SELECT
    id,
    (tmp_dibs_config ->> 'autopay_minimum')::INT,
    tmp_dibs_config -> 'studio_fonts',
    tmp_dibs_config ->> 'color',
    tmp_dibs_config -> 'customTimeFormat',
    tmp_dibs_config -> 'terms',
    tmp_dibs_config -> 'custom_front_text',
    tmp_dibs_config ->> 'textColor',
    tmp_dibs_config -> 'onlyLocations',
    (tmp_dibs_config ->> 'default_region')::BIGINT,
    tmp_dibs_config -> 'custom_back_text',
    (tmp_dibs_config ->> 'showWidgetPopup')::BOOLEAN,
    (tmp_dibs_config ->> 'interval_end')::INT,
    NOW(),
    null,
    null
  FROM dibs_studios;
    `
  ),

  down: (queryInterface, Sequelize) => queryInterface.sequelize.query('DELETE FROM dibs_configs;')
};
