CREATE MATERIALIZED VIEW average_visits_per_customer AS (
  WITH visits_last_30_days AS (
    SELECT
      studio_with_locations.studioid,
      studio_with_locations.source,
      studio_with_locations.locationid,
      studio_with_locations."mainTZ",
      user_type,
      email
    FROM
      studio_with_locations
    RIGHT OUTER JOIN
      data_attendees_view
      ON studio_with_locations.studioid = data_attendees_view."studioID"
      AND studio_with_locations.source = data_attendees_view.source
      AND studio_with_locations.locationid = data_attendees_view.locationid
    WHERE
      DATE_TRUNC('day', data_attendees_view.visit_date_trunc) >= DATE_TRUNC('day', TIMEZONE (studio_with_locations."mainTZ", TIMEZONE ('utc', NOW():: TIMESTAMP ))) - INTERVAL '30 days'
    AND DATE_TRUNC('day', data_attendees_view.visit_date_trunc) <= DATE_TRUNC('day', TIMEZONE (studio_with_locations."mainTZ", TIMEZONE ('utc', NOW():: TIMESTAMP )))
  ), visitors_last_30_days AS (
  SELECT DISTINCT
    *
  FROM visits_last_30_days
  ), visits_last_30_days_counts AS (
  SELECT
    source,
    studioid,
    locationid,
    SUM( CASE WHEN user_type = 'Member' THEN 1 ELSE 0 END ) AS total_member_visits,
    SUM( CASE WHEN user_type = 'Dibs User' THEN 1 ELSE 0 END ) AS total_dibs_visits,
    SUM( CASE WHEN user_type = 'Non Dibs User' THEN 1 ELSE 0 END ) AS total_non_dibs_visits
  FROM
    visits_last_30_days
  GROUP BY source, studioid, locationid
  ), visitors_last_30_days_counts AS (
  SELECT
    source,
    studioid,
    locationid,
    SUM( CASE WHEN user_type = 'Member' THEN 1 ELSE 0 END ) AS total_member_visitors,
    SUM( CASE WHEN user_type = 'Dibs User' THEN 1 ELSE 0 END ) AS total_dibs_visitors,
    SUM( CASE WHEN user_type = 'Non Dibs User' THEN 1 ELSE 0 END ) AS total_non_dibs_visitors
  FROM
    visitors_last_30_days
  GROUP BY source, studioid, locationid
  )
  SELECT
    visits_last_30_days_counts.source,
    visits_last_30_days_counts.studioid,
    visits_last_30_days_counts.locationid,
    total_member_visitors,
    total_dibs_visitors,
    total_non_dibs_visitors,
    total_member_visits,
    total_dibs_visits,
    total_non_dibs_visits
  FROM
    visits_last_30_days_counts
  LEFT JOIN
    visitors_last_30_days_counts
    ON visits_last_30_days_counts.source = visitors_last_30_days_counts.source
    AND visits_last_30_days_counts.studioid = visitors_last_30_days_counts.studioid
    AND visits_last_30_days_counts.locationid = visitors_last_30_days_counts.locationid
);

CREATE UNIQUE INDEX average_visits_per_customer_source_studioid_locationid ON average_visits_per_customer (source,studioid,locationid);
