import axios from 'axios';

// ==============================|| GET CLIENT TRANSACTIONS DATA ||============================== //

export const getClientTransactions = async (dibsStudioId, userid, type) => {
    try {
        console.log(`getClientTransactions actions call`);
        console.log(`dibsStudioId is: ${dibsStudioId}`);
        console.log(`userid: ${userid}`);
        console.log(`type: ${type}`);
        const clientTransactions = await axios.post(`/api/transactions/${type}`, {
            dibsStudioId,
            userid
        });
        console.log(`\n\n\nclientTransactions for ${type} are: \n\n${JSON.stringify(clientTransactions)}`);
        const valuestosend = {
            data: clientTransactions.data
        };
        return { msg: 'success', data: valuestosend.data };
    } catch (err) {
        console.log(`error getting client transactions data for studioid: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default getClientTransactions;
