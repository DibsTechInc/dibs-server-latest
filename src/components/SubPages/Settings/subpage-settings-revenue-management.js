// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports

// ==============================|| STUDIO ADMIN -> SETTINGS -> REVENUE MANAGEMENT ||============================== //

const RevenueManagementSettingsPage = () => (
    <Grid container direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                Revenue Management Settings
            </Typography>
        </Grid>
        <Grid item xs={5}>
            <Typography gutterBottom variant="h6">
                Dynamic pricing
            </Typography>
            <Typography gutterBottom variant="h6">
                Min price/Max price
            </Typography>
            <Typography gutterBottom variant="h6">
                Flash credits
            </Typography>
        </Grid>
    </Grid>
);

export default RevenueManagementSettingsPage;
