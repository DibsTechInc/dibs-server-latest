import axios from 'axios';

// ==============================|| CREATE NEW INSTRUCTOR ||============================== //

export const CreatNewInstructor = async (dibsStudioId, firstname, lastname, email, phone, studioid) => {
    try {
        const response = await axios.post('/api/studio/instructors/create', {
            dibsStudioId,
            firstname,
            lastname,
            email,
            phone,
            studioid
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error creating new instructor for studio: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default CreatNewInstructor;
