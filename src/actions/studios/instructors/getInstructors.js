import axios from 'axios';

// ==============================|| GET STUDIO EMPLOYEE ACCOUNTS ||============================== //

export const GetStudioInstructors = async (dibsStudioId) => {
    try {
        const response = await axios.post('/api/studio/instructors/get-instructors', {
            dibsStudioId
        });
        if (response.data.msg === 'success') {
            return {
                msg: 'success',
                activeInstructors: response.data.activeInstructors,
                disabledInstructors: response.data.disabledInstructors
            };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error getting instructors for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetStudioInstructors;
