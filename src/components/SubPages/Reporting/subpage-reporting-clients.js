// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import ClientSearch from '../../SubComponents/FrontDesk/ClientSearch';
import ExistingClasses from '../../SubComponents/FrontDesk/ExistingClasses';

// ==============================|| SAMPLE PAGE ||============================== //

const newClassGuidance = `Clients report data.`;
const newAccountGuidance = `Clients Report Stuff`;
const ReportingClientsReports = () => (
    <Grid container xs={12} direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                View Clients Reports - TO DO
            </Typography>
        </Grid>
        <Grid container xs={10} sx={{ marginTop: '8px' }}>
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
                Report Data - Clients Data will appear here
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

export default ReportingClientsReports;
