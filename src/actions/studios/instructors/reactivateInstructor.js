import axios from 'axios';

// ==============================|| REACTIVATE STUDIO EMPLOYEE ACCOUNT ||============================== //

export const ReactivateInstructor = async (id) => {
    try {
        const response = await axios.post('/api/studio/instructors/activate', {
            id
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error reactivating instructor: ${id}\nerr is: ${err}`);
    }
    return 0;
};

export default ReactivateInstructor;
