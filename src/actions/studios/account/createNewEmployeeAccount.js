import axios from 'axios';

// ==============================|| CREATE NEW STUDIO EMPLOYEE ACCOUNT ||============================== //

export const UpdateStudioProfileAccount = async (dibsStudioId, firstname, lastname, email, phone, managerAccess) => {
    try {
        const response = await axios.post('/api/studio/account/create-new-employee', {
            dibsStudioId,
            firstname,
            lastname,
            email,
            phone,
            managerAccess
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating studio profile account settings data for employeeId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateStudioProfileAccount;
