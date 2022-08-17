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
                console.log(`timezone is: ${timeZone}`);
                const attendedStatus = getAttendedStatus(row.checkedin, row.dropped, row.early_cancel);
                console.log(`attendedStatus for ${row.attendeeID} is ${attendedStatus}`);
                const startDate = row.visitDate;
                const visitDate = moment(row.visitDate).tz(timeZone).format('M/D/YY');
                const visitTime = moment(row.visitDate).tz(timeZone).format('h:mm a');
                const visitDay = moment(row.visitDate).tz(timeZone).format('ddd');
                const bookedDate = moment(row.createdAt).tz(timeZone).format('M/D/YY');
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
                let grossRevToSend = grossRevenue;
                let netRevToSend = netRevenue;
                const getMoreComplexPaymentType = async () => {
                    if (paymentTypeToSend === 'Payment Type - Not yet set') {
                        await getComplexPaymentStatus(row.attendeeID)
                            .then((response) => {
                                console.log(
                                    `\n\n\n\n\nresponse from the getComplexPaymentStatus call for ${row.attendeeID} is: ${JSON.stringify(
                                        response
                                    )}`
                                );
                                const { paymentTypeDB, grossRevenueDB, netRevenueDB } = response;
                                paymentTypeToSend = paymentTypeDB;
                                grossRevToSend = grossRevenueDB;
                                netRevToSend = netRevenueDB;
                            })
                            .catch((err) => {
                                console.log(
                                    `\n\n\n\n\nerror from the getComplexPaymentStatus call for ${row.attendeeID} is: ${JSON.stringify(err)}`
                                );
                            });
                        // console.log(`newPaymentInfo that was returned from complex api call is: ${JSON.stringify(newPaymentInfo)}`);
                    }
                    const grossRevToSendFormatted = formatToDollars(grossRevToSend);
                    const netRevToSendFormatted = formatToDollars(netRevToSend);
                    const rowData = [
                        row.id,
                        clientName,
                        email,
                        visitDate,
                        visitTime,
                        startDate,
                        locationName,
                        nameOfClass,
                        instructorName,
                        attendedStatus,
                        paymentTypeToSend, // paymentType
                        // row.events.price_dibs,
                        // promCodeApplied,
                        // flastCreditApplied,
                        // totalDiscounts,
                        grossRevToSendFormatted,
                        netRevToSendFormatted
                    ];
                    datatoreturn.push(rowData);
                    resolve();
                };
                getMoreComplexPaymentType();
            });
        };
        const sortDataByDate = (itemA, itemB) => {
            if (itemA[5] > itemB[5]) {
                return 1;
            }
            return -1;
        };
        const sortName = (itemA, itemB) => {
            if (itemA[5] === itemB[5]) {
                if (itemA[1] > itemB[1]) {
                    return 1;
                }
                return -1;
            }
            return 0;
        };
        if (response.data.success) {
            const { reportData } = response.data;
            reportData.forEach((row) => {
                promises.push(addDataToReport(row));
            });
            await Promise.all(promises)
                .then(() => {
                    datatoreturn.sort(sortDataByDate).sort(sortName);
                })
                .then(() => {
                    console.log('now returning the data');
                    return {
                        msg: 'success',
                        reportData: datatoreturn
                    };
                });
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
