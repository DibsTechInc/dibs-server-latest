import axios from 'axios';

// ==============================|| UPDATE SENDING DOMAIN FOR STUDIO ||============================== //

export const UpdateSendingDomain = async (dibsStudioId, customEmail) => {
    try {
        const response = await axios.post('/api/studio/settings/sending-domain/update', {
            dibsStudioId,
            customEmail
        });
        console.log(`response from update sending domain is: ${JSON.stringify(response)}`);
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating general location settings data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateSendingDomain;
