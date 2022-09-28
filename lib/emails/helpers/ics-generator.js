const moment = require('moment');
/**
 * generate an ICS string
 * @param  {object} event event data
 * @return {string}       ICS string
 */
module.exports = function generateICS(event) {
  let locationString = event.location.address;
  if (event.manual_track_id) locationString = event.manual_track_id;

  let descriptionStr = `${event.name} with ${event.instructor.first_name} ${event.instructor.last_name}. ${studio.name} - ${event.location.name}`;
  console.log('event.zoompassword = ');
  console.log(event.zoom_password);
  if (event.zoom_password != null) {
    descriptionStr += '\n\n\n';
    descriptionStr += 'Getting to class:';
    descriptionStr += '\n';
    descriptionStr += `Link: ${event.manual_track_id}`;
    descriptionStr += '\n';
    descriptionStr += `Password: ${event.zoom_password}`;
  }
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART: ${moment(moment(event.start_time).format('YYYY-MM-DDTHH:mm:ss')).local().format('YYYYMMDDTHHmmss')}Z}
DTEND:${moment(moment(event.end_time).format('YYYY-MM-DDTHH:mm:ss')).local().format('YYYYMMDDTHHmmss')}Z}
SUMMARY:${event.name} with ${event.instructor.first_name} ${event.instructor.last_name}. ${studio.name} - ${event.location.name}
ORGANIZER;CN=${event.studio.name}:MAILTO:info@ondibs.com
CATEGORIES:Fitness
DESCRIPTION:${descriptionStr}
LOCATION:${locationString}
END:VEVENT
END:VCALENDAR`;
};

/**
 * generate an ICS string for new purchasing
 * @param {Object} event event data
 * @param {Object} studio data, optional, if not provided will attempt to use event.studio instead
 * @return {string}       ICS string
 */
module.exports = function generateICSForEventWithTime(event, studio) {
  if (!studio) studio = event.studio;
  let locationString = event.location.address;
  if (event.manual_track_id) locationString = event.manual_track_id;
  console.log('event.zoompassword v2 = ');
  console.log(event.zoom_password);
  let zoomPassword = event.zoom_password || 1;
  let descriptionStr = `${event.name} with ${event.instructor.first_name} ${event.instructor.last_name}. ${studio.name} - ${event.location.name}`;
  if (zoomPassword !== 1) {
    console.log('i registered that there is a password');
    descriptionStr += '\\n\\nGetting to class:\\nLink: ';
    descriptionStr += `${event.manual_track_id}`;
    descriptionStr += '\\nPassword: ';
    descriptionStr += `${event.zoom_password}`;
  }
  console.log(`descriptionStr = ${descriptionStr}`);
  return `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART: ${moment(event.start_time).format('YYYYMMDDTHHmmss')}Z}
DTEND:${moment(event.end_time).format('YYYYMMDDTHHmmss')}Z}
SUMMARY:${event.name} with ${event.instructor.first_name} ${event.instructor.last_name}. ${studio.name} - ${event.location.name}
ORGANIZER;CN=${studio.name}:MAILTO:info@ondibs.com
CATEGORIES:Fitness
DESCRIPTION:${descriptionStr}
LOCATION:${locationString}
END:VEVENT
END:VCALENDAR`;
};
