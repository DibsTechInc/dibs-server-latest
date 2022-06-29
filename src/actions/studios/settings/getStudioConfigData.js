import axios from 'axios';

// ==============================|| GET STUDIO CONFIG DATA ||============================== //

export const GetStudioConfigData = async (dibsStudioId) => {
    try {
        const response = await axios.post('/api/studio/settings/general-config-data', {
            dibsStudioId
        });
        if (response.data.msg === 'success') {
            return {
                msg: 'success',
                studioConfigData: response.data.studioconfigdata,
                imageUrls: response.data.imageUrls,
                cancelTime: response.data.cancelTime,
                timeZone: response.data.timeZone,
                paymentInfo: response.data.paymentInfo
            };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error GETTING STUDIO CONFIG DATA for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetStudioConfigData;
