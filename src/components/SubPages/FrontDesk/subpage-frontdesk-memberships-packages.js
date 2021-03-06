// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import ClientSearch from '../../SubComponents/FrontDesk/ClientSearch';
import ExistingClasses from '../../SubComponents/FrontDesk/ExistingClasses';

// ==============================|| SAMPLE PAGE ||============================== //

const newClassGuidance = `If you'd like to pre-populate class settings, create a new class type. It makes it a bit faster to add new classes to your schedule. Note: This is optional.`;
const newAccountGuidance = `Here is a list of the classes that you've already created. Click on a class below to make edits.`;
const FrontDeskClients = () => (
    <Grid container direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                Create A New Membership or Package
            </Typography>
        </Grid>
        <Grid container sx={{ marginTop: '8px' }}>
            <Typography gutterBottom variant="h7">
                {newClassGuidance}
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '45px' }}>
            <ClientSearch />
        </Grid>
        <Grid item sx={{ marginTop: '60px' }}>
            <Divider variant="fullWidth" />
        </Grid>
        <Grid item sx={{ marginTop: '60px' }}>
            <Typography gutterBottom variant="h4">
                View Your Existing Memberships
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '8px' }}>
            <Typography gutterBottom variant="h7">
                {newAccountGuidance}
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '45px', marginBottom: '200px' }}>
            <ExistingClasses />
        </Grid>
        <Grid item sx={{ marginTop: '60px' }}>
            <Divider variant="fullWidth" />
        </Grid>
        <Grid item sx={{ marginTop: '60px' }}>
            <Typography gutterBottom variant="h4">
                View Your Existing Packages
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '8px' }}>
            <Typography gutterBottom variant="h7">
                {newAccountGuidance}
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '45px', marginBottom: '200px' }}>
            <ExistingClasses />
        </Grid>
    </Grid>
);

export default FrontDeskClients;
