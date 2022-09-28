WITH
  valid_user_flash_credits AS (
    SELECT flash_credits.*
    FROM flash_credits
    WHERE flash_credits.userid = $id
      AND flash_credits."deletedAt" IS NULL
      AND flash_credits.expiration > NOW()
  )
SELECT
  t.credit AS "credit",
  t.expiration AS "expiration",
  dibs_studios.short_name AS "studioShortName",
  dibs_studios.currency AS "currency"
FROM valid_user_flash_credits t
  LEFT JOIN dibs_studios ON dibs_studios.id = t.dibs_studio_id;
