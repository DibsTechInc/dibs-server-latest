import axios from 'axios';

// ==============================|| CREATE NEW STUDIO EMPLOYEE ACCOUNT ||============================== //

export const CreateNewEmployeeAccount = async (dibsStudioId, firstname, lastname, email, phone, managerAccess) => {
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
        console.log(`error creating new employee account settings data for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default CreateNewEmployeeAccount;
