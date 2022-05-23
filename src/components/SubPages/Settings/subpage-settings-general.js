// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import ClientSearch from '../../SubComponents/FrontDesk/ClientSearch';
import ExistingClasses from '../../SubComponents/FrontDesk/ExistingClasses';

// ==============================|| STUDIO ADMIN -> SETTINGS -> GENERAL ||============================== //

const GeneralSettingsPage = () => (
    <Grid container direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                General Studio Settings
            </Typography>
        </Grid>
        <Grid item xs={5}>
            <Typography gutterBottom variant="h6">
                widget color
            </Typography>
            <Typography gutterBottom variant="h6">
                # of days to show on calendar
            </Typography>
            <Typography gutterBottom variant="h6">
                default price per class (min and max if dynamic pricing is set)
            </Typography>
            <Typography gutterBottom variant="h6">
                friend referral
            </Typography>
            <Typography gutterBottom variant="h6">
                sales tax
            </Typography>
            <Typography gutterBottom variant="h6">
                retail sales tax
            </Typography>
            <Typography gutterBottom variant="h6">
                display gift cards
            </Typography>
            <Typography gutterBottom variant="h6">
                domain
            </Typography>
            <Typography gutterBottom variant="h6">
                cancel time
            </Typography>
            <Typography gutterBottom variant="h6">
                requires waiver
            </Typography>
        </Grid>
    </Grid>
);

export default GeneralSettingsPage;
