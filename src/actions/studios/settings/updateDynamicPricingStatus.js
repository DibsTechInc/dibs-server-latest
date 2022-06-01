import axios from 'axios';

// ==============================|| UPDATE DYNAMIC PRICING STATUS FOR STUDIO ||============================== //

export const UpdateDynamicPricing = async (dibsStudioId, status) => {
    try {
        await axios.post('/api/studio/settings/dynamic-pricing/update', {
            dibsStudioId,
            status
        });
        return { msg: 'success' };
    } catch (err) {
        console.log(`error updating dynamic pricing status data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateDynamicPricing;
