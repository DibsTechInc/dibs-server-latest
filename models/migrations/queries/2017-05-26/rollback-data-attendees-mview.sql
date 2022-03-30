BEGIN;
DROP MATERIALIZED VIEW IF EXISTS data_attendees_view;
CREATE MATERIALIZED VIEW data_attendees_view AS (
  WITH visible_studio_data_attendees AS (
    SELECT
      visit_date_trunc,
      "studioID",
      locationid,
      source,
      "mainTZ",
      revenue_per_visit,
      customer_status,
      category,
      user_type,
      email
    FROM
      data_attendees
    LEFT JOIN
      mb_locations
      ON mb_locations.mblocationid = data_attendees.locationid
      AND mb_locations.mbstudioid = data_attendees."studioID"
      AND data_attendees.source = 'mb'
    LEFT JOIN
      zf_sites
      ON zf_sites.zfsite_id = data_attendees.locationid
      AND zf_sites.zfstudio_id = data_attendees."studioID"
      AND data_attendees.source = 'zf'
    WHERE COALESCE(mb_locations.visible, zf_sites.visible) IS TRUE
  )
  SELECT DISTINCT
    visit_date_trunc,
    "studioID",
    locationid,
    source,
    "mainTZ",
    revenue_per_visit,
    customer_status,
    category,
    user_type,
    email
  FROM visible_studio_data_attendees
  UNION ALL
  SELECT DISTINCT
    visit_date_trunc,
    "studioID",
    0 as locationid,
    source,
    "mainTZ",
    revenue_per_visit,
    customer_status,
    category,
    user_type,
    email
  FROM visible_studio_data_attendees
);
CREATE UNIQUE INDEX data_attendees_view_source_studioid_locationid_email ON data_attendees_view (source, "studioID", locationid, email, visit_date_trunc, revenue_per_visit, customer_status, category, user_type);
COMMIT;
