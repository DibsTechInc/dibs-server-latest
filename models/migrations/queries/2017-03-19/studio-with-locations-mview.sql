CREATE MATERIALIZED VIEW studio_with_locations AS (
  SELECT DISTINCT
    all_studios.studioid,
    all_studios.source,
    COALESCE(mb_locations.mblocationid, zf_sites.zfsite_id, 0) AS locationid,
    COALESCE(mb_locations.visible, zf_sites.visible, TRUE)     AS visible,
    all_studios."mainTZ",
    all_studios.name
  FROM all_studios
    LEFT JOIN mb_locations
      ON all_studios.studioid = mb_locations.mbstudioid
    LEFT JOIN zf_sites
      ON all_studios.studioid = zf_sites.zfstudio_id
  WHERE (COALESCE(mb_locations.visible, zf_sites.visible) OR all_studios.source = 'brnd')
  UNION
  SELECT
    all_studios.studioid,
    all_studios.source,
    0    AS locationid,
    TRUE AS visible,
    all_studios."mainTZ",
    all_studios.name
  FROM all_studios
    LEFT JOIN mb_locations
      ON all_studios.studioid = mb_locations.mbstudioid
    LEFT JOIN zf_sites
      ON all_studios.studioid = zf_sites.zfstudio_id
  WHERE (COALESCE(mb_locations.visible, zf_sites.visible) OR all_studios.source = 'brnd')
);
CREATE UNIQUE INDEX studio_with_locations_source_studioid_locationid ON studio_with_locations (source, studioid, locationid);
CREATE INDEX studio_with_locations_visible ON studio_with_locations (visible);
CREATE INDEX studio_with_locations_maintz ON studio_with_locations ("mainTZ");
