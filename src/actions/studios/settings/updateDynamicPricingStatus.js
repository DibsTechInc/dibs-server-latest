import axios from 'axios';

// ==============================|| UPDATE DYNAMIC PRICING STATUS FOR STUDIO ||============================== //

export const GetDynamicPricing = async (dibsStudioId, status) => {
    try {
        let dynamicpricingtosend = false;
        await axios
            .post('/api/studio/settings/dynamic-pricing/update', {
                dibsStudioId,
                status
            })
            .then((res) => {
                const { data } = res;
                const { pricingData } = data;
                console.log(`dynamicpricing: ${JSON.stringify(data)}`);
                dynamicpricingtosend = pricingData;
            });
        return { msg: 'success', dp: dynamicpricingtosend };
    } catch (err) {
        console.log(`error getting dynamic pricing status data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetDynamicPricing;
