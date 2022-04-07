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
            let week = moment().subtract(i, 'weeks').format('M/D/YY');
            const yearofdate = moment(week, 'M/D/YY').format('YYYY');
            const thisyear = moment().format('YYYY');
            if (yearofdate === thisyear) {
                week = moment().subtract(i, 'weeks').format('M/D');
            }
            xaxisweekly[i] = week;
        }
        xaxisweekly.reverse();
        // get annual categories
        for (let i = 0; i < 8; i += 1) {
            const year = moment().subtract(i, 'year').format('YYYY');
            xaxisyearly[i] = year;
        }
        xaxisyearly.reverse();
        const earliestRevenueYear = await axios.post('/api/get-earliest-revenue-year', {
            dibsStudioId
        });
        console.log(`earliestRevenueYear is: ${JSON.stringify(earliestRevenueYear.data.minDate)}`);
        const earliestyear = moment(earliestRevenueYear.data.minDate, 'YYYY-MM-DDTHH:mm:ssZ').format('YYYY');
        const yeartouse = earliestyear - 1;
        console.log(`yeartouse is: ${yeartouse}`);
        const xaxisyearlyfiltered = xaxisyearly.filter((value) => value > yeartouse);
        console.log(`xaxisyearlyfiltered is: ${JSON.stringify(xaxisyearlyfiltered)}`);
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
