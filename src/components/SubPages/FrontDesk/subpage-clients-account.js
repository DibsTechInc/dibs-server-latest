// material-ui
import { Grid } from '@mui/material';

// project imports
// import InstructorsTabs from '../Tabs/InstructorsTabs';
import { gridSpacing } from 'store/constant';
import ClientAccountTabs from '../../Tabs/ClientAccountTabs';

// ================================|| UI TABS ||================================ //

const ClientAccountPage = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12}>
            <ClientAccountTabs />
        </Grid>
    </Grid>
);

export default ClientAccountPage;
