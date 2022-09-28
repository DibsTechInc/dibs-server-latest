WITH live_studios AS (
  SELECT DISTINCT
    name,
    source,
    studioid,
    currency,
    "paramName",
    logo,
    description,
    id,
    domain,
    widget_url,
    CASE city
      WHEN 'Brooklyn' THEN 'New York'
      WHEN 'New York City' THEN 'New York'
      ELSE city
    END AS city,
    CASE
       WHEN city ILIKE '%new york%' THEN 1
       WHEN city ILIKE '%brooklyn%' THEN 2
       WHEN city ILIKE '%london%' THEN 3
       WHEN city ILIKE '%los angeles%' THEN 4
       WHEN city ILIKE '%atlanta%' THEN 5
       WHEN city ILIKE '%dallas%' THEN 6
       WHEN city ILIKE '%plano%' THEN 7
       ELSE 8
    END AS city_order,
    color,
    COALESCE("textColor", 'FFFFFF') as "textColor",
    "onboardingDescription",
    "liveWidget"
  FROM (
    SELECT
      ds.name,
      ds.source,
      ds.studioid,
      ds.currency as currency,
      ds."paramName",
      ds.logo as logo,
      dibs_studio_locations.city as city,
      ds.description,
      ds.id,
      ds.domain as domain,
      dibs_configs.color as color,
      dibs_configs."textColor" as "textColor",
      ds."onboardingDescription",
      ds."liveWidget",
      ds.widget_url
    FROM dibs_studios as ds
      LEFT JOIN dibs_configs ON ds.id = dibs_configs.dibs_studio_id
    LEFT JOIN dibs_studio_locations ON
      dibs_studio_locations.source = ds.source
      AND dibs_studio_locations.studioid = ds.studioid
    WHERE ds.live = true
  ) as Query
  ORDER BY city_order
)
SELECT
  live_studios.*,
  ARRAY_AGG(row_to_json(dibs_studio_locations.*)) as locations,
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
    WHERE ct.dibs_studio_id = live_studios.id
  )) AS "creditTiers"
FROM live_studios
LEFT JOIN dibs_studio_locations
  ON live_studios.id = dibs_studio_locations.dibs_studio_id
GROUP BY
  live_studios.id,
  live_studios.studioid,
  live_studios.source,
  live_studios.name,
  live_studios.currency,
  live_studios.logo,
  live_studios."paramName",
  live_studios.description,
  live_studios.domain,
  live_studios.city,
  live_studios.city_order,
  live_studios.color,
  live_studios."textColor",
  live_studios."onboardingDescription",
  live_studios."liveWidget",
  live_studios.widget_url
