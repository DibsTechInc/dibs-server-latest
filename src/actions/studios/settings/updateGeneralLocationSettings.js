import axios from 'axios';

// ==============================|| UPDATE GLOBAL PRICE SETTINGS FOR STUDIO ||============================== //

export const UpdateGeneralLocationSettings = async (dibsStudioId, email, phone) => {
    try {
        const response = await axios.post('/api/studio/settings/general-location-data/update', {
            dibsStudioId,
            email,
            phone
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating general location settings data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateGeneralLocationSettings;
