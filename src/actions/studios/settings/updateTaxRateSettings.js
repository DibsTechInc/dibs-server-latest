import axios from 'axios';

// ==============================|| UPDATE TAX RATE FOR STUDIO ||============================== //

export const UpdateTaxRates = async (dibsStudioId, retailTax, salesTax) => {
    try {
        const response = await axios.post('/api/studio/settings/update-tax-rates', {
            dibsStudioId,
            retailTax,
            salesTax
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating raf award settings data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateTaxRates;
