CREATE MATERIALIZED VIEW avg_per_customer AS (
  WITH distinct_users_per_studio_location AS (
    SELECT DISTINCT
      studio_with_locations.source,
      studio_with_locations.studioid,
      studio_with_locations.locationid,
      email,
      user_type,
      SUM(revenue_per_visit) as revenue
    FROM
      studio_with_locations
    LEFT JOIN
      data_attendees_view
      ON studio_with_locations.studioid = data_attendees_view."studioID"
      AND studio_with_locations.source = data_attendees_view.source
      AND studio_with_locations.locationid = data_attendees_view.locationid
    WHERE
      DATE_TRUNC('day', data_attendees_view.visit_date_trunc) >= DATE_TRUNC('day', timezone(studio_with_locations."mainTZ",timezone('utc', NOW()::TIMESTAMP))) - INTERVAL '30 Days'
      AND data_attendees_view.visit_date_trunc <= TIMEZONE (studio_with_locations."mainTZ", TIMEZONE ('utc', NOW():: TIMESTAMP ))
    GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, email, user_type
  )
  SELECT
    source,
    studioid,
    locationid,
    SUM(CASE user_type WHEN 'Dibs User' THEN 1 ELSE 0 END) as dibs_customers,
    SUM(CASE user_type WHEN 'Dibs User' THEN 0 ELSE 1 END) as non_dibs_customers,
    SUM(CASE user_type WHEN 'Dibs User' THEN revenue ELSE 0 END) as dibs_revenue,
    SUM(CASE user_type WHEN 'Dibs User' THEN 0 ELSE revenue END) AS non_dibs_revenue
  FROM
    distinct_users_per_studio_location
  GROUP BY source, studioid, locationid
); 
CREATE UNIQUE INDEX avg_per_customer_source_studioid_locationid ON avg_per_customer (source, studioid, locationid);
