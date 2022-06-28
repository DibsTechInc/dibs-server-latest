import axios from 'axios';
import moment from 'moment-timezone';

// ==============================|| GET ACTIVE PROMO CODES FOR STUDIO ||============================== //

export const GetActivePromoCodes = async (dibsStudioId) => {
    try {
        const promostoreturn = [];
        const promoDataNoKeys = [];
        const response = await axios.post('/api/studio/promo-codes/get-active', {
            dibsStudioId
        });
        const getFormattedPromoApplication = (product) => {
            if (product === 'UNIVERSAL') {
                return 'Universal';
            }
            if (product === 'RETAIL') {
                return 'Retail';
            }
            if (product === 'PACKAGE') {
                return 'All Memberships & Packages';
            }
            return 'Classes';
        };
        const formatNumber = (num) => {
            if (num === null) return 'No Limit';
            const str = num.toLocaleString('en-US');
            return str;
        };
        if (response.data.msg === 'success') {
            const promocodes = response.data.promocodes;
            await promocodes.map((promo) => {
                const perPers = formatNumber(promo.perPersonLimit);
                const totalUsage = formatNumber(promo.totalUsageLimit);
                const newpromo = {
                    id: promo.id,
                    code: promo.code,
                    amountToDisplay: promo.type === 'PERCENT_OFF' ? `${promo.amount}%` : `$${promo.amount}`,
                    expires: moment(promo.expiration).format('M/D/YYYY'),
                    productToDisplay: getFormattedPromoApplication(promo.product),
                    perPersonLimit: promo.perPersonLimit || 'No limit',
                    totalUsageLimit: promo.totalUsageLimit || 'No limit',
                    firstTimeStudio: promo.firstTimeStudio
                };
                const newpromoNoKeys = [
                    promo.id,
                    promo.code,
                    promo.type === 'PERCENT_OFF' ? `${promo.amount}%` : `$${promo.amount}`,
                    moment(promo.expiration).format('M/D/YYYY'),
                    getFormattedPromoApplication(promo.product),
                    perPers,
                    totalUsage,
                    promo.firstTimeStudio ? 'First Time Only' : 'All Clients'
                ];
                promostoreturn.push(newpromo);
                promoDataNoKeys.push(newpromoNoKeys);
                return promo;
            });
            return {
                msg: 'success',
                promodata: promoDataNoKeys
            };
        }
        console.log(`Get active promo codes Error: ${JSON.stringify(response.data)}`);
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error getting active promo codes for dibsStudioId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default GetActivePromoCodes;
