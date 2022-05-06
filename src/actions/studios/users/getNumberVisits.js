import axios from 'axios';

// ==============================|| GET USER PROFILE DATA ||============================== //

export const getNumberVisits = async (userid, dibsStudioId) => {
    try {
        const response = await axios.post('/api/get-number-visits', {
            userid,
            dibsStudioId
        });
        return response.data.numVisits;
    } catch (err) {
        console.log(`error getting number of visits for this client. Error is: ${err}`);
    }
    return 0;
};

export default getNumberVisits;
