import axios from 'axios';

// ==============================|| REACTIVATE STUDIO EMPLOYEE ACCOUNT ||============================== //

export const ReactivateStudioEmployeeAccount = async (id) => {
    try {
        const response = await axios.post('/api/studio/account/reactivate-employee-account', {
            id
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error deactivating studio employee account settings data for employeeId: ${id}\nerr is: ${err}`);
    }
    return 0;
};

export default ReactivateStudioEmployeeAccount;
