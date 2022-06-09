// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import { useSelector } from 'store';
import CreditCardInfo from './creditCardInfo';

// ==============================|| STUDIO ADMIN -> SETTINGS -> GENERAL ||============================== //

const AccountBillingPage = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    // eslint-disable-next-line camelcase
    return (
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
};

export default AccountBillingPage;
