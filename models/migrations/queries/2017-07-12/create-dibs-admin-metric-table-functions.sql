DROP FUNCTION IF EXISTS calculate_average_user_spend(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);
DROP FUNCTION IF EXISTS calculate_total_revenue(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);
DROP FUNCTION IF EXISTS calculate_total_transactions(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);
DROP FUNCTION IF EXISTS calculate_unique_users(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
);

CREATE OR REPLACE FUNCTION calculate_average_user_spend(
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE
) RETURNS TABLE (average FLOAT)
AS $func$
BEGIN
  RETURN QUERY SELECT COALESCE(
    CASE
      WHEN COUNT(t.total) > 0 THEN AVG(t.total::FLOAT)
      ELSE 0.
    END
  ) AS average
  FROM (
    SELECT
      CASE
        WHEN ds.currency = 'GBP'
          THEN SUM(
            (SELECT er.rate FROM exchange_rates er WHERE er.from = 'GBP' AND er.to = 'USD')::NUMERIC
            * (dt.amount - COALESCE(dt.studio_credits_spent, 0.) - COALESCE(dt.global_credits_spent, 0.))::NUMERIC
          )
        ELSE SUM(dt.amount - COALESCE(dt.studio_credits_spent, 0.) - COALESCE(dt.global_credits_spent, 0.))
      END AS total
    FROM dibs_transactions dt
      LEFT JOIN dibs_studios ds
        ON (
          (ds.source, ds.studioid) = (dt.source, dt.studioid)
          OR (
            ds.source = 'brnd'
            AND ds.studioid = (
              SELECT sb.brandid
              FROM studio_brands sb
              WHERE sb.source = dt.source
                AND sb.studioid = dt.studioid
            )
          )
        )
    WHERE dt.status = 1
      AND dt.userid != 159
      AND dt.userid >= 17
      AND dt."createdAt" AT TIME ZONE 'EDT' > start_date
      AND dt."createdAt" AT TIME ZONE 'EDT' < end_date
    GROUP BY dt.userid, dt.source, dt.studioid, ds.currency
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
          WHEN ds.currency = 'GBP'
            THEN (
              (SELECT er.rate FROM exchange_rates er WHERE er.from = 'GBP' AND er.to = 'USD')::NUMERIC
              * (dt.amount - COALESCE(dt.studio_credits_spent, 0.) - COALESCE(dt.global_credits_spent, 0.))::NUMERIC
            )::FLOAT
          ELSE dt.amount - COALESCE(dt.studio_credits_spent, 0.) - COALESCE(dt.global_credits_spent, 0.)
        END AS amount
      FROM dibs_transactions dt
        LEFT JOIN dibs_studios ds
          ON (
            (ds.source, ds.studioid) = (dt.source, dt.studioid)
            OR (
              ds.source = 'brnd'
              AND ds.studioid = (
                SELECT sb.brandid
                FROM studio_brands sb
                WHERE sb.source = dt.source
                  AND sb.studioid = dt.studioid
              )
            )
          )
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
