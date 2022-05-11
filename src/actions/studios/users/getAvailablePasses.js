import axios from 'axios';

// ==============================|| GET USER AVAILABLE PASSES DATA ||============================== //

export const getAvailablePasses = async (userid, dibsStudioId) => {
    try {
        const response = await axios.post('/api/get-available-passes', {
            userid,
            dibsStudioId
        });
        if (response.data.msg === 'success' && response.data.availablePasses) return response.data.availablePasses;
        return 0;
    } catch (err) {
        console.log(`error getting getAvailablePasses. Error is: ${err}`);
    }
    return 0;
};

export default getAvailablePasses;
