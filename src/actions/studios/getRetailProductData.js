import axios from 'axios';

// ==============================|| GET DASHBOARD DATA ||============================== //

export const GetRetailData = async (dibsStudioId) => {
    try {
        const retailData = await axios.post('/api/studio/retail/get-retail-products', {
            dibsStudioId
        });
        const { data } = retailData;
        const { products } = data;
        console.log('retailData', JSON.stringify(retailData));
        return { msg: 'success', data: products };
    } catch (err) {
        console.log(`error getting retail products data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetRetailData;
