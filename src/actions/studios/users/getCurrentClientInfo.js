import axios from 'axios';

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

// ==============================|| GET DASHBOARD DATA ||============================== //

export const getCurrentClientInfo = async (userid, dibsStudioId) => {
    console.log(`userid is: ${userid}`);
    try {
        const response = await axios.post('/api/get-client-info', {
            userid,
            dibsStudioId
        });
        // console.log(`\n\n\nresponse from GET CURRENT CLIENT INFO WAS CALLED: ${JSON.stringify(response.data)}\n\n\n`);
        const labelfirstname = response.data.userInfo.firstName[0].toUpperCase() + response.data.userInfo.firstName.substring(1);
        const labellastname = response.data.userInfo.lastName[0].toUpperCase() + response.data.userInfo.lastName.substring(1);
        const nameToDisplay = `${labelfirstname} ${labellastname}`;
        response.data.userInfo.nameToDisplay = nameToDisplay;
        let labelphone;
        if (response.data.userInfo.mobilephone) {
            try {
                const number = phoneUtil.parseAndKeepRawInput(response.data.userInfo.mobilephone, 'US');
                // labelphone = phoneUtil.formatInOriginalFormat(number, 'US');
                // labelphone = phoneUtil.formatOutOfCountryCallingNumber(number, 'US');
                labelphone = phoneUtil.format(number, PNF.NATIONAL);
            } catch (err) {
                labelphone = 'No Phone';
                console.log(`had trouble parsing phone number: ${err}`);
            }
        } else {
            labelphone = 'No Phone';
        }
        response.data.userInfo.labelphone = labelphone;
        response.data.userInfo.studioStripeId = response.data.studioStripeId;
        if (response.data.msg === 'success' && response.data.userInfo) return response.data.userInfo;
        return 0;
    } catch (err) {
        console.log(`error getting search results for client search. Error is: ${err}`);
    }
    return 0;
};

export default getCurrentClientInfo;
