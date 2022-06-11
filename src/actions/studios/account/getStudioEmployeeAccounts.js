import axios from 'axios';

// ==============================|| GET STUDIO EMPLOYEE ACCOUNTS ||============================== //

export const GetStudioEmployeeAccounts = async (dibsStudioId) => {
    try {
        const response = await axios.post('/api/studio/account/get-employee-accounts', {
            dibsStudioId
        });
        if (response.data.msg === 'success') {
            return {
                msg: 'success',
                activeEmployeeAccounts: response.data.activeEmployeeAccounts,
                inactiveEmployeeAccounts: response.data.inactiveEmployeeAccounts
            };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error getting employee accounts for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetStudioEmployeeAccounts;
