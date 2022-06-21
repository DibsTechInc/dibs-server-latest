// material-ui
import { Grid, Typography, Divider } from '@mui/material';

// project imports
import AccountInfo from './accountInfo';
import ChangePassword from './changePassword';
import AccountStatus from './accountStatus';

// ==============================|| STUDIO ADMIN -> ACCOUNT -> GENERAL ||============================== //

const GeneralAccountPage = () => (
    <Grid container direction="column">
        <Grid item xs={5}>
            <Typography gutterBottom variant="h4">
                My Account Information
            </Typography>
        </Grid>
        <AccountInfo />
        <Divider />
        <Grid item xs={5}>
            <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                <Grid item xs={5}>
                    <Typography gutterBottom variant="h5">
                        Change My password
                    </Typography>
                </Grid>
                <Grid item xs={12} sx={{ mt: 4 }}>
                    <ChangePassword />
                </Grid>
            </Grid>
        </Grid>
        <Divider />
        <Grid item xs={5}>
            <Grid item xs={12} sx={{ marginTop: 4, marginBottom: 4 }}>
                <Grid item xs={8}>
                    <Typography gutterBottom variant="h5">
                        My Account Privileges
                    </Typography>
                </Grid>
                <Grid item xs={8} sx={{ mt: 3 }}>
                    <AccountStatus />
                </Grid>
            </Grid>
        </Grid>
    </Grid>
);

export default GeneralAccountPage;
