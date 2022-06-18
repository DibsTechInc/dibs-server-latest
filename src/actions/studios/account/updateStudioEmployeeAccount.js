import axios from 'axios';

// ==============================|| UPDATE STUDIO EMPLOYEE ACCOUNT ||============================== //

export const UpdateStudioEmployeeAccount = async (id, firstname, lastname, email, phone, managerAccess) => {
    try {
        console.log(
            `id: ${id}, firstname: ${firstname}, lastname: ${lastname}, email: ${email}, phone: ${phone}, managerAccess: ${managerAccess}`
        );
        const response = await axios.post('/api/studio/account/update-employee-account', {
            id,
            firstname,
            lastname,
            email,
            phone,
            managerAccess
        });
        console.log(`response: ${JSON.stringify(response.data)}`);
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating studio employee account settings data for employeeId: ${id}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateStudioEmployeeAccount;
