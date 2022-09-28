SELECT DISTINCT id
from dibs_studio_instructors
WHERE
email = $instructorEmail
AND 
dibs_studio_id = $studioID
AND "deletedAt" is null
