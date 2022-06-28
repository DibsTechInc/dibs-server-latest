import axios from 'axios';

// ==============================|| CREATE NEW PROMO CODE FOR STUDIO ||============================== //

export const CreateNewPromoCode = async (dibsStudioId, codeInfo) => {
    try {
        const response = await axios.post('/api/studio/promo-codes/create', {
            dibsStudioId,
            codeInfo
        });
        if (response.data.msg === 'success') {
            return {
                msg: 'success'
            };
        }
        console.log(`Creat new promo code Error: ${JSON.stringify(response.data)}`);
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error creating new promo code for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default CreateNewPromoCode;
