import axios from 'axios';

// ==============================|| CHECK PROMO CODE EXISTS FOR STUDIO ||============================== //

export const CheckPromoCode = async (dibsStudioId, code) => {
    try {
        const response = await axios.post('/api/studio/promo-codes/check-code', {
            code,
            dibsStudioId
        });
        if (response.data.msg === 'success') {
            return {
                msg: 'success',
                codeExists: response.data.codeExists
            };
        }
        console.log(`Check promo code exists Error: ${JSON.stringify(response.data)}`);
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error checking promo codes exist for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default CheckPromoCode;
