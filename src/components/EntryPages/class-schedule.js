// material-ui
import { Grid } from '@mui/material';

// project imports
// import InstructorsTabs from '../Tabs/InstructorsTabs';
import { gridSpacing } from 'store/constant';

// ================================|| UI TABS ||================================ //

const ClassScheduleEntryPage = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12}>
            Class Schedule Page Goes Here
        </Grid>
    </Grid>
);

export default ClassScheduleEntryPage;
