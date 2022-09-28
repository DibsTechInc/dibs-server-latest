WITH the_studios AS (
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
      dibs_studios.live,
      dibs_studios.country,
      dibs_studios.client_id,
      dibs_studios.client_secret
    FROM
      dibs_studios
      LEFT JOIN studio_brands
        ON dibs_studios.studioid = studio_brands.brandid
           AND dibs_studios.source = 'brnd'
     WHERE (
        NOT EXISTS(
            SELECT
              dibs_studio_id
            FROM
              UNNEST($studioData::int[]) as dibs_studio_id
        )
        OR (dibs_studios.id IN (
          $dibsId
        ))
      )
), selected_studios AS (
    SELECT the_studios.*
    FROM the_studios
)
SELECT
  events.dibs_studio_id,
  events.eventid                                                      AS id,
  events.source,
  events.name,
  events.price_dibs                                                   AS price,
  events.manual_track_id,
  events.post_class_zoom_link,
  events.zoom_password,
  events.address,
  events.classid,
  events.studioid,
  events.has_waitlist,
  TO_CHAR(start_date:: DATE, 'mm/dd/yyyy')                           AS starting_date,
  events.free_class,
  events.private,
  events.on_demand,
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
  events.category,
  events.free_class,
  events.can_apply_pass,
  events.description,
  events.zf_series_types,
  events.class_notes,
  events.is_recurring,
  rooms.source_image_url as "roomMap",
  (
    SELECT row_to_json(t)
    FROM (
           SELECT
             dsl.id,
             dsl.region_id,
             COALESCE(dsl.short_name, dsl.name) as name,
             COALESCE(dsl."cityOverride", dsl.city) as city,
             COALESCE(dsl.tax_rate, 0) as tax_rate,
             (dsl.address || ' ' || dsl.city || ' ' || dsl.state || ' ' || dsl.zipcode || ' ' || selected_studios.country) as address
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
             dsi.image_url,
             CASE
               WHEN dsi.firstname ILIKE dsi.lastname THEN dsi.firstname
               ELSE dsi.firstname || ' ' || dsi.lastname
             END AS name
           FROM dibs_studio_instructors AS dsi
           WHERE dsi.id = events.trainerid
         ) AS t
  )                                                                   AS instructor,
  (
    SELECT row_to_json(t)
    FROM (
           SELECT cea.notice_message
           FROM custom_events_attributes AS cea
           WHERE cea.event_name = events.name
         ) AS t
  )                                                                   AS custom_attributes,
  (
    SELECT
      row_to_json(t)
    FROM (
           SELECT
             ss.live,
             ss.name,
             ss.id,
             ss.client_id,
             ss.client_secret
           FROM the_studios AS ss
           WHERE CASE WHEN ss.source = 'brnd'
            THEN ss.studioid = ( SELECT brandid from studio_brands as sb where sb.studioid = events.studioid and sb.source = events.source )
            and ss.source = 'brnd'
            ELSE ss.studioid = events.studioid and ss.source = events.source
          END
         ) AS t
  )                                                                   AS studio,
  selected_studios.currency,
  selected_studios."mainTZ",
  selected_studios.country

  FROM events
    INNER JOIN selected_studios
      ON events.source = selected_studios.studio_source
         AND events.studioid = selected_studios.studioid
    LEFT JOIN dibs_studio_instructors
      ON dibs_studio_instructors.id = events.trainerid
    LEFT JOIN custom_events_attributes
      ON custom_events_attributes.event_name = events.name
    LEFT JOIN rooms
      ON events.room_id = rooms.id
    INNER JOIN (
                 SELECT
                    *
                 FROM
                   dibs_studio_locations dsl
                 WHERE dsl.visible IS TRUE
               ) AS dibs_studio_locations
      ON dibs_studio_locations.id = events.locationid
WHERE
  (($byDate AND (events.start_date > $startTime AND events.start_date < $endTime))
    OR ($byEventid AND (events.eventid = ANY($eventids::INT[]))))
  AND events.deleted = 0
  AND events.canceled = 0
  AND events.price_dibs IS NOT NULL
  AND (events.price_dibs > 0 OR events.free_class != FALSE )
  AND events.seats >= 0
  ORDER BY events.start_date, events.eventid;
