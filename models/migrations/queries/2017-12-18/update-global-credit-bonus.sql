UPDATE dibs_transactions
SET bonus_amount = ROUND((0.08 * amount)::NUMERIC, 2)::FLOAT
WHERE source = 'dibs'
AND dibs_studio_id = 0
AND type = 'cred';
