select p.id
from passes p
join studio_packages sp
on p.studio_package_id = sp.id
where p."expiresAt" > now()
and p.userid = $userid
and sp.private = FALSE
and p."deletedAt" is null
and (p."totalUses" is NULL or p."usesCount" < p."totalUses")
and p.dibs_studio_id = $dibsStudioId
order by "expiresAt"
limit 1
