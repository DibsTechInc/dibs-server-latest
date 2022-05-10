import axios from 'axios';

// ==============================|| GET USER UPCOMING CLASSES DATA ||============================== //

export const getUpcomingClassesDB = async (userid, dibsStudioId) => {
    try {
        console.log('getUpcomingClassesDB is running');
        const response = await axios.post('/api/get-upcoming-classes', {
            userid,
            dibsStudioId
        });
        console.log('line12');
        // console.log(`\n\n\nresponse from GET CURRENT CLIENT INFO WAS CALLED: ${JSON.stringify(response.data)}\n\n\n`);
        console.log(`response from getUpcomingClasses API Call = ${JSON.stringify(response.data)}`);
        const datetotest = new Date();
        const timetotest = datetotest.getTime();
        console.log(`time = ${timetotest}`);
        if (response.data.msg === 'success' && response.data.upcomingClasses) return response.data.upcomingClasses;
        return 0;
    } catch (err) {
        console.log(`error getting getUpcomingClassesDB. Error is: ${err}`);
    }
    return 0;
};

export default getUpcomingClassesDB;
