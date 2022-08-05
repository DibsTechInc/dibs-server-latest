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
const getEasyPaymentStatus = (serviceName, attendeeId, cpAmount, attendedStatus, priceOfClass) => {
    console.log(`\n\n\n\n\npayment status being checked for attendeeId: ${attendeeId} attendedStatus: ${attendedStatus}\n\n\n\n\n`);
    if (serviceName === 'Classpass' || serviceName === 'ClassPass') {
        return { paymentType: 'ClassPass', grossRevenue: cpAmount, netRevenue: cpAmount };
    }
    if (attendedStatus === 'Early Drop') {
        console.log(`attendeeid: ${attendeeId} is an early drop - that is what should be returned`);
        return { paymentType: 'N/A - Early Drop', grossRevenue: 0, netRevenue: 0 };
    }
    if (priceOfClass === 0) {
        console.log(`free class: ${attendeeId} is a free class - that is what should be returned`);
        return { paymentType: 'Free Class', grossRevenue: 0, netRevenue: 0 };
    }
    console.log('still needs to be set - will take care of that separately');
    return { paymentType: 'Payment Type - Not yet set', grossRevenue: 0, netRevenue: 0 };
};
const getComplexPaymentStatus = async (attendeeId) => {
    console.log(`inside of the getComplexPaymentStatus function`);
    const attendeeAsNumber = Number(attendeeId);
    return new Promise((resolve, reject) => {
        axios
            .post('/api/studio/reporting/get-transaction-data-for-attendance', { attendeeAsNumber })
            .then((response) => {
                console.log(`\n\n\n\n\nresponse from the api call for attendeeId: ${attendeeId} is: ${JSON.stringify(response)}`);
                if (response.data.success) {
                    const { paymentData } = response.data;
                    console.log(`paymentData --> ${JSON.stringify(paymentData)}`);
                    resolve(paymentData);
                } else {
                    reject(response.data.error);
                }
            })
            .catch((err) => {
                reject(err);
            });
    });
};

export const RunAttendanceReport = async (dibsStudioId, attendanceInfo, timeZone, locationToShow, cpAmount) => {
    const datatoreturn = [];
    try {
        const promises = [];
        // const paymentTypePromises = [];
        const response = await axios.post('/api/studio/reporting/get-attendance-data', {
            dibsStudioId,
            attendanceInfo,
            locationToShow
        });
        const addDataToReport = async (row) => {
            await new Promise((resolve, reject) => {
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
                const paymentInfo = getEasyPaymentStatus(row.serviceName, row.attendeeID, cpAmount, attendedStatus, row.events.price_dibs);
                console.log(`paymentInfo returned for ${row.attendeeID} is ${JSON.stringify(paymentInfo)}`);
                const { paymentType, grossRevenue, netRevenue } = paymentInfo;
                console.log(`\n\n\n\npaymentType for ${row.attendeeID} is ${paymentType}\n\n\n\n`);
                paymentTypeToSend = paymentType;
                const grossRevToSend = grossRevenue;
                const netRevToSend = netRevenue;
                const getMoreComplexPaymentType = async () => {
                    if (paymentTypeToSend === 'Payment Type - Not yet set') {
                        // create a promise to find the info
                        console.log('about to make the getComplexPaymentStatus call');
                        console.log(`call being made for ${row.attendeeID}`);
                        const newPaymentInfo = await getComplexPaymentStatus(row.attendeeID)
                            .then((response) => {
                                console.log(
                                    `\n\n\n\n\nresponse from the getComplexPaymentStatus call for ${row.attendeeID} is: ${JSON.stringify(
                                        response
                                    )}`
                                );
                                const { paymentTypeDB } = response;
                                paymentTypeToSend = paymentTypeDB;
                            })
                            .catch((err) => {
                                console.log(
                                    `\n\n\n\n\nerror from the getComplexPaymentStatus call for ${row.attendeeID} is: ${JSON.stringify(err)}`
                                );
                            });
                        console.log(`newPaymentInfo that was returned from complex api call is: ${JSON.stringify(newPaymentInfo)}`);
                    }
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
                };
                getMoreComplexPaymentType();
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
