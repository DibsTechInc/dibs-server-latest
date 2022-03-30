CREATE MATERIALIZED VIEW all_studios AS (
  SELECT DISTINCT
    CASE WHEN dibs_studios.source = 'brnd'
      THEN studio_brands.studioid
    ELSE dibs_studios.studioid
    END AS studioid,
    dibs_studios."mainTZ",
    CASE WHEN dibs_studios.source = 'brnd'
      THEN studio_brands.source
    ELSE dibs_studios.source
    END AS source,
    dibs_studios.name
  FROM dibs_studios
    LEFT JOIN studio_brands
      ON dibs_studios.studioid = studio_brands.brandid
);
CREATE UNIQUE INDEX studiowithlocations_uniq ON all_studios (source,studioid);
CREATE INDEX studiowithlocations_maintz ON all_studios ("mainTZ");

CREATE TEMP TABLE tempAttendees AS (
  SELECT DISTINCT
    LOWER(attendees.email) as email,
    attendees.dropped,
    attendees."visitDate",
    attendees."serviceID",
    attendees."studioID",
    attendees."classID",
    attendees.source,
    dibs_users.id AS du_id,
    attendees."attendeeID",
    all_studios."mainTZ"
  FROM
    attendees
  LEFT JOIN dibs_users
    ON LOWER(dibs_users.email) = LOWER(attendees.email)
  LEFT JOIN all_studios
      ON attendees."studioID" = all_studios.studioid
      AND attendees.source = all_studios.source
  WHERE
    (attendees.dropped IS NULL OR attendees.dropped = FALSE)
    AND (
      dibs_users.id IS NULL
      OR (
        dibs_users.id > 17
        AND dibs_users.id != 159
      )
    )
    AND attendees."studioID" IN (
      SELECT
        studioid
      FROM all_studios
    )
);
CREATE INDEX tempAttendees_dropped ON tempAttendees (dropped);
CREATE INDEX tempAttendees_visitdate ON tempAttendees ("visitDate");
CREATE INDEX tempAttendees_email ON tempAttendees (email);
CREATE INDEX tempAttendees_studioid_source_classid ON tempAttendees ("studioID", source, "classID");
CREATE INDEX tempAttendees_serviceid_studioid ON tempAttendees ("serviceID", "studioID");
CREATE UNIQUE INDEX tempAttendees_serviceid_studioid_classid_visit_date_trunc_x ON tempAttendees ("studioID", "serviceID", source, email, "classID", "visitDate", "attendeeID", du_id, dropped);
CLUSTER tempAttendees USING tempAttendees_studioid_source_classid;

CREATE TEMP TABLE tempRevRef AS (
  SELECT DISTINCT
  revenue_reference."DibsCategory2",
  revenue_reference."serviceID",
  revenue_reference."studioID",
  revenue_reference."avgRevenue"
  FROM
    revenue_reference
);
CREATE INDEX tempRevRef_studioid_serviceid ON tempRevRef ("studioID", "serviceID");
CREATE INDEX tempRevRef_dibscategory2 ON tempRevRef ("DibsCategory2");
CREATE UNIQUE INDEX tempRevRef_dibscategory22 ON tempRevRef ("studioID", "serviceID", "DibsCategory2");


CREATE TEMP TABLE tempEvents AS (
  SELECT DISTINCT
  COALESCE(events.mbstudioid, events.zfstudio_id) AS studioid,
  COALESCE(events.mbclassid, events.zfclass_id) AS classid,
  COALESCE(events.mblocationid, events.zfsite_id) AS locationid,
  events.source,
  events.eventid,
  events.start_date,
  events.seats
  FROM
    events
);
CREATE INDEX tempEvents_studioid_source_classid ON tempEvents (studioid, source, classid);
CREATE INDEX tempEvents_locationid_studioid ON tempEvents (locationid, studioid);
CREATE INDEX tempEvents_eventid ON tempEvents (eventid);
CREATE INDEX tempEvents_startdate ON tempEvents (start_date);
CREATE UNIQUE INDEX tempEvents_studioid_source_classid_locationid_startdate ON tempEvents (studioid, source, classid, locationid, start_date);

