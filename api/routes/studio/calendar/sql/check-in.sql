SELECT
  dibs_studios.studioid,
  dibs_studios.source
FROM
  dibs_studios
WHERE dibs_studios.studioid = $STUDIO_ID
LIMIT 1;
