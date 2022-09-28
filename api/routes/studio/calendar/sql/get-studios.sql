with studios as (
    SELECT DISTINCT
      dibs_studios.id,
      CASE WHEN dibs_studios.source = 'brnd'
        THEN studio_brands.studioid
      ELSE dibs_studios.studioid
      END AS studioid,
      dibs_studios."mainTZ",
      CASE WHEN dibs_studios.source = 'brnd'
        THEN studio_brands.source
      ELSE dibs_studios.source
      END AS source,
      dibs_studios.name,
      dibs_studios.cancel_time as cancel_time,
      dibs_studios.currency as currency,
      dibs_studios.logo as logo,
      dibs_studios."onboardingDescription",
      dibs_studios."paramName"
    FROM
      dibs_studios
    LEFT JOIN studio_brands
      ON dibs_studios.studioid = studio_brands.brandid
    WHERE dibs_studios.live = true
      AND dibs_studios."liveAdmin" = true
), expanded_studio AS (
  SELECT
    studios.*,
    array_agg(row_to_json(dsl.*)) as locations
  FROM studios
  LEFT JOIN (
    SELECT
      dibs_studio_locations.source,
      dibs_studio_locations.studioid,
      dibs_studio_locations.id,
      dibs_studio_locations.dibs_studio_id,
      dibs_studio_locations.visible,
      COALESCE(dibs_studio_locations."cityOverride", dibs_studio_locations.city) as city,
      COALESCE(dibs_studio_locations.short_name, dibs_studio_locations.name) as name
    FROM
      dibs_studio_locations
    ) AS dsl
    ON studios.id = dsl.dibs_studio_id
  GROUP BY studios.id,
           studios.studioid,
           studios."mainTZ",
           studios.source,
           studios.name,
           studios.cancel_time,
           studios.currency,
           studios.logo,
           studios."onboardingDescription",
           studios."paramName"
)
SELECT
  expanded_studio.*,
  ARRAY_TO_JSON((
    SELECT ARRAY_AGG(ROW_TO_JSON((
      ct.*
    )))
    FROM (
      SELECT
        credit_tiers.*,
        ROUND((credit_tiers."payAmount"::NUMERIC + credit_tiers."loadBonus"::NUMERIC), 2)::FLOAT AS "receiveAmount"
      FROM credit_tiers
    ) ct
    WHERE ct.dibs_studio_id = dibs_studios.id
  )) AS "creditTiers",
  ROW_TO_JSON(dibs_configs.*) AS dibs_config,
  dibs_studios."paramName"
FROM expanded_studio
INNER JOIN dibs_studios
  on expanded_studio.id = dibs_studios.id
LEFT JOIN dibs_configs
  ON dibs_configs.dibs_studio_id = dibs_studios.id;
