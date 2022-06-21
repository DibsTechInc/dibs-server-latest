import axios from 'axios';

// ==============================|| UPDATE USER PROFILE DATA ||============================== //

export const updateClientInfo = async (userid, email = null, name = null, phone = null, birthday = null) => {
    try {
        console.log(
            `\n\n\n\ninfo passed to updateClientInfo is userid = ${userid}, email = ${email}, name = ${name}, phone = ${phone}, birthday = ${birthday}`
        );
        // to do write api for updating birthday
        const response = await axios.post('/api/update-client-info', {
            userid,
            email,
            name,
            phone,
            birthday
        });
        console.log(`\n\n\n\nresponse from updateClientInfo is: ${JSON.stringify(response)}`);
        if (response.data.msg === 'success') return 1;
        if (response.data.error === 'email already in use') {
            const nameofuser = response.data.nameofuser;
            console.log(`response.data.error = ${response.data.error}`);
            return { error: response.data.error, nameofuser, email };
        }
        if (response.data.errorType === 'phone') {
            const nameofuser = response.data.nameofuser;
            const emailofuser = response.data.emailofuser;
            console.log(`response.data.error = ${response.data.error}`);
            return { error: response.data.error, nameofuser, emailofuser, errorType: 'phone' };
        }
        return response.data.error;
    } catch (err) {
        console.log(`error update client information: ${err}`);
    }
    return 0;
};

export default updateClientInfo;
