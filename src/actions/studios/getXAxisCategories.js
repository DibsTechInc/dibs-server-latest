import moment from 'moment-timezone';
import axios from 'axios';
// ==============================|| GET DASHBOARD DATA ||============================== //

export const getXAxisCategories = async (dibsStudioId) => {
    const xaxismonthly = [];
    const xaxisweekly = [];
    const xaxisyearly = [];
    try {
        // get monthly categories
        for (let i = 0; i < 12; i += 1) {
            let month = moment().subtract(i, 'months').format('MMM `YY');
            const yearofdate = moment(month, 'MMM `YY').format('YYYY');
            const thisyear = moment().format('YYYY');
            if (yearofdate === thisyear) {
                month = moment().subtract(i, 'months').format('MMM');
            }
            xaxismonthly[i] = month;
        }
        xaxismonthly.reverse();
        // get weekly categories
        for (let i = 0; i < 12; i += 1) {
            const fromDateWeek = moment().tz('America/New_York').startOf('week').add(1, 'day').format('M/D/YY');
            // const fromDateWeek = moment(today).startOf('week').add(1, 'day');
            let week = moment(fromDateWeek, 'M/D/YY').subtract(i, 'weeks').format('M/D/YY');
            const yearofdate = moment(week, 'M/D/YY').format('YYYY');
            const thisyear = moment().format('YYYY');
            if (yearofdate === thisyear) {
                // week = moment().subtract(i, 'weeks').format('M/D');
                week = moment(week, 'M/D/YY').format('M/D');
            }
            xaxisweekly[i] = week;
        }
        xaxisweekly.reverse();
        // get annual categories
        for (let i = 0; i < 10; i += 1) {
            const year = moment().subtract(i, 'year').format('YYYY');
            xaxisyearly[i] = year;
        }
        xaxisyearly.reverse();
        const earliestRevenueYear = await axios
            .post('/api/get-earliest-revenue-year', {
                dibsStudioId
            })
            .catch((error) => {
                console.log(`error getting earliest revenue year for studioid: ${dibsStudioId}\nerr is: ${error}`);
            });
        const earliestyear = moment(earliestRevenueYear.data.minDate, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY');
        const yeartouse = earliestyear - 1;
        const xaxisyearlyfiltered = xaxisyearly.filter((value) => value > yeartouse);
        const xaxistoreturn = {
            monthly: {
                // xaxiscategories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                xaxiscategories: xaxismonthly
            },
            weekly: {
                xaxiscategories: xaxisweekly
            },
            annually: {
                xaxiscategories: xaxisyearlyfiltered
            }
        };
        return xaxistoreturn;
    } catch (err) {
        console.log(`error getting dashboard data\nerr is: ${err}`);
    }
    return 0;
};

export default getXAxisCategories;
