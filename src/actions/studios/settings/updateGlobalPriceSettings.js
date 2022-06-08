import axios from 'axios';

// ==============================|| UPDATE GLOBAL PRICE SETTINGS FOR STUDIO ||============================== //

export const UpdateGlobalPriceSettings = async (dibsStudioId, minPrice, maxPrice) => {
    try {
        const response = await axios.post('/api/studio/settings/global-price-settings/update', {
            dibsStudioId,
            minPrice,
            maxPrice
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating global price settings data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateGlobalPriceSettings;
