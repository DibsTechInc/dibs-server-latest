CREATE OR REPLACE FUNCTION get_transaction_breakdown (
  transid INTEGER
)
RETURNS TABLE (
  amount_after_credits FLOAT,
  stripe_fees FLOAT,
  dibs_fee FLOAT,
  studio_payment FLOAT
)
AS $func$
BEGIN
  RETURN QUERY
  WITH dibs_transaction_studio AS (
    SELECT
      dt.id,
      CASE
         WHEN EXISTS(
            SELECT sb.brandid
            FROM studio_brands sb
            WHERE sb.source = dt.source AND sb.studioid = dt.studioid
        )
          THEN (
            SELECT ds.fee_rate
            FROM dibs_studios ds
            WHERE ds.studioid = (
              SELECT sb.brandid
              FROM studio_brands sb
              WHERE sb.source = dt.source AND sb.studioid = dt.studioid
            )
          )
        ELSE (
          SELECT ds.fee_rate
          FROM dibs_studios ds
          WHERE ds.source = dt.source AND ds.studioid = dt.studioid
        )
      END AS fee_rate
      FROM dibs_transactions dt
      WHERE dt.id = transid
   ),
   transaction_after_credits AS (
     SELECT
       t.id,
       CASE
         WHEN t.amount_after_credits < 0.5
           THEN 0.
         ELSE t.amount_after_credits
       END AS amount_after_credits
      FROM (
        SELECT
          dt.id,
          (
            dt.amount::NUMERIC
            - COALESCE(dt.credits_spent, 0.)::NUMERIC
          )::FLOAT AS amount_after_credits
        FROM dibs_transactions dt
        WHERE dt.id = transid
      ) t
      WHERE t.id = transid
    ),
    transaction_stripe_fee AS (
      SELECT
        dt.id,
        ROUND((
          (0.029::NUMERIC * t1.amount_after_credits::NUMERIC)
          + CASE
              WHEN t1.amount_after_credits > 0
                THEN (0.3::NUMERIC / GREATEST(COALESCE((SELECT COUNT(*) FROM dibs_transactions dt2 WHERE dt2.stripe_charge_id = dt.stripe_charge_id), 1), 1)::NUMERIC)
              ELSE 0::NUMERIC
            END
        ), 2)::FLOAT AS stripe_fees
      FROM dibs_transactions dt
        LEFT JOIN transaction_after_credits t1 ON dt.id = t1.id
      WHERE dt.id = transid
    ),
    transaction_dibs_fee AS (
      SELECT
        dt.id,
        CASE
          WHEN dt.eventid IS NULL THEN 0
          ELSE
          GREATEST(ROUND((
            dts.fee_rate::NUMERIC * (
              t1.amount_after_credits::NUMERIC
              - t2.stripe_fees::NUMERIC
              - (
                CASE
                  WHEN dt.amount - dt.credits_spent > dt.tax_amount
                    THEN COALESCE(dt.tax_amount, 0.)
                  ELSE 0.
                END
              )::NUMERIC
            )
          ), 2)::FLOAT, 0.)
        END AS dibs_fee
      FROM dibs_transactions dt
        LEFT JOIN transaction_after_credits t1 ON t1.id = dt.id
        LEFT JOIN transaction_stripe_fee t2 ON t2.id = dt.id
        LEFT JOIN dibs_transaction_studio dts ON dts.id = dt.id
      WHERE dt.id = transid
    )
  SELECT
    t1.amount_after_credits,
    t2.stripe_fees,
    t3.dibs_fee,
    GREATEST((
      t1.amount_after_credits::NUMERIC
      - t2.stripe_fees::NUMERIC
      - t3.dibs_fee::NUMERIC
      - (
        CASE
          WHEN dt.amount - dt.credits_spent > dt.tax_amount
            THEN COALESCE(dt.tax_amount, 0.)
          ELSE 0.
        END
      )::NUMERIC
    )::FLOAT, 0.) AS studio_payment
  FROM dibs_transactions dt
    LEFT JOIN transaction_after_credits t1 ON t1.id = dt.id
    LEFT JOIN transaction_stripe_fee t2 ON t2.id = dt.id
    LEFT JOIN transaction_dibs_fee t3 ON t3.id = dt.id
  WHERE dt.id = transid;
END
$func$
LANGUAGE plpgsql;
