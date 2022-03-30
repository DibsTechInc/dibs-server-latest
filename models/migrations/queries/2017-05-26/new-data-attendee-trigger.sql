DROP TRIGGER IF EXISTS new_data_attendee ON attendees;

CREATE OR REPLACE FUNCTION create_new_data_attendee() RETURNS trigger AS
$BODY$
BEGIN
WITH super_attendee AS (
  SELECT DISTINCT
      LOWER(a.email) as email,
      a.dropped,
      a."visitDate",
      a."serviceID",
      a."studioID",
      a."classID",
      a.source,
      du.id AS du_id,
      a."attendeeID",
      all_studios."mainTZ",
      e.classid AS classid,
      e.locationid AS locationid,
      e.eventid,
      e.start_date,
      e.seats,
      dt.userid,
      dt.early_cancel,
      dt.status,
      COALESCE(dt.credits_spent, 0) as credits_spent,
      dt.amount,
      COALESCE(dt.tax_amount, 0) as tax_amount,
      rr."DibsCategory2",
      rr."avgRevenue"
    FROM
      attendees a
    LEFT JOIN dibs_users du
      ON LOWER(du.email) = LOWER(a.email)
    LEFT JOIN all_studios
        ON a."studioID" = all_studios.studioid
        AND a.source = all_studios.source
    INNER JOIN revenue_reference AS rr
     ON rr."serviceID" = a."serviceID"
        AND rr."studioID" = a."studioID"
   INNER JOIN events AS e
     ON a."studioID" = e.studioid
        AND a."classID" = e.classid
        AND a.source = e.source
   LEFT JOIN dibs_transactions AS dt
     ON dt.eventid = e.eventid
        AND du.id = dt.userid
    WHERE
      (a.dropped IS NULL OR a.dropped = FALSE)
      AND (
        du.id IS NULL
        OR (
          du.id > 17
          AND du.id != 159
        )
      )
      AND a."studioID" IN (
        SELECT
          studioid
        FROM all_studios
      )
      AND a."attendeeID" = NEW."attendeeID"
      AND a."studioID" = NEW."studioID"
      AND a.source = NEW.source
), tempRes AS (
  SELECT DISTINCT
    DATE_TRUNC('minute', a."visitDate")::TIMESTAMP AS visit_date_trunc,
    a.email,
    a."attendeeID",
    a."DibsCategory2" AS category,
    a."studioID",
    a.source,
    a."classID",
    a.seats,
    COALESCE(a.locationid, 0) as locationid,
    a.eventid,
    a."serviceID",
    a."mainTZ",
    CASE
      WHEN a."DibsCategory2" != 'D'
        THEN a."avgRevenue"
      ELSE a.amount - a.tax_amount
    END AS cost,
    GREATEST(CASE
      WHEN a."DibsCategory2" = 'D'
        THEN a.amount  - a.tax_amount
      WHEN a."avgRevenue" IS NOT NULL
        THEN a."avgRevenue"
      ELSE 0
    END, 0::FLOAT) AS revenue
  FROM
   super_attendee as a
 ORDER BY visit_date_trunc
), tmpData_attendee AS (
  SELECT
    *,
    (
      SELECT count(*)
      FROM
        tempRes AS aq
      WHERE
        aq."studioID" = tempRes."studioID"
        AND aq."classID" = tempRes."classID"
        AND aq.source = tempRes.source
        AND aq.visit_date_trunc = tempRes.visit_date_trunc
    )   AS seats_sold,
    CASE WHEN EXISTS
    (
        SELECT category
        FROM
          attendees AS aq
        LEFT JOIN
          revenue_reference AS rr
          ON aq."studioID" = rr."studioID"
          AND aq."serviceID" = rr."serviceID"
        WHERE
          tempRes.email = aq.email
          AND rr."DibsCategory2" = 'D'
          AND aq."studioID" = tempRes."studioID"
          AND aq.source = tempRes.source
        LIMIT 1
    ) THEN 'Dibs User'
    WHEN EXISTS(
        SELECT category
        FROM
          tempRes AS aq
        WHERE
          tempRes.email = aq.email
          AND aq.category = 'A1'
          AND aq."studioID" = tempRes."studioID"
          AND aq.source = tempRes.source
        LIMIT 1
    ) THEN 'Member'
    ELSE 'Non Dibs User'
    END AS user_type,
    CASE WHEN NOT EXISTS(
      SELECT
        email
      FROM
        attendees AS aq
      WHERE
        aq.email = tempRes.email
        AND aq."studioID" = tempRes."studioID"
        AND aq.source = tempRes.source
        AND DATE_TRUNC('month', aq."visitDate") < DATE_TRUNC('month', tempRes.visit_date_trunc)
        LIMIT 1
    ) THEN 'New'
    WHEN EXISTS(
      SELECT
        email
      FROM
        attendees AS aq
      WHERE
        aq.email = tempRes.email
        AND aq."studioID" = tempRes."studioID"
        AND aq.source = tempRes.source
        AND DATE_TRUNC('month', aq."visitDate") >= DATE_TRUNC('month', tempRes.visit_date_trunc) - INTERVAL '1 month'
        AND DATE_TRUNC('month', aq."visitDate") <  DATE_TRUNC('month', timezone(tempRes."mainTZ", timezone('utc', NOW()::TIMESTAMP)))
        AND aq."visitDate" != tempRes.visit_date_trunc
      LIMIT 1
    ) THEN 'Returning'
    WHEN EXISTS(
      SELECT
        email
      FROM
        attendees AS aq
      WHERE
        aq.email = tempRes.email
        AND aq."studioID" = tempRes."studioID"
        AND DATE_TRUNC('month', aq."visitDate") <
            DATE_TRUNC('month', tempRes.visit_date_trunc) - INTERVAL '1 month'
        AND aq."visitDate" != tempRes.visit_date_trunc
        LIMIT 1
    ) THEN 'Re-Engaged'
    END AS customer_status
  FROM
    tempRes
  ORDER BY visit_date_trunc ASC
), attendees_with_service_visit_counts AS (
    SELECT
        a.visit_date_trunc,
        a.email,
        a."attendeeID",
        a.category,
        a."studioID",
        a.source,
        a."classID",
        a.locationid,
        a.eventid,
        a.seats,
        a.seats_sold,
        a."mainTZ",
        a."serviceID",
        a.cost,
        a.revenue,
        a.user_type,
        a.customer_status,
        COALESCE((
          SELECT GREATEST(COUNT(a2.email), 1)
          FROM
            attendees a2
          INNER JOIN
            revenue_reference rr
            ON rr."studioID" = a2."studioID"
            AND rr."serviceID" = a2."serviceID"
          WHERE
            a2.email = a.email
            AND a."serviceID" = a2."serviceID"
            AND a2."studioID" = a."studioID"
            AND a2.source = a.source
            AND a2."visitDate" >= DATE_TRUNC('month', a.visit_date_trunc)
            AND a2."visitDate" < DATE_TRUNC('month', a.visit_date_trunc) + INTERVAL '1 month'
            AND a2.revenue > 50
          GROUP BY a2.email
        ), 1) AS visits_in_month_per_service
    FROM tmpData_attendee AS a
), new_data_attendee AS (
  SELECT
    a2.visit_date_trunc,
    a2.email,
    a2."attendeeID",
    a2.category,
    a2."studioID",
    a2.source,
    a2."classID",
    a2.locationid,
    a2.eventid,
    a2.seats,
    a2.seats_sold,
    a2."mainTZ",
    a2."serviceID",
    a2.cost,
    a2.revenue,
    a2.user_type,
    a2.customer_status,
    a2.visits_in_month_per_service,
    COALESCE(a2.revenue / a2.visits_in_month_per_service, 0) AS revenue_per_visit
  FROM attendees_with_service_visit_counts AS a2
), ins AS (
  INSERT INTO data_attendees
  SELECT
    *
  FROM new_data_attendee
)
UPDATE data_attendees da
SET
  revenue_per_visit = a.revenue_per_visit,
  visits_in_month_per_service = a.visits_in_month_per_service
FROM new_data_attendee a
WHERE
  da.email = a.email
  AND a."serviceID" = da."serviceID"
  AND a."studioID" = da."studioID"
  AND a.source = da.source
  AND da.visit_date_trunc >= DATE_TRUNC('month', a.visit_date_trunc)
  AND da.visit_date_trunc < DATE_TRUNC('month', a.visit_date_trunc) + INTERVAL '1 month'
  AND da.revenue > 50;
RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;

CREATE TRIGGER new_data_attendee
  AFTER INSERT
  ON attendees
  FOR EACH ROW
    EXECUTE PROCEDURE create_new_data_attendee();
