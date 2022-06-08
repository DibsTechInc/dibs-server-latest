import axios from 'axios';

// ==============================|| UPDATE WIDGET CALENDAR INTERVAL FOR STUDIO ||============================== //

export const UpdateIntervalEnd = async (dibsStudioId, intervalEnd) => {
    try {
        const response = await axios.post('/api/studio/settings/update-calendar-interval', {
            dibsStudioId,
            intervalEnd
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating widget intervalEnd settings data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateIntervalEnd;
