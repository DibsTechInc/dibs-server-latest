import axios from 'axios';

// ==============================|| GET STUDIO LOCATIONS DATA ||============================== //

export const getStudioLocations = async (dibsStudioId) => {
    try {
        const response = await axios.post('/api/get-studio-locations', {
            dibsStudioId
        });
        if (response.data.msg === 'success') return response.data.locations;
        return 0;
    } catch (err) {
        console.log(`error getting getStudioLocations. Error is: ${err}`);
    }
    return 0;
};

export default getStudioLocations;
