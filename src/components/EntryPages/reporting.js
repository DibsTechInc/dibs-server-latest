// material-ui
import { Grid } from '@mui/material';

// project imports
import ReportingTabs from '../Tabs/ReportingTabs';
import { gridSpacing } from 'store/constant';

// ================================|| UI TABS ||================================ //

const UITabs = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12}>
            <ReportingTabs />
        </Grid>
    </Grid>
);

export default UITabs;
