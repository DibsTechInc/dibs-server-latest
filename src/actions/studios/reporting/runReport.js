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

export const RunSalesReport = async (dibsStudioId, salesInfo, timeZone) => {
    try {
        const datatoreturn = [];
        const response = await axios.post('/api/studio/reporting/get-sales-data', {
            dibsStudioId,
            salesInfo
        });
        if (response.data.success) {
            response.data.reportData.forEach((row) => {
                const saleDate = moment(row.saleDate).tz(timeZone).format('M/D/YY');
                console.log(`row for this user is: ${JSON.stringify(row)}`);
                const { email } = row.user;
                const finalPrice = row.original_price - row.discount_amount + row.tax_amount;
                const grossRev = finalPrice - row.creditApplied;
                const netRev = grossRev - row.stripe_fee - row.dibs_fee;
                const rowData = [
                    row.id,
                    saleDate,
                    email,
                    getDescription(row.type, row),
                    formatToDollars(row.original_price),
                    formatToDollars(row.discount_amount),
                    formatToDollars(finalPrice),
                    formatToDollars(row.creditApplied),
                    formatToDollars(grossRev),
                    formatToDollars(netRev)
                ];
                datatoreturn.push(rowData);
            });
            return {
                msg: 'success',
                reportData: datatoreturn
            };
        }
        console.log(`Run Report Data Returned: ${JSON.stringify(response)}`);
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error running report for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default RunSalesReport;
