import axios from 'axios';

// ==============================|| UPDATE RAF AWARD FOR STUDIO ||============================== //

export const UpdateRafAward = async (dibsStudioId, raf) => {
    try {
        const response = await axios.post('/api/studio/settings/update-raf-award', {
            dibsStudioId,
            raf
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

export default UpdateRafAward;
