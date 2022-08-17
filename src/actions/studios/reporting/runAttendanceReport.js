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

// eslint-disable-next-line consistent-return
const getPaymentStatus = async (serviceName, attendeeId, cpAmount, attendedStatus) => {
    console.log(`\n\n\n\n\nattendeeId: ${attendeeId} attendedStatus: ${attendedStatus}\n\n\n\n\n`);
    if (serviceName === 'Classpass' || serviceName === 'ClassPass') {
        return { paymentType: 'ClassPass', grossRevenue: cpAmount, netRevenue: cpAmount };
    }
    if (attendedStatus === 'Early Drop') {
        console.log(`attendeeid: ${attendeeId} is an early drop`);
        return { paymentType: 'N/A - Early Drop', grossRevenue: 0, netRevenue: 0 };
    }
    const attendeeAsNumber = Number(attendeeId);
    if (attendedStatus !== 'Early Drop') {
        const paymentInfo = await axios.post('api/studio/reporting/get-transaction-data-for-attendance', {
            attendeeAsNumber
        });
        console.log(`payment info for ${attendeeId} is: ${JSON.stringify(paymentInfo.data)}`);
        if (paymentInfo) {
            console.log('there is payment info!');
            const { paymentData } = paymentInfo.data;
            console.log('returning now after retrieving data');
            return paymentData;
        }
    }
    console.log('in the outside return');
    return { paymentType: 'N/A - Say what?', grossRevenue: 0, netRevenue: 0 };
};

export const RunAttendanceReport = async (dibsStudioId, attendanceInfo, timeZone, locationToShow, cpAmount) => {
    try {
        const datatoreturn = [];
        const response = await axios.post('/api/studio/reporting/get-attendance-data', {
            dibsStudioId,
            attendanceInfo,
            locationToShow
        });
        if (response.data.success) {
            // console.log(`\n\n\n\n\n4 - attendance reportData to check: ${JSON.stringify(response.data.reportData)}`);
            // when locationToShow is ALL - it is equal to 999
            let count = 0;
            const updateReportData = new Promise((resolve, reject) => {
                response.data.reportData.forEach((row, index, array) => {
                    console.log(`\n\n\n\n\nrow: ${JSON.stringify(row)}`);
                    const visitDate = moment(row.saleDate).tz(timeZone).format('M/D/YY');
                    const visitTime = moment(row.saleDate).tz(timeZone).format('h:mm a');
                    const visitDay = moment(row.saleDate).tz(timeZone).format('ddd');
                    const nameOfClass = row.events.name;
                    const locationName = row.events.location.name;
                    const locationId = row.events.locationid;
                    let paymentTypeToSend = 'Not yet set';
                    let grossRevToSend = 0;
                    let netRevToSend = 0;
                    const clientName = `${row.firstname} ${row.lastname}`;
                    const instructorName = `${row.events.instructor.firstname} ${row.events.instructor.lastname}`;
                    const attendedStatus = getAttendedStatus(row.checkedin, row.dropped, row.early_cancel);
                    const getpaydetails = async () => {
                        const paymentInfo = await getPaymentStatus(row.serviceName, row.attendeeID, cpAmount, attendedStatus);
                        console.log(`paymentInfo has been returned - it is: ${JSON.stringify(paymentInfo)}`);
                        const { paymentType, grossRevenue, netRevenue } = paymentInfo;
                        console.log(`paymentType returned for attendeeid: ${row.attendeeID} is: ${paymentType}`);
                        paymentTypeToSend = paymentType;
                        grossRevToSend = grossRevenue;
                        netRevToSend = netRevenue;
                        const { email } = row;
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
                            // promo code applied
                            // flash credit applied
                            // total discounts
                            grossRevToSend,
                            netRevToSend
                        ];
                        console.log(`rowData about to pushed into datatoreturn is: ${JSON.stringify(rowData)}`);
                        if (locationId === locationToShow || locationToShow === '999') {
                            // get the transaction data to include
                            console.log(`inside the if state - rowData is being added`);
                            datatoreturn.push(rowData);
                        }
                        count += 1;
                        console.log(`index is: ${index}`);
                        console.log(`array length is: ${array.length}`);
                        console.log(`count is: ${count}`);
                        if (count === array.length) resolve();
                    };
                    getpaydetails();
                });
            });
            updateReportData.then(() => {
                console.log(
                    `\n\n\n\n\njust before returning -> after updating report data, dataToReturn is:\n\n${JSON.stringify(datatoreturn)}`
                );
                return {
                    msg: 'success',
                    reportData: datatoreturn
                };
            });
            // console.log(`in the runAttendance report outside return statement`);
            // return {
            //     msg: 'success',
            //     reportData: datatoreturn
            // };
        }
        // return 0;
    } catch (err) {
        console.log(`error running attendance report for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
        // return { msg: 'failure', error: err };
    }
    // return 0;
};

export default RunAttendanceReport;
