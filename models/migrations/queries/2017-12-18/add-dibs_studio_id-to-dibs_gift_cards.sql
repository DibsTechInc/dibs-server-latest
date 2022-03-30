UPDATE dibs_gift_cards
SET dibs_studio_id = (
  SELECT promo_codes.dibs_studio_id
  FROM promo_codes
  WHERE promo_codes.id = dibs_gift_cards.promoid
);
