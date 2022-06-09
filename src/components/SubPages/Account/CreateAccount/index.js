// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import CreateAccount from './createAccount';

// ==============================|| STUDIO ADMIN -> ACCOUNT -> CREATE ACCOUNT ||============================== //

const CreateAccountPage = () => (
    // eslint-disable-next-line camelcase
    <Grid container direction="column">
        <Grid item xs={7}>
            <Typography gutterBottom variant="h4">
                Create Employee & Instructor Accounts
            </Typography>
        </Grid>
        <Grid item xs={7} sx={{ mt: 2 }}>
            <CreateAccount />
        </Grid>
    </Grid>
);
export default CreateAccountPage;
