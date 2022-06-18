import axios from 'axios';

// ==============================|| DEACTIVATE STUDIO EMPLOYEE ACCOUNT ||============================== //

export const DeactivateStudioEmployeeAccount = async (id) => {
    try {
        console.log(`id for action is: ${id}`);
        const response = await axios.post('/api/studio/account/deactivate-employee-account', {
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

export default DeactivateStudioEmployeeAccount;
