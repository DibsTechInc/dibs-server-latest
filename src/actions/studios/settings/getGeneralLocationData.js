import axios from 'axios';

// ==============================|| GET GENERAL LOCATION DATA FOR STUDIO ||============================== //

export const GetGeneralLocationData = async (dibsStudioId) => {
    let returndata;
    try {
        await axios
            .post('/api/studio/settings/general-location-data', {
                dibsStudioId
            })
            .then((res) => {
                const { data } = res;
                const { locationdata } = data;
                returndata = locationdata;
                return locationdata;
            });
        // return { msg: 'success', locationData: locationData.data };
    } catch (err) {
        console.log(`error getting general location data for studioid: ${dibsStudioId}\nerr is: ${err}`);
        return 0;
    }
    return returndata;
};

export default GetGeneralLocationData;
