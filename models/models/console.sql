select distinct "studioID" from attendees where dibs_studio_id is null

delete from attendees where dibs_studio_id = 2 or "studioID" = 2;
update attendees set dibs_studio_id = studio.id from dibs_studios studio where studio.studioid = attendees."studioID" and dibs_studio_id is null;

explain SELECT "id", "name", "dibs_studio_id", "source_roomid", "source_image_url", "location_id", "createdAt", "updatedAt", "deletedAt" FROM "rooms" AS "room" WHERE (("room"."deletedAt" > '2018-06-27 17:45:34.411 +00:00' OR "room"."deletedAt" IS NULL) AND "room"."id" = 19);
explain SELECT "id", "x", "y", "name", "type", "source_id", "bookable", "room_id", "spot_label", "createdAt", "updatedAt" FROM "spots" AS "spot" WHERE "spot"."room_id" = 19 ORDER BY "spot"."id" ASC;

UPDATE dibs_users SET "waiverSigned" = dibs_user_studios.signed_waiver FROM dibs_user_studios WHERE dibs_user_studios."updatedAt" = (select min(dibs_user_studios."updatedAt") from dibs_user_studios where userid = dibs_users.id) AND userid = dibs_users.id

update attendees set userid = dus.userid from dibs_user_studios dus where dus.clientid = attendees."clientID" and dus.dibs_studio_id = attendees.dibs_studio_id and attendees.userid is null;
INSERT INTO public.attendees ("attendeeID", "studioID", "classID", "clientID", email, "serviceID", "serviceName", "createdAt", "updatedAt", revenue, "visitDate", firstname, lastname, checkedin, dropped, cost, source, dibs_studio_id, source_serviceid, userid, eventid, spot_id) VALUES ('672032936584808292', 55116, '649238135397418166', '601397136717776436', 'carly.soteras@gmail.com', null, null, '2018-07-16 02:12:25.187000', '2018-07-16 09:43:03.004000', null, null, 'Carly', 'Soteras', false, false, null, 'zf', 100, null, 245534, 108586916, 115);
INSERT INTO public.attendees ("attendeeID", "studioID", "classID", "clientID", email, "serviceID", "serviceName", "createdAt", "updatedAt", revenue, "visitDate", firstname, lastname, checkedin, dropped, cost, source, dibs_studio_id, source_serviceid, userid, eventid, spot_id) VALUES ('671985686835889675', 55116, '649238135397418166', '21000008341', 'jessicablairherman@gmail.com', null, null, '2018-07-16 00:08:54.960000', '2018-07-16 09:43:02.991000', null, null, 'Jessica', 'Herman', false, false, null, 'zf', 100, null, 275697, 108586916, 112);
INSERT INTO public.attendees ("attendeeID", "studioID", "classID", "clientID", email, "serviceID", "serviceName", "createdAt", "updatedAt", revenue, "visitDate", firstname, lastname, checkedin, dropped, cost, source, dibs_studio_id, source_serviceid, userid, eventid, spot_id) VALUES ('671989116602156669', 55116, '649238135397418166', '21000037829', 'nikole.vallins@gmail.com', null, null, '2018-07-16 00:08:54.788000', '2018-07-16 09:43:03.217000', null, null, 'nikole', 'vallins', false, false, null, 'zf', 100, null, 231717, 108586916, 116);
INSERT INTO public.attendees ("attendeeID", "studioID", "classID", "clientID", email, "serviceID", "serviceName", "createdAt", "updatedAt", revenue, "visitDate", firstname, lastname, checkedin, dropped, cost, source, dibs_studio_id, source_serviceid, userid, eventid, spot_id) VALUES ('671933010295129760', 55116, '649238135397418166', '671783343200666942', 'kate.clark.lmft@gmail.com', null, null, '2018-07-15 23:09:24.542000', '2018-07-16 11:07:30.589000', null, null, 'Kate', 'Clark', false, false, null, 'zf', 100, null, 317921, 108586916, 130);

select * from dibs_user_autopay_packages LEFT JOIN studio_packages on dibs_user_autopay_packages.studio_package_id = studio_packages.id where stripe_customer_id = 'cus_CYuW0Nm26B0q55';

update dibs_studios set "allowPackages" = true where id in (select distinct dibs_studios.id from dibs_studios left join studio_packages on dibs_studios.id = studio_packages.dibs_studio_id);

SELECT
  a."attendeeID",
  a.checkedin,
  u.id,
  COALESCE(u."firstName", '') AS firstname,
  COALESCE(u."lastName", 'Zingfit Customer') AS lastname,
  u.email,
  CASE
    WHEN u.stripe_cardid IS NOT NULL THEN TRUE
    ELSE FALSE
  END AS "cardOnFile",
  CASE
    WHEN dt."purchasePlace" != 'offsite' THEN 'Dibs' ELSE 'ZINGFIT'
  END AS booking_place,
  CASE
    WHEN dt.with_passid IS NOT NULL THEN sp.name
    WHEN (dt.with_passid IS NULL) THEN 'Single Class'
  END AS plan_name,
  dt.amount,
  a.dibs_studio_id,
  json_build_object(
    'id', s.id,
    'spot_label', COALESCE(s.spot_label, s.source_id),
    'x', s.x,
    'y', s.y
  ) as spot
FROM attendees a
  LEFT JOIN dibs_transactions dt ON a."attendeeID" = dt.saleid AND a.dibs_studio_id = dt.dibs_studio_id
  LEFT JOIN dibs_users u ON u.id = a.userid
  LEFT JOIN passes p ON p.id = dt.with_passid
  LEFT JOIN studio_packages sp ON p.studio_package_id = sp.id
  LEFT JOIN spots s ON s.id = a.spot_id
WHERE a.dibs_studio_id = 100
  AND a.eventid = 108587031
ORDER BY u."lastName";

CREATE OR REPLACE FUNCTION update_dibs_users_ft_search() RETURNS TRIGGER AS $$
        DECLARE
          new_vector CONSTANT tsvector := to_tsvector(TG_ARGV[0]);
          id_key CONSTANT integer := TG_ARGV[1];
        BEGIN
            UPDATE dibs_users
            SET ft_search = to_tsvector(NEW.email)
            WHERE id = id_key;
            RETURN NEW;
        END
          $$ LANGUAGE plpgsql;
DROP FUNCTION  update_dibs_users_ft_search;

drop TRIGGER dibs_users_ft_search_update_tgr();

SELECT pg_terminate_backend(pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '<DATABASE_NAME>' AND pid <> pg_backend_pid();

UPDATE attendees SET ft_search = to_tsvector('english', COALESCE("firstname", '') || ' ' || COALESCE("lastname", '') || ' ' || COALESCE(email, ''));
CREATE TRIGGER dibs_users_ft_search_update_tgr
        AFTER UPDATE OF "firstName", "lastName", email
        ON dibs_users
        REFERENCING NEW TABLE as new_dibs_users
        FOR EACH ROW
        EXECUTE PROCEDURE update_dibs_users_ft_search(to_tsvector('english', COALESCE(new_dibs_users."firstName", '') || ' ' || COALESCE(new_dibs_users."lastName", '') || ' ' || COALESCE(new_dibs_users.email, '')), new_dibs_users.id);

CREATE TRIGGER dibs_users_ft_search_update_tgr
        AFTER UPDATE OF "firstName", "lastName", email
        ON dibs_users
        FOR EACH ROW
        EXECUTE PROCEDURE update_dibs_users_ft_search("firstName" || ' ' || dibs_users."lastName" || ' ' || dibs_users.email, dibs_users.id);