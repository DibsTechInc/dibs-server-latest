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
        const salesgrowthdatabyweek = await axios.post('/api/get-dashboard-sales-growth-data', {
            dibsStudioId,
            timeperiod: 'week'
        });
        console.log(`data that gets returned is: ${JSON.stringify(salesgrowthdata.data.revenuedata)}`);
        const seriestest = {
            weekly: [
                {
                    name: 'Memberships',
                    data: salesgrowthdatabyweek.data.revenuedata.memberships
                },
                {
                    name: 'Packages',
                    data: salesgrowthdatabyweek.data.revenuedata.packages
                },
                {
                    name: 'Singles',
                    data: salesgrowthdatabyweek.data.revenuedata.singles
                },
                {
                    name: 'Retail',
                    data: salesgrowthdatabyweek.data.revenuedata.retail
                },
                {
                    name: 'Gift Cards',
                    data: salesgrowthdatabyweek.data.revenuedata.giftcards
                }
            ],
            monthly: [
                {
                    name: 'Memberships',
                    data: salesgrowthdata.data.revenuedata.memberships
                },
                {
                    name: 'Packages',
                    data: salesgrowthdata.data.revenuedata.packages
                },
                {
                    name: 'Singles',
                    data: salesgrowthdata.data.revenuedata.singles
                },
                {
                    name: 'Retail',
                    data: salesgrowthdata.data.revenuedata.retail
                },
                {
                    name: 'Gift Cards',
                    data: salesgrowthdata.data.revenuedata.giftcards
                }
            ],
            annually: [
                {
                    name: 'Memberships',
                    data: [3500, 12500, 3500, 35, 35, 80]
                },
                {
                    name: 'Packages',
                    data: [35, 15, 15, 35, 65, 40, 80]
                },
                {
                    name: 'Singles',
                    data: [35, 145, 35, 35, 20, 105, 100]
                },
                {
                    name: 'Retail',
                    data: [0, 0, 75, 0, 0, 115, 0]
                },
                {
                    name: 'Gift Cards',
                    data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
                }
            ]
        };

        const seriestosend = {
            monthly: [
                {
                    name: 'Memberships',
                    data: salesgrowthdata.data.revenuedata.memberships
                },
                {
                    name: 'Packages',
                    data: salesgrowthdata.data.revenuedata.packages
                },
                {
                    name: 'Singles',
                    data: salesgrowthdata.data.revenuedata.singles
                },
                {
                    name: 'Retail',
                    data: salesgrowthdata.data.revenuedata.retail
                },
                {
                    name: 'Gift Cards',
                    data: salesgrowthdata.data.revenuedata.giftcards
                }
            ]
        };
        return seriestest;
    } catch (err) {
        console.log(`error getting dashboard data for sales growth data\nerr is: ${err}`);
    }
    return 0;
};

export default getSalesRevenueGrowthData;
