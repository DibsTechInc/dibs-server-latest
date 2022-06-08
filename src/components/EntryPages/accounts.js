// material-ui
import { Grid } from '@mui/material';

// project imports
import AccountTabs from '../Tabs/StudioAccountTabs';
import { gridSpacing } from 'store/constant';

// ================================|| ENTRY PAGE - STUDIO ACCOUNT ||================================ //

const UITabs = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12}>
            <AccountTabs />
        </Grid>
    </Grid>
);

export default UITabs;
