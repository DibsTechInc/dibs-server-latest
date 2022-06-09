import axios from 'axios';
import { allLowerCase } from 'helpers/general';

// ==============================|| UPDATE BILLING CONTACT ACCOUNT ||============================== //

export const UpdateBillingContact = async (dibsStudioId, billingContact, billingEmail) => {
    try {
        const billingEmailNew = allLowerCase(billingEmail);
        const response = await axios.post('/api/studio/account/update-billing-contact', {
            dibsStudioId,
            billingContact,
            billingEmail: billingEmailNew
        });
        if (response.data.msg === 'success') {
            return { msg: 'success' };
        }
        return { msg: 'failure', error: response.data.error };
    } catch (err) {
        console.log(`error updating billing contact data for employeeId: ${dibsStudioId}\nerr is: ${err}`);
    }
    return 0;
};

export default UpdateBillingContact;
