// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import PromoCodeSearch from '../../SubComponents/FrontDesk/PromoCodes/searchExistingPromoCodes';
import ExistingPromoCodes from '../../SubComponents/FrontDesk/PromoCodes/ExistingPromoCodes';

// ==============================|| PROMO CODE PAGE ||============================== //

const guidance = `To create a new promo code, enter the text that you'd like to use for the code.`;
const newAccountGuidance = `Here is a list of the promo codes that you've already created. Click on a promo code below to deactivate the code. To edit existing promo codes, deactivate the code and create a new code with the same name.`;
const FrontDeskPromoCodes = () => (
    <Grid container direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                Create A New Promo Code
            </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: '8px' }}>
            <Typography gutterBottom variant="h7">
                {guidance}
            </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: '40px' }}>
            <PromoCodeSearch />
        </Grid>
        <Grid item sx={{ marginTop: '60px' }}>
            <Divider variant="fullWidth" />
        </Grid>
        <Grid item sx={{ marginTop: '60px' }}>
            <Typography gutterBottom variant="h4">
                Active Promo Codes
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '8px' }}>
            <Typography gutterBottom variant="h7">
                {newAccountGuidance}
            </Typography>
        </Grid>
        <Grid item xs={9} sx={{ marginTop: '45px', marginBottom: '200px' }}>
            <ExistingPromoCodes />
        </Grid>
    </Grid>
);

export default FrontDeskPromoCodes;
