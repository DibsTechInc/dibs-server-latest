import axios from 'axios';
import moment from 'moment-timezone';
import { useDispatch } from 'store';

// ==============================|| RUN REPORT FOR STUDIO ||============================== //

const getDescription = (type, row) => {
    if (type === 'retail') {
        const retailItem = row.description.substring(34);
        return `Retail: ${retailItem}`;
    }
    if (type === 'class') {
        return 'Single Class';
    }
    if (type === 'pack') {
        return row.package.name;
    }
    if (type === 'gift') {
        return 'Gift Card';
    }
    if (type === 'credit') {
        return 'Credit Purchase';
    }
    return null;
};
const formatToDollars = (num) => {
    const todayspendformatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
        // maximumFractionDigits: 0,
        // minimumFractionDigits: 0
    }).format(num);
    return todayspendformatted;
};

export const RunSalesSummaryReport = async (dibsStudioId, salesInfo) => {
    try {
        const response = await axios.post('/api/studio/reporting/get-sales-summary-data', {
            dibsStudioId,
            salesInfo
        });
        if (response.data.success) {
            const { returnValues } = response.data;
            return {
                msg: 'success',
                summaryData: returnValues
            };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error running report for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default RunSalesSummaryReport;
