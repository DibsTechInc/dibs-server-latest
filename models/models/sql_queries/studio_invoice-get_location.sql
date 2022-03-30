SELECT
  ds.currency AS currency,
  ds."allowPackages",
  COALESCE(dsl.short_name, dsl.name) AS name,
  dsl.address AS address,
  dsl.city AS city,
  dsl.zipcode AS "zipCode",
  (
    SELECT COUNT(*)
    FROM dibs_studio_locations dsl2
    WHERE dsl2.dibs_studio_id = $dibsStudioId
  ) AS "numberOfLocations"
FROM dibs_studios ds
  LEFT JOIN dibs_studio_locations dsl
    ON dsl.dibs_studio_id = ds.id
    AND dsl.id = $locationid
WHERE ds.id = $dibsStudioId;
