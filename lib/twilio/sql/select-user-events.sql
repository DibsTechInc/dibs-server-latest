SELECT
  events.eventid AS id,
  events.name AS name,
  dibs_transactions.amount AS price,
  dibs_transactions."createdAt" AS "purchaseDate",
  TIMEZONE (dibs_studios."mainTZ", events.start_date::TIMESTAMP ) as start_time,
  dibs_studios.currency,
  dibs_studios."mainTZ" AS "mainTZ",
  dibs_studios.short_name AS "studioShortName"
FROM
  dibs_transactions
INNER JOIN events
  ON dibs_transactions.eventid = events.eventid
LEFT JOIN dibs_studios
  ON dibs_studios.id = dibs_transactions.dibs_studio_id
LEFT JOIN dibs_studio_locations
  ON events.locationid = dibs_studio_locations.id
WHERE
  dibs_transactions.status = 1
  AND (
    dibs_transactions.void = false
    or dibs_transactions.void IS NULL
  )
  AND dibs_transactions.userid = $id
  AND dibs_transactions."deletedAt" IS NULL
  AND (
    dibs_transactions.early_cancel = false
    OR dibs_transactions.early_cancel IS NULL
  );
