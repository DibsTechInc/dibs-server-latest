WITH fake_studio_table AS (
    SELECT *
    FROM
          json_to_recordset($studioData) AS x(source VARCHAR, studioid INT)
), the_studios AS (
    SELECT DISTINCT
      dibs_studios.id,
      dibs_studios.studioid                               AS dibs_studio_id,
      dibs_studios.source,
      COALESCE(studio_brands.source, dibs_studios.source) AS studio_source,
      CASE WHEN dibs_studios.source = 'brnd'
        THEN studio_brands.studioid
      ELSE dibs_studios.studioid
      END                                                 AS studioid,
      dibs_studios."mainTZ",
      dibs_studios.name,
      dibs_studios.currency,
      dibs_studios.live
    FROM
      dibs_studios
      LEFT JOIN studio_brands
        ON dibs_studios.studioid = studio_brands.brandid
           AND dibs_studios.source = 'brnd'
), selected_studios AS (
    SELECT the_studios.*
    FROM
      the_studios
      LEFT JOIN fake_studio_table fst
        ON fst.source = the_studios.source
           AND fst.studioid = the_studios.dibs_studio_id
    WHERE (
      fst.source IS NOT NULL OR NOT EXISTS(
          SELECT *
          FROM fake_studio_table
      )
    )
)
SELECT
  events.eventid                                                      AS id,
  events.source,
  events.name,
  events.price_dibs                                                   AS price,
  events.address,
  events.classid,
  events.studioid,
  events.seats                                                        AS maximum_enrollment,
  COALESCE(events.spots_booked, 0)                                    AS current_enrollment,
  CASE events.source
  WHEN 'mb'
    THEN COALESCE(events.spots_booked, 0) >= events.seats
  WHEN 'pt'
    THEN COALESCE(events.spots_booked, 0) >= events.seats
  WHEN 'zf'
    THEN COALESCE(events.spots_booked, 0) >= events.seats
  END                                                                 AS isfull,
  CASE 
  WHEN (
      SELECT count(id)
      FROM dibs_transactions
      WHERE dibs_transactions.eventid = events.eventid
      AND type='wait'
      AND "deletedAt" is NULL
      AND status=1
  )> 0
    THEN TRUE
    ELSE FALSE
  END                                                                 AS has_active_waitlist,
  events.seats - COALESCE(events.spots_booked, 0)                     AS seats_remaining,
  TIMEZONE(selected_studios."mainTZ", events.start_date :: TIMESTAMP) AS start_time,
  TIMEZONE(selected_studios."mainTZ", events.end_date :: TIMESTAMP)   AS end_time,
  events.free_class,
  events.category,
  (
    SELECT row_to_json(t)
    FROM (
           SELECT
             dsl.id,
             COALESCE(dsl.short_name, dsl.name) as name,
             COALESCE(dsl."cityOverride", dsl.city) as city,
             COALESCE(dsl.tax_rate, 0) as tax_rate
           FROM
             dibs_studio_locations AS dsl
           WHERE dsl.id = events.locationid
         ) AS t
  )                                                                   AS location,
  (
    SELECT row_to_json(t)
    FROM (
           SELECT
             dsi.id,
             dsi.firstname || ' ' || dsi.lastname as name
           FROM dibs_studio_instructors AS dsi
           WHERE dsi.id = events.trainerid
         ) AS t
  )                                                                   AS instructor,
  (
    SELECT
      row_to_json(t)
    FROM (
           SELECT
             ss.live,
             ss.name
           FROM the_studios AS ss
           WHERE
             ss.source = events.source
             AND ss.studioid = events.studioid
         ) AS t
  )                                                                   AS studio,
  selected_studios.currency,
  selected_studios."mainTZ"
FROM events
  INNER JOIN selected_studios
    ON events.source = selected_studios.studio_source
       AND events.studioid = selected_studios.studioid
  LEFT JOIN dibs_studio_instructors
    ON dibs_studio_instructors.id = events.trainerid
  INNER JOIN (
               SELECT
                  *
               FROM
                 dibs_studio_locations dsl
               WHERE dsl.visible IS TRUE
             ) AS dibs_studio_locations
    ON dibs_studio_locations.id = events.locationid
WHERE
  events.start_date > $startTime
AND events.start_date < $endTime
AND events.deleted = 0
AND events.canceled = 0
AND events.price_dibs IS NOT NULL
AND (events.price_dibs > 0 OR events.free_class != FALSE )
AND events.seats > 0
ORDER BY events.start_date, events.eventid;
