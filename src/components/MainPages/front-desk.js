// material-ui
import { Grid } from '@mui/material';

// project imports
import ColorTabs from '../Tabs/FrontDeskTabs';
import { gridSpacing } from 'store/constant';

// ================================|| UI TABS ||================================ //

const UITabs = () => (
    <Grid container spacing={gridSpacing}>
        <Grid item xs={12} md={12}>
            <ColorTabs />
        </Grid>
    </Grid>
);

export default UITabs;
