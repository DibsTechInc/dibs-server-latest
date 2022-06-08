import axios from 'axios';

// ==============================|| UPDATE STUDIO PROFILE ACCOUNT ||============================== //

export const UpdateStudioProfileAccount = async (employeeId, email, firstname, lastname, phonenumber) => {
    try {
        const response = await axios.post('/api/studio/account/update-profile', {
            employeeId,
            email,
            firstname,
            lastname,
            phonenumber
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating studio profile account settings data for employeeId: ${employeeId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateStudioProfileAccount;
