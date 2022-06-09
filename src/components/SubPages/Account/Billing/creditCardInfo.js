/* eslint-disable camelcase */
import { Grid, Divider, Typography, Stack } from '@mui/material';

import { useSelector } from 'store';
import StudioCardPayments from 'helpers/stripe/StudioCardPayments';
import BillingContactInfo from './billingContactInfo';

const StudioCreditCardInfo = () => {
    const { studioConfig } = useSelector((state) => state.dibsstudio);
    const { billing } = studioConfig;
    const { stripeid, stripe_cardid, subscription_fee, total_monthly_charge, date_of_charge, billing_contact, billing_email } = billing;
    const billingtext = stripe_cardid !== null ? '' : 'Please enter your card information below.';
    const getDateString = (chargedate) => {
        let dateString = '';

        if (chargedate === 1) {
            dateString = '1st';
        } else if (chargedate === 2) {
            dateString = '2nd';
        } else if (chargedate === 3) {
            dateString = '3rd';
        } else {
            dateString = `${chargedate}th`;
        }
        return dateString;
    };
    const getMoneyString = (money) => {
        const moneyString = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(money);
        return moneyString;
    };
    const firstwords = stripe_cardid === null ? `You'll be` : `You're being`;
    const secondwords = stripe_cardid !== null ? `is` : `will be`;
    const secondText = `${firstwords} charged $${subscription_fee}/month + tax on the ${getDateString(
        date_of_charge
    )} of each month. The total charge ${secondwords} ${getMoneyString(
        total_monthly_charge
    )}. If you'd like to cancel your subscription, please contact us at studios@ondibs.com at least 10 days before your renewal date.`;
    return (
        <Grid container direction="column" sx={{ mt: 2 }}>
            <Grid item xs={5}>
                <Stack>
                    <Typography gutterBottom variant="h7">
                        {billingtext}
                    </Typography>
                    <Grid item xs={6} sx={{ mt: 1 }}>
                        <Typography gutterBottom variant="h7">
                            {secondText}
                        </Typography>
                    </Grid>
                </Stack>
            </Grid>
            <Grid item xs={7}>
                <BillingContactInfo />
            </Grid>
            <Divider />
            <Grid item xs={8}>
                <StudioCardPayments
                    stripeid={stripeid}
                    stripeCardId={stripe_cardid}
                    billingContact={billing_contact}
                    billingEmail={billing_email}
                />
            </Grid>
        </Grid>
    );
};

export default StudioCreditCardInfo;
