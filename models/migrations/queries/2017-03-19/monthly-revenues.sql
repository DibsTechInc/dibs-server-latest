CREATE MATERIALIZED VIEW monthly_revenues AS (
  SELECT
    studio_with_locations.source,
    studio_with_locations.studioid,
    studio_with_locations.locationid,
    DATE_TRUNC('month', visit_date_trunc),
    sum(data_attendees_view.revenue_per_visit)
  FROM
    studio_with_locations
  LEFT JOIN
    data_attendees_view
    ON studio_with_locations.studioid = data_attendees_view."studioID"
    AND studio_with_locations.source = data_attendees_view.source
    AND studio_with_locations.locationid = data_attendees_view.locationid
  WHERE
    DATE_TRUNC('month', visit_date_trunc) > DATE_TRUNC('month', timezone(studio_with_locations."mainTZ", timezone('utc', NOW()::TIMESTAMP))) - INTERVAL '5 months'
    AND data_attendees_view.visit_date_trunc <= TIMEZONE (studio_with_locations."mainTZ", TIMEZONE ('utc', NOW():: TIMESTAMP ))
  GROUP BY DATE_TRUNC('month', visit_date_trunc), studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid
);
CREATE UNIQUE INDEX monthly_revenues_source_studioid_locationid_date_trunc ON monthly_revenues (source, studioid, locationid, date_trunc);
