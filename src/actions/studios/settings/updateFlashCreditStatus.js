import axios from 'axios';

// ==============================|| UPDATE FLASH CREDIT STATUS FOR STUDIO ||============================== //

export const UpdateFlashCreditStatus = async (dibsStudioId, status) => {
    try {
        await axios.post('/api/studio/settings/flash-credit/update', {
            dibsStudioId,
            status
        });
        return { msg: 'success' };
    } catch (err) {
        console.log(`error updating flash credit status data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateFlashCreditStatus;
