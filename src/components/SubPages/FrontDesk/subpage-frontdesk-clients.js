// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import ClientSearch from '../../SubComponents/FrontDesk/ClientSearch';
import NewClientAccount from '../../SubComponents/FrontDesk/NewClientAccount';

// ==============================|| SAMPLE PAGE ||============================== //

const searchGuidance = `Search by email, name, or phone number to edit client information\n and manage your client's memberships, packages, and classes.`;
const newAccountGuidance = `Create a new account for a client that isn't already in your system`;
const FrontDeskClients = () => (
    <Grid container direction="column">
        <Grid item>
            <Typography gutterBottom component="span" variant="h4">
                Search Clients
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '8px' }}>
            <Typography gutterBottom variant="h7">
                {searchGuidance}
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
                Create a new client account
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '8px' }}>
            <Typography gutterBottom variant="h7">
                {newAccountGuidance}
            </Typography>
        </Grid>
        <Grid item xs={12} sx={{ marginTop: '45px', marginBottom: '200px' }}>
            <NewClientAccount />
        </Grid>
    </Grid>
);

export default FrontDeskClients;
