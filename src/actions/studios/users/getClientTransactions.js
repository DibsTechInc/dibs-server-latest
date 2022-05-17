import axios from 'axios';

// ==============================|| GET CLIENT TRANSACTIONS DATA ||============================== //

export const getClientTransactions = async (dibsStudioId, userid, type) => {
    try {
        const clientTransactions = await axios.post(`/api/transactions/${type}`, {
            dibsStudioId,
            userid
        });
        const { data } = clientTransactions;
        return data.data;
    } catch (err) {
        console.log(`error getting client transactions data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default getClientTransactions;
