// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ClientSearch from '../ClientSearch';

// ==============================|| SAMPLE PAGE ||============================== //

const searchGuidance = `Search by email, name, or phone number to edit client information and manage your client's memberships, packages, and classes.`;
const FrontDeskClients = () => (
    <Grid container xs={12} direction="column">
        <Grid item>
            <Typography gutterBottom variant="h3">
                Search Clients
            </Typography>
        </Grid>
        <Grid item>
            <Typography gutterBottom variant="h6">
                {searchGuidance}
            </Typography>
        </Grid>
        <ClientSearch />
    </Grid>
);

export default FrontDeskClients;
