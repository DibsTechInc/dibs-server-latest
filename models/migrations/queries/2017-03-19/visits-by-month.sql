CREATE MATERIALIZED VIEW visits_by_month AS (
  WITH distinct_users_by_month AS (
    SELECT DISTINCT
      studio_with_locations.source,
      studio_with_locations.studioid,
      studio_with_locations.locationid,
      DATE_TRUNC('month', visit_date_trunc),
      customer_status,
      email
    FROM
      studio_with_locations
    LEFT JOIN
      data_attendees_view
      ON studio_with_locations.studioid = data_attendees_view."studioID"
      AND studio_with_locations.source = data_attendees_view.source
      AND studio_with_locations.locationid = data_attendees_view.locationid
      AND DATE_TRUNC('day', data_attendees_view.visit_date_trunc) < DATE_TRUNC('month', TIMEZONE (studio_with_locations."mainTZ", TIMEZONE ('utc', NOW():: TIMESTAMP )))
    GROUP BY DATE_TRUNC('month', visit_date_trunc), studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, email, customer_status
  )
  SELECT
    source,
    studioid,
    locationid,
    date_trunc,
    SUM(CASE WHEN distinct_users_by_month.customer_status = 'New' THEN 1 ELSE 0 END) as new_visitors,
    SUM(CASE WHEN distinct_users_by_month.customer_status = 'New' THEN 0 ELSE 1 END) as returning_visitors
  FROM distinct_users_by_month
  GROUP BY source, studioid, locationid, date_trunc
);
CREATE UNIQUE INDEX visits_by_month_source_studioid_locationid_date_trunc ON visits_by_month (source, studioid, locationid, date_trunc);
