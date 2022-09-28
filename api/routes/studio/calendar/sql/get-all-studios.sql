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
      dibs_studios."paramName",
      dibs_studios.country,
      dibs_studios."requiresWaiverSigned",
      dibs_studios."canRemotelyLogin",
      dibs_studios.primary_locationid
    FROM
      dibs_studios
    LEFT JOIN studio_brands
      ON dibs_studios.studioid = studio_brands.brandid
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
      dibs_studio_locations.tax_rate,
      COALESCE(dibs_studio_locations."cityOverride", dibs_studio_locations.city) as city,
      COALESCE(dibs_studio_locations.short_name, dibs_studio_locations.name) as name,
      dibs_studio_locations.visible
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
           studios."paramName",
           studios.country,
           studios."requiresWaiverSigned",
           studios."canRemotelyLogin",
           studios.primary_locationid
)
SELECT
  expanded_studio.*,
  dibs_studios."defaultCreditTiers",
  ROW_TO_JSON(dibs_configs.*) AS dibs_config,
  dibs_studios."paramName",
  (SELECT
    row_to_json(t.*)
    FROM
    ( SELECT
        min_price,
        max_price
      FROM
        studio_pricings
      WHERE
        studio_pricings.dibs_studio_id = dibs_studios.id
    ) as t
  ) as price_range,
  dibs_studios."allowPackages",
  (
    SELECT ARRAY(
             SELECT
      row_to_json(t.*)
    FROM (
      SELECT
        *,
        (SELECT discount_price
         FROM studio_package_discounts spd
         WHERE spd.studio_package_id = studio_packages.id
          AND promotion_start <= now()
          AND promotion_end >= now()
          ORDER BY spd."createdAt"
          LIMIT 1
        ) as discount_price,
        (SELECT discount_price_autopay
         FROM studio_package_discounts spd
         WHERE spd.studio_package_id = studio_packages.id
          AND promotion_start <= now()
          AND promotion_end >= now()
          ORDER BY spd."createdAt"
          LIMIT 1
        ) as discount_price_autopay,
        (SELECT promotion_name
         FROM studio_package_discounts spd
         WHERE spd.studio_package_id = studio_packages.id
          AND promotion_start <= now()
          AND promotion_end >= now()
          ORDER BY spd."createdAt"
          LIMIT 1
        ) as promotion_name
      FROM studio_packages
      WHERE studio_packages.dibs_studio_id = dibs_studios.id
        AND studio_packages.available
        AND NOT studio_packages.front_desk_only
      ORDER by studio_packages."sortIndex" ASC
    ) as t
  )) as studio_packages
FROM expanded_studio
INNER JOIN dibs_studios
  ON expanded_studio.id = dibs_studios.id
LEFT JOIN dibs_configs
  ON dibs_studios.id = dibs_configs.dibs_studio_id;
