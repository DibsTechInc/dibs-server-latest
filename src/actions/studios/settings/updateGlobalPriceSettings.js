import axios from 'axios';

// ==============================|| UPDATE GLOBAL PRICE SETTINGS FOR STUDIO ||============================== //

export const UpdateGlobalPriceSettings = async (dibsStudioId, minPrice, maxPrice) => {
    try {
        console.log(`min price that was sent is: ${minPrice}`);
        const response = await axios.post('/api/studio/settings/global-price-settings/update', {
            dibsStudioId,
            minPrice,
            maxPrice
        });
        console.log(`response from update is: ${JSON.stringify(response)}`);
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
