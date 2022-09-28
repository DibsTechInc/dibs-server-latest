SELECT
  attendees.email,
  attendees."attendeeID",
  attendees.firstname,
  attendees.lastname,
  attendees."clientID",
  attendees."serviceName",
  attendees.checkedin,
  attendees.dropped
FROM attendees
LEFT JOIN events
  ON events.studioid = attendees."studioID"
  AND events.classid = attendees."classID"
  AND events.source = attendees.source
WHERE events.deleted = 0
  AND events.price_dibs IS NOT NULL
  AND events.price_dibs > 0
  AND events.canceled=0
  AND events.studioid = $studioid
  AND events.eventid = $eventId
  AND events.source = $source
ORDER BY attendees."lastname";
