import axios from 'axios';

// ==============================|| GET FLASH CREDIT STATUS FOR STUDIO ||============================== //

export const GetFlashCreditStatus = async (dibsStudioId) => {
    try {
        let flashcreditstatus = false;
        await axios
            .post('/api/studio/settings/flash-credits', {
                dibsStudioId
            })
            .then((res) => {
                const { data } = res;
                const { status } = data;
                flashcreditstatus = status;
            });
        return { msg: 'success', fc: flashcreditstatus };
    } catch (err) {
        console.log(`error getting flash credit status data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetFlashCreditStatus;
