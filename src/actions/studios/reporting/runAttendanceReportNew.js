import axios from 'axios';
import moment from 'moment-timezone';

// ==============================|| RUN ATTENDANCE REPORT FOR STUDIO ||============================== //

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
    console.log(`attended status being checked`);
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

// eslint-disable-next-line consistent-return
const getEasyPaymentStatus = (serviceName, attendeeId, cpAmount, attendedStatus) => {
    console.log(`\n\n\n\n\npayment status being checked for attendeeId: ${attendeeId} attendedStatus: ${attendedStatus}\n\n\n\n\n`);
    if (serviceName === 'Classpass' || serviceName === 'ClassPass') {
        return { paymentType: 'ClassPass', grossRevenue: cpAmount, netRevenue: cpAmount };
    }
    if (attendedStatus === 'Early Drop') {
        console.log(`attendeeid: ${attendeeId} is an early drop - that is what should be returned`);
        return { paymentType: 'N/A - Early Drop', grossRevenue: 0, netRevenue: 0 };
    }
    console.log('still needs to be set - will take care of that separately');
    return { paymentType: 'Payment Type - Not yet set', grossRevenue: 0, netRevenue: 0 };
};

export const RunAttendanceReport = async (dibsStudioId, attendanceInfo, timeZone, locationToShow, cpAmount) => {
    const datatoreturn = [];
    try {
        const promises = [];
        const response = await axios.post('/api/studio/reporting/get-attendance-data', {
            dibsStudioId,
            attendanceInfo,
            locationToShow
        });
        const addDataToReport = async (row) => {
            // eslint-disable-next-line no-new
            new Promise((resolve, reject) => {
                console.log(`\n\n\n\n\nthis row is: ${JSON.stringify(row)}`);
                const attendedStatus = getAttendedStatus(row.checkedin, row.dropped, row.early_cancel);
                console.log(`attendedStatus for ${row.attendeeID} is ${attendedStatus}`);
                const visitDate = moment(row.saleDate).tz(timeZone).format('M/D/YY');
                const visitTime = moment(row.saleDate).tz(timeZone).format('h:mm a');
                const visitDay = moment(row.saleDate).tz(timeZone).format('ddd');
                const nameOfClass = row.events.name;
                const locationName = row.events.location.name;
                let paymentTypeToSend = 'Not yet set';
                const promCodeApplied = null;
                const flastCreditApplied = null;
                const totalDiscounts = 0;
                const clientName = `${row.firstname} ${row.lastname}`;
                const instructorName = `${row.events.instructor.firstname} ${row.events.instructor.lastname}`;
                const { email } = row;
                const paymentInfo = getEasyPaymentStatus(row.serviceName, row.attendeeID, cpAmount, attendedStatus);
                console.log(`paymentInfo returned for ${row.attendeeID} is ${JSON.stringify(paymentInfo)}`);
                const { paymentType, grossRevenue, netRevenue } = paymentInfo;
                console.log(`\n\n\n\npaymentType for ${row.attendeeID} is ${paymentType}\n\n\n\n`);
                paymentTypeToSend = paymentType;
                const grossRevToSend = grossRevenue;
                const netRevToSend = netRevenue;
                const rowData = [
                    row.id,
                    row.attendeeID,
                    row.userid,
                    clientName,
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
                    paymentTypeToSend, // paymentType
                    row.events.price_dibs,
                    promCodeApplied,
                    flastCreditApplied,
                    totalDiscounts,
                    grossRevToSend,
                    netRevToSend
                ];
                datatoreturn.push(rowData);
                resolve();
            });
        };
        if (response.data.success) {
            const { reportData } = response.data;
            reportData.forEach((row) => {
                promises.push(addDataToReport(row));
            });
            await Promise.all(promises).then(() => ({
                msg: 'success',
                reportData: datatoreturn
            }));
        }
    } catch (err) {
        console.log(`error running attendance report for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
        return { msg: 'failure', error: err };
    }
    return {
        msg: 'success',
        reportData: datatoreturn
    };
};

export default RunAttendanceReport;
