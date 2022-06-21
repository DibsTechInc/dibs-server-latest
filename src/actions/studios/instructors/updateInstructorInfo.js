import axios from 'axios';

// ==============================|| UPDATE INSTRUCTOR INFO ||============================== //

export const UpdateInstructorInfo = async (id, firstname, lastname, email, phone) => {
    try {
        console.log(`id: ${id}, firstname: ${firstname}, lastname: ${lastname}, email: ${email}, phone: ${phone}`);
        const response = await axios.post('/api/studio/instructors/update', {
            id,
            firstname,
            lastname,
            email,
            phone
        });
        console.log(`response: ${JSON.stringify(response.data)}`);
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating instructor info data for instructor: ${id}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateInstructorInfo;