CREATE TEMP TABLE tempTransactions AS (
  SELECT DISTINCT
    dibs_transactions.eventid,
    dibs_transactions.userid,
    dibs_transactions.early_cancel,
    dibs_transactions.status,
    COALESCE(dibs_transactions.credits_spent, 0) as credits_spent,
    dibs_transactions.amount,
    COALESCE(dibs_transactions.tax_amount, 0) as tax_amount
  FROM
    dibs_transactions
  WHERE
    dibs_transactions.status = 1
    AND
    (dibs_transactions.early_cancel IS NULL OR dibs_transactions.early_cancel = FALSE)
    AND  dibs_transactions.userid > 17
    AND dibs_transactions.userid != 159
);
CREATE INDEX tempTransactions_status ON tempTransactions (status);
CREATE INDEX tempTransactions_earlycancel ON tempTransactions (early_cancel);
CREATE INDEX tempTransactions_userid_eventid ON tempTransactions (userid, eventid);
CREATE UNIQUE INDEX tempTransactions_userid_eventid_status ON tempTransactions (userid, eventid, status, early_cancel, amount, credits_spent, tax_amount);


CREATE TEMP TABLE tempRes AS (
   SELECT DISTINCT
    DATE_TRUNC('minute', a."visitDate")::TIMESTAMP AS visit_date_trunc,
    a.email,
    a."attendeeID",
    rr."DibsCategory2" AS category,
    a."studioID",
    a.source,
    a."classID",
    e.seats,
    COALESCE(e.locationid, 0) as locationid,
    e.eventid,
    a."serviceID",
    a."mainTZ",
    CASE
      WHEN rr."DibsCategory2" != 'D'
        THEN rr."avgRevenue"
      ELSE dt.amount - dt.tax_amount
    END AS cost,
    GREATEST(CASE
      WHEN rr."DibsCategory2" = 'D'
        THEN dt.amount - dt.tax_amount
      WHEN rr."avgRevenue" IS NOT NULL
        THEN rr."avgRevenue"
      WHEN rr."avgRevenue" IS NOT NULL
        THEN rr."avgRevenue"
      ELSE 0
    END, 0::FLOAT) AS revenue
  FROM
   tempAttendees AS a
   INNER JOIN tempRevRef AS rr
     ON rr."serviceID" = a."serviceID"
        AND rr."studioID" = a."studioID"
   INNER JOIN tempEvents AS e
     ON a."studioID" = e.studioid
        AND a."classID" = e.classid
        AND a.source = e.source
   LEFT JOIN tempTransactions AS dt
     ON dt.eventid = e.eventid
        AND a.du_id = dt.userid
 ORDER BY visit_date_trunc
);
CREATE INDEX tempResQuery_visit ON tempRes (visit_date_trunc);
CREATE INDEX tempResQuery_email ON tempRes (email);
CREATE INDEX tempResQuery_cat ON tempRes (category);
CREATE INDEX tempResQuery_studioid_source_classid ON tempRes ("studioID", source, "classID", visit_date_trunc);
CREATE INDEX tempResQuery_cost ON tempRes (cost);
CREATE INDEX tempResQuery_revenue ON tempRes (revenue);
CREATE INDEX tempResQuery_eventid ON tempRes (eventid);
CREATE INDEX tempResQuery_serviceID ON tempRes ("serviceID");
CREATE INDEX tempResQuery_email_studio_location_source_date_trunc ON tempRes (email, "studioID", locationid, source, DATE_TRUNC('month', visit_date_trunc));
CREATE INDEX tempResQuery_email_studio_location_source_date ON tempRes (email, "studioID", locationid, source, visit_date_trunc);
CREATE INDEX tempResQuery_email_category ON tempRes (email, category);

CLUSTER tempRes USING tempResQuery_studioid_source_classid;

