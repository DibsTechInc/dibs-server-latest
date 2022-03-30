BEGIN;
DROP MATERIALIZED VIEW data_attendees_view;
CREATE MATERIALIZED VIEW data_attendees_view AS (
  WITH visible_studio_data_attendees AS (
    SELECT
      visit_date_trunc,
      "studioID",
      locationid,
      data_attendees.source,
      "mainTZ",
      revenue_per_visit,
      customer_status,
      category,
      user_type,
      email
    FROM
      data_attendees
    LEFT JOIN
      dibs_studio_locations
      ON dibs_studio_locations.source_location_id = data_attendees.locationid
      AND dibs_studio_locations.studioid = data_attendees."studioID"
      AND data_attendees.source = dibs_studio_locations.source
    WHERE dibs_studio_locations.visible IS TRUE
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
