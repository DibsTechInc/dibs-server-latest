import axios from 'axios';
import moment from 'moment-timezone';

// ==============================|| DEACTIVATE PROMO CODE FOR STUDIO ||============================== //

export const DeactivatePromocode = async (promoid) => {
    try {
        const response = await axios.post('/api/studio/promo-codes/deactivate', {
            promoid
        });
        if (response.data.msg === 'success') {
            return {
                msg: 'success'
            };
        }
        console.log(`Deactivate promo codes Error: ${JSON.stringify(response.data)}`);
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error deactivating promo code for promoid: ${promoid}\nerr is: ${err}`);
    }
    return 0;
};

export default DeactivatePromocode;
