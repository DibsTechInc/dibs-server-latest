// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ClientSearch from '../ClientSearch';

// ==============================|| SAMPLE PAGE ||============================== //

const searchGuidance = `Search by email, name, or phone number to edit client information\n and manage your client's memberships, packages, and classes.`;
const FrontDeskClients = () => (
    <Grid container xs={12} direction="column">
        <Grid item>
            <Typography gutterBottom variant="h4">
                Search Clients
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '8px' }}>
            <Typography gutterBottom variant="h7">
                {searchGuidance}
            </Typography>
        </Grid>
        <Grid item sx={{ marginTop: '25px' }}>
            <ClientSearch />
        </Grid>
    </Grid>
);

export default FrontDeskClients;
