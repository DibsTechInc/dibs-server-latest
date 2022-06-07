import axios from 'axios';

// ==============================|| GET STUDIO CONFIG DATA ||============================== //

export const GetStudioConfigData = async (dibsStudioId) => {
    try {
        const response = await axios.post('/api/studio/settings/general-config-data', {
            dibsStudioId
        });
        console.log(`\n\n\n\nresponse from GET STUDIO CONFIG DATA is: ${JSON.stringify(response)}`);
        if (response.data.msg === 'success') {
            return {
                msg: 'success',
                studioConfigData: response.data.studioconfigdata,
                imageUrls: response.data.imageUrls,
                cancelTime: response.data.cancelTime
            };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error GETTING STUDIO CONFIG DATA for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetStudioConfigData;
