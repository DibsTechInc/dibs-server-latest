import axios from 'axios';

// ==============================|| UPDATE CANCEL TIME FOR STUDIO ||============================== //

export const UpdateCancelTime = async (dibsStudioId, cancelTime) => {
    try {
        const response = await axios.post('/api/studio/settings/update-cancel-time', {
            dibsStudioId,
            cancelTime
        });
        console.log(`response from update is: ${JSON.stringify(response)}`);
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating raf award settings data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateCancelTime;
