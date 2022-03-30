CREATE MATERIALIZED VIEW visits_per_customer AS (
  WITH attendees_last_month AS (
    SELECT DISTINCT
      studio_with_locations.source,
      studio_with_locations.studioid,
      studio_with_locations.locationid,
      'Have not returned' as customer_status,
      email
    FROM
      studio_with_locations
    LEFT JOIN
      data_attendees_view
      ON studio_with_locations.studioid = data_attendees_view."studioID"
      AND studio_with_locations.source = data_attendees_view.source
      AND studio_with_locations.locationid = data_attendees_view.locationid
    WHERE
      DATE_TRUNC('month', data_attendees_view.visit_date_trunc) = DATE_TRUNC('month', timezone(studio_with_locations."mainTZ",timezone('utc', NOW()::TIMESTAMP))) - INTERVAL '1 month'
    GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, email, customer_status
  ), attendees_since_start_of_month AS (
    SELECT DISTINCT
      studio_with_locations.source,
      studio_with_locations.studioid,
      studio_with_locations.locationid,
      customer_status,
      email
    FROM
      studio_with_locations
    RIGHT OUTER JOIN
      data_attendees_view
      ON studio_with_locations.studioid = data_attendees_view."studioID"
      AND studio_with_locations.source = data_attendees_view.source
      AND studio_with_locations.locationid = data_attendees_view.locationid
    WHERE
      DATE_TRUNC('month', data_attendees_view.visit_date_trunc) = DATE_TRUNC('month', timezone(studio_with_locations."mainTZ",timezone('utc', NOW()::TIMESTAMP)))
      AND data_attendees_view.visit_date_trunc < TIMEZONE (studio_with_locations."mainTZ", TIMEZONE ('utc', NOW():: TIMESTAMP ))
    GROUP BY studio_with_locations.source, studio_with_locations.studioid, studio_with_locations.locationid, email, customer_status
  ),  emails_with_counts AS (
    SELECT DISTINCT
      COALESCE(attendees_last_month.source, attendees_since_start_of_month.source) as source,
      COALESCE(attendees_last_month.studioid, attendees_since_start_of_month.studioid) as studioid,
      COALESCE(attendees_last_month.locationid, attendees_since_start_of_month.locationid) as locationid,
      COALESCE(attendees_last_month.email, attendees_since_start_of_month.email) as email,
      SUM(
          CASE
            WHEN attendees_since_start_of_month.customer_status = 'Returning'
              THEN 1
            ELSE 0
          END
      ) as returning_customers,
      SUM(
          CASE
            WHEN attendees_since_start_of_month.customer_status = 'New'
              THEN 1
            ELSE 0
          END
      ) as new_customers,
      SUM(
          CASE
            WHEN attendees_since_start_of_month.customer_status = 'Re-Engaged'
              THEN 1
            ELSE 0
          END
      ) as reengaged_customers,
      SUM(
          CASE
            WHEN attendees_since_start_of_month.customer_status IS NULL
              THEN 1
            ELSE 0
          END
      ) as have_not_returned
    FROM attendees_last_month
    FULL OUTER JOIN attendees_since_start_of_month
      ON attendees_since_start_of_month.source = attendees_last_month.source
      AND attendees_since_start_of_month.studioid = attendees_last_month.studioid
      AND attendees_since_start_of_month.locationid = attendees_last_month.locationid
      AND attendees_since_start_of_month.email = attendees_last_month.email
    GROUP BY
      COALESCE(attendees_last_month.source, attendees_since_start_of_month.source),
      COALESCE(attendees_last_month.studioid, attendees_since_start_of_month.studioid),
      COALESCE(attendees_last_month.locationid, attendees_since_start_of_month.locationid),
      COALESCE(attendees_last_month.email, attendees_since_start_of_month.email)
  )
  SELECT DISTINCT
    emails_with_counts.source,
    emails_with_counts.studioid,
    emails_with_counts.locationid,
    SUM(CASE WHEN new_customers = 1 THEN 1 ELSE 0 END) as new_customers,
    SUM(CASE WHEN new_customers = 0 AND returning_customers = 1 THEN 1 ELSE 0 END) as returning_customers,
    SUM(CASE WHEN new_customers = 0 AND returning_customers = 0 and reengaged_customers = 1 THEN 1 ELSE 0 END) as reengaged_customers,
    SUM(CASE WHEN new_customers = 0 AND returning_customers = 0 and reengaged_customers = 0 AND have_not_returned = 1 THEN 1 ELSE 0 END) as have_not_returned
  FROM emails_with_counts
  GROUP BY
    emails_with_counts.source,
    emails_with_counts.studioid,
    emails_with_counts.locationid
);

CREATE UNIQUE INDEX vists_per_customer_source_studioid_locationid_customer_status ON visits_per_customer (source, studioid, locationid);
