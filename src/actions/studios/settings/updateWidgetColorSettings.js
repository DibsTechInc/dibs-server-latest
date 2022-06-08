import axios from 'axios';

// ==============================|| UPDATE WIDGET COLOR SETTINGS FOR STUDIO ||============================== //

export const UpdateWidgetColor = async (dibsStudioId, color) => {
    try {
        const response = await axios.post('/api/studio/settings/update-studio-color', {
            dibsStudioId,
            studioColor: color
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating widget color settings data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateWidgetColor;
