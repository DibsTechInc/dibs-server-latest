// material-ui
import { Typography, Grid } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import EarningCard from 'components/EarningCard';

// ==============================|| Dashboard Page ||============================== //

const Dashboard = () => (
    <MainCard title="Sales Revenue" xs={12}>
        <Grid container>
            <Grid item xs={3}>
                <EarningCard />
            </Grid>
            <Grid item xs={3}>
                <EarningCard />
            </Grid>
            <Grid item xs={3}>
                <EarningCard />
            </Grid>
        </Grid>
    </MainCard>
);

export default Dashboard;
