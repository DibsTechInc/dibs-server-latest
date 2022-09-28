SELECT
  dibs_studios.*,
  (
    SELECT
      row_to_json(promo_codes.*)
    FROM promo_codes
    WHERE promo_codes.id = dibs_studios.intro_promo_code_id
    LIMIT 1
  ) as intro_promo_code
FROM dibs_studios
WHERE
  dibs_studios.id = $studioid
LIMIT 1
