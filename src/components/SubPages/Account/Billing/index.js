// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import CreditCardInfo from './creditCardInfo';

// ==============================|| STUDIO ADMIN -> ACCOUNT -> BILLING ||============================== //

const AccountBillingPage = () => (
    // eslint-disable-next-line camelcase
    <Grid container direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                My Billing Information
            </Typography>
        </Grid>
        <Grid item xs={5}>
            <CreditCardInfo />
        </Grid>
    </Grid>
);
export default AccountBillingPage;
