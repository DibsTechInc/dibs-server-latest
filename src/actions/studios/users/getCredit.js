import axios from 'axios';

// ==============================|| GET USER CREDIT DATA ||============================== //

export const getCredit = async (userid, dibsStudioId) => {
    try {
        const response = await axios.post('/api/get-client-credit', {
            userid,
            dibsStudioId
        });
        if (response.data.msg === 'success' && response.data.credit) return response.data.credit;
        return 0;
    } catch (err) {
        console.log(`error getting getCredit. Error is: ${err}`);
    }
    return 0;
};

export default getCredit;
