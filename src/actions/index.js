import axios from 'axios';

// ==============================|| DIBS EMPLOYEE STUDIO ACCOUNT INFO ||============================== //

export const StudioEmployeeAccount = async (email) => {
    // axios.get('http://localhost:8080/api/login-studio-admin', { email });

    const studioEmployeeInfo = await axios.post('http://localhost:8080/api/login-studio-admin', {
        email
    });
    console.log(`studioEmployeeInfo is: ${JSON.stringify(studioEmployeeInfo)}`);
    return { msg: 'success' };
};

export default StudioEmployeeAccount;
