UPDATE dibs_users
SET signup_dibs_studio_id = (
  SELECT dibs_studios.id
  FROM dibs_studios
  WHERE dibs_studios.source = dibs_users."signupStudioSource"
    AND dibs_studios.studioid = dibs_users."signupStudioId"
);
