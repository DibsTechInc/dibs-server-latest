WITH
  user_spend_by_studio AS (
    SELECT
      dibs_transactions.userid,
      dibs_transactions.dibs_studio_id,
      SUM(dibs_transactions.amount) AS spend
    FROM dibs_transactions
    WHERE (
        dibs_transactions.early_cancel IS NULL
        OR dibs_transactions.early_cancel = FALSE
      )
      AND (
        dibs_transactions.void IS NULL
        OR dibs_transactions.void = FALSE
      )
      AND dibs_transactions.status = 1
      AND dibs_transactions.dibs_studio_id > 0
      AND dibs_transactions."createdAt" > DATE_TRUNC('day', NOW()) - INTERVAL '90 days'
    GROUP BY dibs_studio_id, userid
  ),
  user_ranking_by_studio AS (
    SELECT
      t.userid,
      t.dibs_studio_id,
      ROUND(100.0::NUMERIC * (
        1 - CUME_DIST() OVER (PARTITION BY t.dibs_studio_id ORDER BY SUM(t.spend) DESC)
      )::NUMERIC, 1)::FLOAT AS "percentile"
    FROM user_spend_by_studio t
    GROUP BY t.dibs_studio_id, t.userid
  )
SELECT
  dibs_studios.name AS "studioName",
  t."percentile"
FROM user_ranking_by_studio t
  LEFT JOIN dibs_studios ON dibs_studios.id = t.dibs_studio_id
WHERE t.userid = $id
ORDER BY t."percentile" DESC;
