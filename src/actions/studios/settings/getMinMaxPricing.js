import axios from 'axios';

// ==============================|| GET MIN MAX PRICING STATUS FOR STUDIO ||============================== //

export const GetMinMaxPricing = async (dibsStudioId) => {
    try {
        const statustosend = {
            min: 10,
            max: 100
        };
        await axios
            .post('/api/studio/settings/price-data', {
                dibsStudioId
            })
            .then((res) => {
                const { data } = res;
                const { pdata } = data;
                const { min, max } = pdata;
                statustosend.min = min;
                statustosend.max = max;
            });
        return { msg: 'success', statustosend };
    } catch (err) {
        console.log(`error getting pricing data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetMinMaxPricing;
