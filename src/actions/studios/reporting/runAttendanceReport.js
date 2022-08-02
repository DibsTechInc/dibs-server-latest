import axios from 'axios';
import moment from 'moment-timezone';

// ==============================|| RUN ATTENDANCE REPORT FOR STUDIO ||============================== //

const getDescription = (type, row) => {
    if (type === 'retail') {
        const retailItem = row.description.substring(34);
        return `Retail: ${retailItem}`;
    }
    if (type === 'class') {
        return 'Single Class';
    }
    if (type === 'pack') {
        return row.package.name;
    }
    if (type === 'gift') {
        return 'Gift Card';
    }
    if (type === 'credit') {
        return 'Credit Purchase';
    }
    return null;
};
const formatToDollars = (num) => {
    const todayspendformatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
        // maximumFractionDigits: 0,
        // minimumFractionDigits: 0
    }).format(num);
    return todayspendformatted;
};

const getAttendedStatus = (checkedin, dropped, earlyCancel) => {
    if (checkedin) {
        return 'Attended';
    }
    if (dropped) {
        if (earlyCancel) {
            return 'Early Drop';
        }
        return 'Late Drop';
    }
    return 'No Show';
};

export const RunAttendanceReport = async (dibsStudioId, attendanceInfo, timeZone, locationToShow) => {
    try {
        const datatoreturn = [];
        const response = await axios.post('/api/studio/reporting/get-attendance-data', {
            dibsStudioId,
            attendanceInfo
        });
        if (response.data.success) {
            console.log(`\n\n\n\n\nattendance reportData: ${JSON.stringify(response.data.reportData)}`);
            console.log(`\n\ncheck what it says when it is ALL:\nlocationToShow is: ${locationToShow}`);
            // when locationToShow is ALL - it is equal to 999
            response.data.reportData.forEach((row) => {
                const visitDate = moment(row.saleDate).tz(timeZone).format('M/D/YY');
                const visitTime = moment(row.saleDate).tz(timeZone).format('h:mm a');
                const visitDay = moment(row.saleDate).tz(timeZone).format('ddd');
                const nameOfClass = row.events.name;
                const locationName = row.events.location.name;
                const locationId = row.events.locationid;
                const instructorName = `${row.events.instructor.firstname} ${row.events.instructor.lastname}`;
                const attendedStatus = getAttendedStatus(row.checkedin, row.dropped, row.early_cancel);
                const { email } = row;
                const rowData = [
                    row.id,
                    row.userid,
                    row.firstname,
                    row.lastname,
                    email,
                    visitDate,
                    visitTime,
                    visitDay,
                    locationName,
                    nameOfClass,
                    instructorName,
                    row.eventid,
                    attendedStatus,
                    // date booked
                    // payment type
                    row.events.dibs_price
                    // promo code applied
                    // flash credit applied
                    // total discounts
                    // gross revenue attributed
                    // net revenue attributed
                ];
                if (locationId === locationToShow || locationToShow === '999') {
                    datatoreturn.push(rowData);
                }
            });
            console.log(`\n\n\n\n\ndataToReturn is:\n\n${JSON.stringify(datatoreturn)}`);
            return {
                msg: 'success',
                reportData: datatoreturn
            };
        }
        console.log(`Run Attendance Report Data Returned: ${JSON.stringify(response)}`);
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error running attendance report for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default RunAttendanceReport;
