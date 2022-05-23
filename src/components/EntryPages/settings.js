// material-ui
import { Grid } from '@mui/material';

// project imports
import SettingsTabs from '../Tabs/SettingsTabs';
import { gridSpacing } from 'store/constant';

// ================================|| ENTRY PAGE - SETTINGS ||================================ //

const UITabs = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12}>
            <SettingsTabs />
        </Grid>
    </Grid>
);

export default UITabs;
