UPDATE dibs_transactions SET bonus_amount = ROUND((
  SELECT (t ->> 'receiveAmount')::FLOAT - (t ->> 'payAmount')::FLOAT
  FROM dibs_studios, json_array_elements(dibs_studios."defaultCreditTiers"::JSON) t
  WHERE dibs_studios.id = dibs_transactions.dibs_studio_id
  AND (t ->> 'payAmount')::FLOAT = dibs_transactions.amount
)::NUMERIC, 2)::FLOAT
WHERE type IN ('cred', 'gift')
AND dibs_studio_id > 0;
