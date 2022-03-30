/* For Dibs Admin metric tables */

CREATE OR REPLACE FUNCTION calculate_average_user_spend(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
) RETURNS TABLE (average FLOAT)
AS $func$
BEGIN
  RETURN QUERY SELECT COALESCE(AVG(t.total::FLOAT), 0.) AS average
  FROM (
    SELECT
      CASE
        WHEN (
          dt.source = 'mb'
          AND (
            SELECT mbs.currency
            FROM mb_studios mbs
            WHERE mbs.mbstudioid = dt.studioid
          ) = 'GBP'
        ) OR (
          dt.source = 'zf'
          AND (
            SELECT zfs.currency
            FROM zf_studios zfs
            WHERE zfs.zfstudio_id = dt.studioid
          ) = 'GBP'
        ) THEN SUM((SELECT er.rate FROM exchange_rates er WHERE er.from = 'GBP' AND er.to = 'USD')::NUMERIC * (dt.amount - dt.credits_spent)::NUMERIC)
        ELSE SUM(dt.amount - dt.credits_spent)
      END AS total
    FROM dibs_transactions dt
    WHERE dt.status = 1
      AND dt.userid != 159
      AND dt.userid >= 17
      AND dt."createdAt" AT TIME ZONE 'EDT' > start_date
      AND dt."createdAt" AT TIME ZONE 'EDT' < end_date
    GROUP BY dt.userid, dt.source, dt.studioid
  ) t;
END
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_total_revenue(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
) RETURNS TABLE(total FLOAT)
AS $func$
BEGIN
  RETURN QUERY SELECT COALESCE(SUM(t.amount::FLOAT), 0.) FROM (
      SELECT
        CASE
          WHEN (
            dt.source = 'mb'
            AND (
              SELECT mbs.currency
              FROM mb_studios mbs
              WHERE mbs.mbstudioid = dt.studioid
            ) = 'GBP'
          ) OR (
            dt.source = 'zf'
            AND (
              SELECT zfs.currency
              FROM zf_studios zfs
              WHERE zfs.zfstudio_id = dt.studioid
            ) = 'GBP'
          ) THEN (SELECT er.rate FROM exchange_rates er WHERE er.from = 'GBP' AND er.to = 'USD')::NUMERIC * (dt.amount - dt.credits_spent)::NUMERIC
          ELSE dt.amount - dt.credits_spent
        END AS amount
      FROM dibs_transactions dt
      WHERE dt.status = 1
        AND dt.userid != 159
        AND dt.userid >= 17
        AND dt."createdAt" AT TIME ZONE 'EDT' > start_date
        AND dt."createdAt" AT TIME ZONE 'EDT' < end_date
    ) t;
END
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_total_transactions(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
) RETURNS TABLE (total FLOAT)
AS $func$
BEGIN
  RETURN QUERY SELECT COALESCE(COUNT(*), 0.)::FLOAT AS total
    FROM dibs_transactions dt
    WHERE dt.status = 1
      AND dt.userid != 159
      AND dt.userid >= 17
      AND dt."createdAt" AT TIME ZONE 'EDT' > start_date
      AND dt."createdAt" AT TIME ZONE 'EDT' < end_date;
END
$func$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_unique_users(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
) RETURNS TABLE (total FLOAT)
AS $func$
BEGIN
  RETURN QUERY SELECT COALESCE(COUNT(*), 0.)::FLOAT AS total FROM (
      SELECT DISTINCT dt.userid
      FROM dibs_transactions dt
      WHERE dt.status = 1
        AND dt.userid != 159
        AND dt.userid >= 17
        AND dt."createdAt" AT TIME ZONE 'EDT' > start_date
        AND dt."createdAt" AT TIME ZONE 'EDT' < end_date
  ) t;
END
$func$
LANGUAGE plpgsql;
