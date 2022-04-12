import axios from 'axios';
// ==============================|| GET DASHBOARD DATA ||============================== //

export const getSalesRevenueGrowthData = async (dibsStudioId, yearstoshow) => {
    try {
        const salesgrowthdata = await axios.post('/api/get-dashboard-sales-growth-data', {
            dibsStudioId,
            timeperiod: 'month',
            periodstoshow: 12
        });
        const salesgrowthdatabyweek = await axios.post('/api/get-dashboard-sales-growth-data', {
            dibsStudioId,
            timeperiod: 'week',
            periodstoshow: 12
        });
        const salesgrowthdatabyyear = await axios.post('/api/get-dashboard-sales-growth-data', {
            dibsStudioId,
            timeperiod: 'year',
            periodstoshow: yearstoshow
        });
        const seriesdatavalues = {
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
                    data: salesgrowthdatabyyear.data.revenuedata.memberships
                },
                {
                    name: 'Packages',
                    data: salesgrowthdatabyyear.data.revenuedata.packages
                },
                {
                    name: 'Singles',
                    data: salesgrowthdatabyyear.data.revenuedata.singles
                },
                {
                    name: 'Retail',
                    data: salesgrowthdatabyyear.data.revenuedata.retail
                },
                {
                    name: 'Gift Cards',
                    data: salesgrowthdatabyyear.data.revenuedata.giftcards
                }
            ]
        };
        return seriesdatavalues;
    } catch (err) {
        console.log(`error getting dashboard data for sales growth data\nerr is: ${err}`);
    }
    return 0;
};

export default getSalesRevenueGrowthData;
