// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import ClientSearch from '../../SubComponents/FrontDesk/ClientSearch';
import ExistingClasses from '../../SubComponents/FrontDesk/ExistingClasses';

// ==============================|| SAMPLE PAGE ||============================== //

const newClassGuidance = `Sales report data.`;
const newAccountGuidance = `Sales Report Stuff`;
const ReportingSalesReports = () => (
    <Grid container direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                View Sales Reports - TO DO
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
                Report Data - Data will appear here
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

export default ReportingSalesReports;
