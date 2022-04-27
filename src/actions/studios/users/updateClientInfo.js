import axios from 'axios';

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

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
        if (response.data.msg === 'success') return 1;
        console.log(`response is: ${JSON.stringify(response.data)}`);
        return response.data.error;
    } catch (err) {
        console.log(`error update client information: ${err}`);
    }
    return 0;
};

export default updateClientInfo;
