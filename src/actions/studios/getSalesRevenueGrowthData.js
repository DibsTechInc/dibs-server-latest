import moment from 'moment-timezone';
import axios from 'axios';
// ==============================|| GET DASHBOARD DATA ||============================== //

export const getSalesRevenueGrowthData = async (dibsStudioId) => {
    // const dataseries = {};
    // const monthly = [];
    // const weekly = [];
    // const annually = [];
    // const datatorun = ['month', 'week', 'year'];
    try {
        const salesgrowthdata = await axios.post('/api/get-dashboard-sales-growth-data', {
            dibsStudioId,
            timeperiod: 'month'
        });
        console.log(`\n\n\n#####\n\nsalesgrowthdata = ${JSON.stringify(salesgrowthdata)}`);
        const seriestosend = {
            monthly: [
                {
                    name: 'totalrevenue',
                    data: salesgrowthdata
                }
            ]
        };
    } catch (err) {
        console.log(`error getting dashboard data for sales growth data\nerr is: ${err}`);
    }
    return 0;
};

export default getSalesRevenueGrowthData;
