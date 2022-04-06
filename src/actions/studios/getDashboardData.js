import axios from 'axios';

// ==============================|| GET DASHBOARD DATA ||============================== //

export const GetDashboardData = async (dibsStudioId) => {
    try {
        const dashboardData = await axios.post('/api/get-dashboard-data', {
            dibsStudioId
        });
        const valuestosend = {
            data: dashboardData.data
        };
        return { msg: 'success', data: valuestosend.data };
    } catch (err) {
        console.log(`error getting dashboard data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetDashboardData;
