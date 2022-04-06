import axios from 'axios';

// ==============================|| DIBS EMPLOYEE STUDIO ACCOUNT INFO ||============================== //

export const StudioEmployeeAccount = async (email) => {
    try {
        const studioEmployeeInfo = await axios.post('/api/login-studio-admin', {
            email
        });
        const valuestosend = {
            data: studioEmployeeInfo.data.employee
        };
        return { msg: 'success', data: valuestosend.data };
    } catch (err) {
        console.log(`error signing in studioEmployee with email addy: ${email}\nerr is: ${err}`);
    }
    return 0;
};

export default StudioEmployeeAccount;
