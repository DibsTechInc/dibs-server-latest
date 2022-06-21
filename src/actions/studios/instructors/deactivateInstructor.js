import axios from 'axios';

// ==============================|| DEACTIVATE STUDIO EMPLOYEE ACCOUNT ||============================== //

export const DeactivateInstructor = async (id) => {
    try {
        const response = await axios.post('/api/studio/instructors/deactivate', {
            id
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error deactivating instructor: ${id}\nerr is: ${err}`);
    }
    return 0;
};

export default DeactivateInstructor;
