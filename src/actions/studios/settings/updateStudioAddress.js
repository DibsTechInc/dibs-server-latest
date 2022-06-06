import axios from 'axios';

// ==============================|| UPDATE STUDIO ADDRESS FOR STUDIO ||============================== //

export const UpdateStudioAddress = async (dibsStudioId, addressObject) => {
    console.log(`\n\n\n\npassed to studio address = ${JSON.stringify(addressObject)}`);
    try {
        const response = await axios.post('/api/studio/settings/address/update', {
            dibsStudioId,
            addressObject
        });
        console.log(`response from update studio address is: ${JSON.stringify(response)}`);
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating studio address for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateStudioAddress;
