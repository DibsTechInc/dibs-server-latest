BEGIN;
DROP MATERIALIZED VIEW studio_with_locations CASCADE;
CREATE MATERIALIZED VIEW studio_with_locations AS (
  SELECT DISTINCT
    all_studios.studioid,
    all_studios.source,
    COALESCE(dibs_studio_locations.source_location_id, 0) AS locationid,
    COALESCE(dibs_studio_locations.visible, TRUE)     AS visible,
    all_studios."mainTZ",
    all_studios.name
  FROM all_studios
  LEFT JOIN dibs_studio_locations
    ON all_studios.source = dibs_studio_locations.source
    AND all_studios.studioid = dibs_studio_locations.studioid
  WHERE (dibs_studio_locations.visible OR all_studios.source = 'brnd')
  UNION
  SELECT
    all_studios.studioid,
    all_studios.source,
    0    AS locationid,
    TRUE AS visible,
    all_studios."mainTZ",
    all_studios.name
  FROM all_studios
  LEFT JOIN dibs_studio_locations
    ON all_studios.source = dibs_studio_locations.source
    AND all_studios.studioid = dibs_studio_locations.studioid
  WHERE (dibs_studio_locations.visible OR all_studios.source = 'brnd')
);
CREATE UNIQUE INDEX studio_with_locations_source_studioid_locationid ON studio_with_locations (source, studioid, locationid);
CREATE INDEX studio_with_locations_visible ON studio_with_locations (visible);
CREATE INDEX studio_with_locations_maintz ON studio_with_locations ("mainTZ");
COMMIT;
