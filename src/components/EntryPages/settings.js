// material-ui
import { Grid } from '@mui/material';

// project imports
// import InstructorsTabs from '../Tabs/InstructorsTabs';
import { gridSpacing } from 'store/constant';

// ================================|| UI TABS ||================================ //

const SettingsEntryPage = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12}>
            Settings Page Goes Here
        </Grid>
    </Grid>
);

export default SettingsEntryPage;
