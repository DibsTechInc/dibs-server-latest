BEGIN;
DROP MATERIALIZED VIEW IF EXISTS percent_visits_on_dibs;
CREATE MATERIALIZED VIEW percent_visits_on_dibs AS(
  WITH distinct_dibs_user_counts AS (
    SELECT
      studio_with_locations.source,
      studio_with_locations.studioid,
      studio_with_locations.locationid,
      DATE_TRUNC('month', visit_date_trunc),
      count(DISTINCT email) as users_count
    FROM
      studio_with_locations
    LEFT JOIN
      data_attendees_view
      ON studio_with_locations.studioid = data_attendees_view."studioID"
      AND studio_with_locations.source = data_attendees_view.source
      AND studio_with_locations.locationid = data_attendees_view.locationid
    WHERE
      data_attendees_view.visit_date_trunc <= TIMEZONE (studio_with_locations."mainTZ", TIMEZONE ('utc', NOW():: TIMESTAMP ))
      AND category = 'D'
    GROUP BY DATE_TRUNC('month', visit_date_trunc), studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid
  ), grouped_bookings AS (
   SELECT
    studio_with_locations.source,
    studio_with_locations.studioid,
    studio_with_locations.locationid,
    DATE_TRUNC('month', visit_date_trunc),
    SUM(CASE WHEN category = 'D' THEN 1 ELSE 0 END) as dibs_bookings,
    COUNT(*) as total_bookings
  FROM
    studio_with_locations
  LEFT JOIN
    data_attendees_view
    ON studio_with_locations.studioid = data_attendees_view."studioID"
    AND studio_with_locations.source = data_attendees_view.source
    AND studio_with_locations.locationid = data_attendees_view.locationid
  WHERE
    data_attendees_view.visit_date_trunc <= TIMEZONE (studio_with_locations."mainTZ", TIMEZONE ('utc', NOW():: TIMESTAMP ))
  GROUP BY DATE_TRUNC('month', visit_date_trunc), studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid
  )
 SELECT DISTINCT
   grouped_bookings.*,
   GREATEST(distinct_dibs_user_counts.users_count,0) as dibs_users
  FROM grouped_bookings
  LEFT JOIN distinct_dibs_user_counts
   ON grouped_bookings.studioid = distinct_dibs_user_counts.studioid
    AND grouped_bookings.source = distinct_dibs_user_counts.source
    AND grouped_bookings.locationid = distinct_dibs_user_counts.locationid
    AND grouped_bookings.date_trunc = distinct_dibs_user_counts.date_trunc
);
CREATE UNIQUE INDEX percent_visits_on_dibs_source_studioid_locationid_date_trunc ON percent_visits_on_dibs (source, studioid, locationid, date_trunc);
COMMIT;
