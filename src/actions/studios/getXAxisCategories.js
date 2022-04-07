import moment from 'moment-timezone';
// ==============================|| GET DASHBOARD DATA ||============================== //

export const getXAxisCategories = async () => {
    const xaxismonthly = [];
    try {
        const thismonth = moment().format('MMM `YY');
        console.log(`thismonth is: ${thismonth}`);
        for (let i = 0; i < 12; i += 1) {
            const month = moment().subtract(i, 'months').format('MMM `YY');
            console.log(`month is: ${month}`);
            xaxismonthly[i] = month;
        }
        console.log(`xaxismonthly is: ${JSON.stringify(xaxismonthly)}`);
        const xaxistoreturn = {
            monthly: {
                // xaxiscategories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                xaxiscategories: xaxismonthly
            },
            weekly: {
                xaxiscategories: ['1', '2', '3', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            annually: {
                xaxiscategories: ['2022', '2021', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        };
        return xaxistoreturn;
    } catch (err) {
        console.log(`error getting dashboard data\nerr is: ${err}`);
    }
    return 0;
};

export default getXAxisCategories;
