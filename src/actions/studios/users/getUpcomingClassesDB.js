import axios from 'axios';

// ==============================|| GET USER UPCOMING CLASSES DATA ||============================== //

export const getUpcomingClassesDB = async (userid, dibsStudioId) => {
    try {
        const response = await axios.post('/api/get-upcoming-classes', {
            userid,
            dibsStudioId
        });
        if (response.data.msg === 'success' && response.data.upcomingClasses) return response.data.upcomingClasses;
        return 0;
    } catch (err) {
        console.log(`error getting getUpcomingClassesDB. Error is: ${err}`);
    }
    return 0;
};

export default getUpcomingClassesDB;
