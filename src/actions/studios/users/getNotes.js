import axios from 'axios';

// ==============================|| GET CLIENT NOTES DATA ||============================== //

export const getNotes = async (userid, dibsStudioId) => {
    try {
        const response = await axios.post('/api/get-client-notes', {
            userid,
            dibsStudioId
        });
        if (response.data.msg === 'success' && response.data.clientNotes) return response.data.clientNotes;
        return 0;
    } catch (err) {
        console.log(`error getting getNotes. Error is: ${err}`);
    }
    return 0;
};

export default getNotes;
