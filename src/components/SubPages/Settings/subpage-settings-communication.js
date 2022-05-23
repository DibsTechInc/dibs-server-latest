// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports

// ==============================|| STUDIO ADMIN -> SETTINGS -> COMMUNICATION ||============================== //

const CommunicationSettingsPage = () => (
    <Grid container direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                Communication Settings
            </Typography>
        </Grid>
        <Grid item xs={5}>
            <Typography gutterBottom variant="h6">
                customer service email & phone
            </Typography>
            <Typography gutterBottom variant="h6">
                custom sending domain
            </Typography>
            <Typography gutterBottom variant="h6">
                address
            </Typography>
            <Typography gutterBottom variant="h6">
                terms
            </Typography>
            <Typography gutterBottom variant="h6">
                hero_url
            </Typography>
            <Typography gutterBottom variant="h6">
                color logo
            </Typography>
        </Grid>
    </Grid>
);

export default CommunicationSettingsPage;
