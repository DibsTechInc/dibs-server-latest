BEGIN;
DROP MATERIALIZED VIEW metric_tables;
CREATE MATERIALIZED VIEW metric_tables AS (
  WITH visits_this_year_to_now AS (
    SELECT DISTINCT
      visit_date_trunc,
      data_attendeesmv.email,
      studio_with_locations.studioid,
      studio_with_locations.source,
      studio_with_locations.locationid,
      studio_with_locations."mainTZ",
      data_attendeesmv.revenue_per_visit
    FROM
      studio_with_locations
    LEFT JOIN data_attendees_view as data_attendeesmv
      ON data_attendeesmv."studioID" = studio_with_locations.studioid
      AND data_attendeesmv.locationid = studio_with_locations.locationid
      AND data_attendeesmv.source = studio_with_locations.source
    WHERE
      DATE_TRUNC('year', data_attendeesmv.visit_date_trunc :: TIMESTAMP) = DATE_TRUNC('year', timezone(data_attendeesmv."mainTZ", timezone('utc', NOW()::TIMESTAMP)))
      AND DATE_TRUNC('minute', data_attendeesmv.visit_date_trunc :: TIMESTAMP) <= DATE_TRUNC('minute', timezone(data_attendeesmv."mainTZ", timezone('utc', NOW()::TIMESTAMP)))
    ORDER BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, visit_date_trunc
  ), unique_visits_this_year_to_now AS (
    SELECT DISTINCT
      DATE_TRUNC('year', visit_date_trunc) AS visit_date_trunc,
      email,
      studioid,
      source,
      locationid,
      "mainTZ"
    FROM
      visits_this_year_to_now
    ORDER BY source, studioid,locationid
  ), visits_this_month_to_now AS (
    SELECT DISTINCT
      *
    FROM visits_this_year_to_now
    WHERE
      DATE_TRUNC('month', visits_this_year_to_now.visit_date_trunc :: TIMESTAMP) = DATE_TRUNC('month', timezone(visits_this_year_to_now."mainTZ", timezone('utc', NOW()::TIMESTAMP)))
      AND DATE_TRUNC('minute', visits_this_year_to_now.visit_date_trunc :: TIMESTAMP) <= DATE_TRUNC('minute', timezone(visits_this_year_to_now."mainTZ", timezone('utc', NOW()::TIMESTAMP)))
  ), unique_visits_this_month_to_now AS (
    SELECT DISTINCT
      DATE_TRUNC('month', visit_date_trunc) AS visit_date_trunc,
      email,
      studioid,
      source,
      locationid,
      "mainTZ"
    FROM visits_this_month_to_now
    ORDER BY source, studioid, locationid
  ), visits_today_to_now AS (
    SELECT DISTINCT
      *
    FROM visits_this_month_to_now
    WHERE
      DATE_TRUNC('day', visits_this_month_to_now.visit_date_trunc :: TIMESTAMP) = DATE_TRUNC('day', timezone(visits_this_month_to_now."mainTZ", timezone('utc', NOW()::TIMESTAMP)))
      AND DATE_TRUNC('day', visits_this_month_to_now.visit_date_trunc :: TIMESTAMP) <= DATE_TRUNC('day', timezone(visits_this_month_to_now."mainTZ", timezone('utc', NOW()::TIMESTAMP)))
  ), unique_visits_today_to_now AS (
    SELECT DISTINCT
      DATE_TRUNC('day', visit_date_trunc) AS visit_date_trunc,
      email,
      studioid,
      source,
      locationid,
      "mainTZ"
    FROM visits_today_to_now
    ORDER BY source, studioid, locationid
  ), visits_last_month AS (
    SELECT
      *
    FROM
      visits_this_year_to_now
    WHERE
      visit_date_trunc >=  DATE_TRUNC('month', timezone(visits_this_year_to_now."mainTZ", timezone('utc', NOW()))) - INTERVAL '1 month'
      AND visit_date_trunc <  DATE_TRUNC('month', timezone(visits_this_year_to_now."mainTZ", timezone('utc', NOW())))
  ), visits_last_month_to_day AS (
      SELECT
        *
      FROM
        visits_last_month
      WHERE
        visit_date_trunc <  timezone(visits_last_month."mainTZ", timezone('utc', NOW())) - INTERVAL '1 month'
  ), unique_visits_last_month AS (
    SELECT DISTINCT
        DATE_TRUNC('month', visit_date_trunc) AS visit_date_trunc,
        email,
        studioid,
        source,
        locationid,
        "mainTZ"
      FROM visits_last_month
      ORDER BY source, studioid, locationid
  ), unique_visits_last_month_to_day AS (
    SELECT DISTINCT
        DATE_TRUNC('month', visit_date_trunc) AS visit_date_trunc,
        email,
        studioid,
        source,
        locationid,
        "mainTZ"
      FROM visits_last_month
      WHERE visits_last_month.visit_date_trunc <= timezone("mainTZ", timezone('utc', NOW())) - INTERVAL '1 month'
      ORDER BY source, studioid, locationid
  ), visits_this_year_to_now_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('year', visit_date_trunc), DATE_TRUNC('year', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        SUM(GREATEST(visits_this_year_to_now.revenue_per_visit, 0)) as revenue,
        GREATEST(COUNT(*),0) as count
      FROM
        studio_with_locations
      LEFT JOIN
        visits_this_year_to_now
        ON studio_with_locations.studioid = visits_this_year_to_now.studioid
        AND studio_with_locations.locationid = visits_this_year_to_now.locationid
        AND studio_with_locations.source = visits_this_year_to_now.source
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('year', visit_date_trunc), studio_with_locations."mainTZ"
  ), visits_this_month_to_now_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('month', visit_date_trunc), DATE_TRUNC('month', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        SUM(GREATEST(visits_this_month_to_now.revenue_per_visit, 0)) as revenue,
        GREATEST(COUNT(*),0) as count
      FROM
        studio_with_locations
      LEFT JOIN
        visits_this_month_to_now
        ON studio_with_locations.studioid = visits_this_month_to_now.studioid
        AND studio_with_locations.locationid = visits_this_month_to_now.locationid
        AND studio_with_locations.source = visits_this_month_to_now.source
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('month', visit_date_trunc), studio_with_locations."mainTZ"
  ), visits_today_to_now_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('day', visit_date_trunc), DATE_TRUNC('day', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        SUM(GREATEST(visits_today_to_now.revenue_per_visit, 0)) as revenue,
        GREATEST(COUNT(*),0) as count
      FROM
        studio_with_locations
      LEFT JOIN
        visits_today_to_now
        ON studio_with_locations.studioid = visits_today_to_now.studioid
        AND studio_with_locations.locationid = visits_today_to_now.locationid
        AND studio_with_locations.source = visits_today_to_now.source
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('day', visit_date_trunc), studio_with_locations."mainTZ"
  ), unique_visits_this_year_to_now_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('year', visit_date_trunc), DATE_TRUNC('year', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        GREATEST(COUNT(*), 0) as count
      FROM
        studio_with_locations
      LEFT JOIN unique_visits_this_year_to_now
        ON studio_with_locations.studioid = unique_visits_this_year_to_now.studioid
        AND studio_with_locations.locationid = unique_visits_this_year_to_now.locationid
        AND studio_with_locations.source = unique_visits_this_year_to_now.source
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('year', visit_date_trunc), studio_with_locations."mainTZ"
  ), unique_visits_this_month_to_now_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('month', visit_date_trunc), DATE_TRUNC('month', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        GREATEST(COUNT(*), 0) as count
      FROM
        studio_with_locations
      LEFT JOIN unique_visits_this_month_to_now
        ON studio_with_locations.studioid = unique_visits_this_month_to_now.studioid
        AND studio_with_locations.locationid = unique_visits_this_month_to_now.locationid
        AND studio_with_locations.source = unique_visits_this_month_to_now.source
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('month', visit_date_trunc), studio_with_locations."mainTZ"
  ), unique_visits_today_to_now_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('day', visit_date_trunc), DATE_TRUNC('day', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        GREATEST(COUNT(*), 0) as count
      FROM
        studio_with_locations
      LEFT JOIN unique_visits_today_to_now
        ON studio_with_locations.studioid = unique_visits_today_to_now.studioid
        AND studio_with_locations.locationid = unique_visits_today_to_now.locationid
        AND studio_with_locations.source = unique_visits_today_to_now.source
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('day', unique_visits_today_to_now.visit_date_trunc), studio_with_locations."mainTZ"
  ), visits_last_month_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('month', visit_date_trunc), DATE_TRUNC('month', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        SUM(GREATEST(visits_last_month.revenue_per_visit, 0)) as revenue,
        GREATEST(COUNT(*),0) as count
      FROM
        studio_with_locations
      LEFT JOIN
        visits_last_month
        ON studio_with_locations.studioid = visits_last_month.studioid
        AND studio_with_locations.locationid = visits_last_month.locationid
        AND studio_with_locations.source = visits_last_month.source
      WHERE
        visit_date_trunc >=  DATE_TRUNC('month', timezone(visits_last_month."mainTZ", timezone('utc', NOW()))) - INTERVAL '1 month'
        AND visit_date_trunc <  DATE_TRUNC('month', timezone(visits_last_month."mainTZ", timezone('utc', NOW())))
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('month', visit_date_trunc), studio_with_locations."mainTZ"
  ), visits_last_month_to_day_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('month', visit_date_trunc), DATE_TRUNC('month', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        SUM(GREATEST(visits_last_month.revenue_per_visit, 0)) as revenue,
        GREATEST(COUNT(*),0) as count
      FROM
        studio_with_locations
      LEFT JOIN
        visits_last_month
        ON studio_with_locations.studioid = visits_last_month.studioid
        AND studio_with_locations.locationid = visits_last_month.locationid
        AND studio_with_locations.source = visits_last_month.source
      WHERE
        visit_date_trunc <  timezone(visits_last_month."mainTZ", timezone('utc', NOW())) - INTERVAL '1 month'
      GROUP BY
        studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('month', visit_date_trunc), studio_with_locations."mainTZ"
  ), unique_visits_last_month_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('month', visit_date_trunc), DATE_TRUNC('month', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        GREATEST(COUNT(*), 0) as count
      FROM
        studio_with_locations
      LEFT JOIN unique_visits_last_month
        ON studio_with_locations.studioid = unique_visits_last_month.studioid
        AND studio_with_locations.locationid = unique_visits_last_month.locationid
        AND studio_with_locations.source = unique_visits_last_month.source
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('month', visit_date_trunc), studio_with_locations."mainTZ"
  ), unique_visits_last_month_to_day_counts AS (
      SELECT
        studio_with_locations.studioid,
        studio_with_locations.locationid,
        studio_with_locations.source,
        COALESCE(DATE_TRUNC('month', visit_date_trunc), DATE_TRUNC('month', timezone(studio_with_locations."mainTZ", timezone('utc', NOW())))) as visit_date_trunc,
        GREATEST(COUNT(*), 0) as count
      FROM
        studio_with_locations
      LEFT JOIN unique_visits_last_month_to_day
        ON studio_with_locations.studioid = unique_visits_last_month_to_day.studioid
        AND studio_with_locations.locationid = unique_visits_last_month_to_day.locationid
        AND studio_with_locations.source = unique_visits_last_month_to_day.source
      GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, DATE_TRUNC('month', visit_date_trunc), studio_with_locations."mainTZ"
  )
  SELECT
    visits_today_to_now_counts.visit_date_trunc,
    studio_with_locations.studioid,
    studio_with_locations.locationid,
    studio_with_locations.source,
    visits_this_year_to_now_counts.count as visits_year_to_now,
    visits_this_year_to_now_counts.revenue as revenue_year_to_now,
    visits_this_year_to_now_counts.revenue / unique_visits_this_year_to_now_counts.count AS revenue_per_visitor_this_year,
    visits_this_month_to_now_counts.count as visits_month_to_now,
    visits_this_month_to_now_counts.revenue as revenue_month_to_now,
    visits_this_month_to_now_counts.revenue / unique_visits_this_month_to_now_counts.count AS revenue_per_visitor_this_month,
    visits_today_to_now_counts.count as visits_today,
    visits_today_to_now_counts.revenue as revenue_today,
    visits_today_to_now_counts.revenue / unique_visits_today_to_now_counts.count AS revenue_per_visitor_today,
    unique_visits_this_year_to_now_counts.count as unique_visits_this_year,
    unique_visits_this_month_to_now_counts.count as unique_visits_this_month,
    unique_visits_today_to_now_counts.count as unique_visits_today,
    visits_last_month_counts.count as visits_last_month,
    unique_visits_last_month_counts.count as unique_visits_last_month,
    visits_last_month_counts.revenue as revenue_last_month,
    visits_last_month_counts.revenue / unique_visits_last_month_counts.count as revenue_per_visitor_last_month,
    visits_last_month_to_day_counts.count as visits_last_month_to_day,
    visits_last_month_to_day_counts.revenue as revenue_last_month_to_day,
    unique_visits_last_month_to_day_counts.count as unique_visitors_last_month_to_day
  FROM studio_with_locations
  LEFT JOIN visits_this_year_to_now_counts
    ON studio_with_locations.source = visits_this_year_to_now_counts.source
    AND studio_with_locations.studioid = visits_this_year_to_now_counts.studioid
    AND studio_with_locations.locationid = visits_this_year_to_now_counts.locationid
  LEFT JOIN visits_this_month_to_now_counts
    ON studio_with_locations.source = visits_this_month_to_now_counts.source
    AND studio_with_locations.studioid = visits_this_month_to_now_counts.studioid
    AND studio_with_locations.locationid = visits_this_month_to_now_counts.locationid
  LEFT JOIN visits_today_to_now_counts
    ON studio_with_locations.source = visits_today_to_now_counts.source
    AND studio_with_locations.studioid = visits_today_to_now_counts.studioid
    AND studio_with_locations.locationid = visits_today_to_now_counts.locationid
  LEFT JOIN unique_visits_this_month_to_now_counts
    ON studio_with_locations.source = unique_visits_this_month_to_now_counts.source
    AND studio_with_locations.studioid = unique_visits_this_month_to_now_counts.studioid
    AND studio_with_locations.locationid = unique_visits_this_month_to_now_counts.locationid
  LEFT JOIN unique_visits_today_to_now_counts
    ON studio_with_locations.source = unique_visits_today_to_now_counts.source
    AND studio_with_locations.studioid = unique_visits_today_to_now_counts.studioid
    AND studio_with_locations.locationid = unique_visits_today_to_now_counts.locationid
  LEFT JOIN unique_visits_this_year_to_now_counts
    ON studio_with_locations.source = unique_visits_this_year_to_now_counts.source
    AND studio_with_locations.studioid = unique_visits_this_year_to_now_counts.studioid
    AND studio_with_locations.locationid = unique_visits_this_year_to_now_counts.locationid
  LEFT JOIN unique_visits_last_month_counts
    ON studio_with_locations.source = unique_visits_last_month_counts.source
    AND studio_with_locations.studioid = unique_visits_last_month_counts.studioid
    AND studio_with_locations.locationid = unique_visits_last_month_counts.locationid
  LEFT JOIN visits_last_month_counts
    ON studio_with_locations.source = visits_last_month_counts.source
    AND studio_with_locations.studioid = visits_last_month_counts.studioid
    AND studio_with_locations.locationid = visits_last_month_counts.locationid
  LEFT JOIN visits_last_month_to_day_counts
    ON studio_with_locations.source = visits_last_month_to_day_counts.source
    AND studio_with_locations.studioid = visits_last_month_to_day_counts.studioid
    AND studio_with_locations.locationid = visits_last_month_to_day_counts.locationid
  LEFT JOIN unique_visits_last_month_to_day_counts
    ON studio_with_locations.source = unique_visits_last_month_to_day_counts.source
    AND studio_with_locations.studioid = unique_visits_last_month_to_day_counts.studioid
    AND studio_with_locations.locationid = unique_visits_last_month_to_day_counts.locationid
);
CREATE UNIQUE INDEX metric_tables_studioid_source_locationid ON metric_tables (source, studioid, locationid);
COMMIT;