CREATE TEMP TABLE tmpData_attendees AS (
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
        tempRes AS aq
      WHERE
        tempRes.email = aq.email
        AND aq.category = 'D'
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
      tempRes AS aq
    WHERE
      aq.email = tempRes.email
      AND aq."studioID" = tempRes."studioID"
      AND aq.source = tempRes.source
      AND DATE_TRUNC('month', aq.visit_date_trunc) < DATE_TRUNC('month', tempRes.visit_date_trunc)
      LIMIT 1
  ) THEN 'New'
  WHEN EXISTS(
    SELECT
      email
    FROM
      tempRes AS aq
    WHERE
      aq.email = tempRes.email
      AND aq."studioID" = tempRes."studioID"
      AND aq.source = tempRes.source
      AND DATE_TRUNC('month', aq.visit_date_trunc) >= DATE_TRUNC('month', tempRes.visit_date_trunc) - INTERVAL '1 month'
      AND DATE_TRUNC('month', aq.visit_date_trunc) <  DATE_TRUNC('month', timezone(tempRes."mainTZ", timezone('utc', NOW()::TIMESTAMP)))
      AND aq.visit_date_trunc != tempRes.visit_date_trunc
    LIMIT 1
  ) THEN 'Returning'
  WHEN EXISTS(
    SELECT
      email
    FROM
      tempRes AS aq
    WHERE
      aq.email = tempRes.email
      AND aq."studioID" = tempRes."studioID"
      AND DATE_TRUNC('month', aq.visit_date_trunc) <
          DATE_TRUNC('month', tempRes.visit_date_trunc) - INTERVAL '1 month'
      AND aq.visit_date_trunc != tempRes.visit_date_trunc
      LIMIT 1
  ) THEN 'Re-Engaged'
  END AS customer_status
FROM
  tempRes
ORDER BY visit_date_trunc ASC
);
CREATE INDEX tmpdata_attendees_visit ON tmpData_attendees (visit_date_trunc);
CREATE INDEX tmpdata_attendees_email ON tmpData_attendees (email);
CREATE INDEX tmpdata_attendees_category ON tmpData_attendees (category);
CREATE INDEX tmpdata_attendees_attendee_id ON tmpData_attendees ("attendeeID");
CREATE INDEX tmpdata_attendees_studioID_source_classid_visit_date_trunc ON tmpData_attendees ("studioID", source, "classID", visit_date_trunc);
CREATE INDEX tmpdata_attendees_cost ON tmpData_attendees (cost);
CREATE INDEX tmpdata_attendees_revenue ON tmpData_attendees (revenue);
CREATE INDEX tmpdata_attendees_eventid ON tmpData_attendees (eventid);
CREATE INDEX tmpdata_attendees_customer_status ON tmpData_attendees (customer_status);
CREATE INDEX tmpdata_attendees_customer_user_type ON tmpData_attendees (user_type);
CREATE INDEX tmpDataCluster ON tmpData_attendees (source, "studioID", email, "serviceID", visit_date_trunc);
CLUSTER tmpData_attendees USING tmpDataCluster;

CREATE TABLE data_attendees AS (
  WITH attendees_with_service_visit_counts AS (
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
            tmpData_attendees a2
          WHERE
            a2.email = a.email
            AND a."serviceID" = a2."serviceID"
            AND a2."studioID" = a."studioID"
            AND a2.source = a.source
            AND a2.visit_date_trunc >= DATE_TRUNC('month', a.visit_date_trunc)
            AND a2.visit_date_trunc < DATE_TRUNC('month', a.visit_date_trunc) + INTERVAL '1 month'
            AND a2.visit_date_trunc <= timezone(a."mainTZ", timezone('utc', NOW() :: TIMESTAMP))
            AND a2.revenue > 50
          GROUP BY a2.email
        ), 1) AS visits_in_month_per_service
    FROM tmpData_attendees AS a
  )
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
);
CREATE UNIQUE INDEX data_attendees_studioID_source_classid_visit_date_trunc ON data_attendees ("studioID", source, email, "classID", locationid, visit_date_trunc, "attendeeID", cost, revenue);
CREATE INDEX data_attendees_studioID_source_classid_location ON data_attendees ("studioID", source, locationid, "classID");
CREATE INDEX data_attendees_email_viist ON data_attendees (email, visit_date_trunc);

DROP TABLE tempAttendees;
DROP TABLE tempRevRef;
DROP TABLE tempEvents;
DROP TABLE tmpData_attendees;
