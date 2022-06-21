import axios from 'axios';

// ==============================|| GET STUDIO PAYOUTS ||============================== //

export const GetPayouts = async (dibsStudioId, id) => {
    try {
        const response = await axios.post('/api/studio/get-payouts', {
            id,
            dibsStudioId
        });
        if (response.data.msg === 'success') {
            return {
                msg: 'success',
                payouts: response.data.payouts
            };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error getting payouts for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetPayouts;
