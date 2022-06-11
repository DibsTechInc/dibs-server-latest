// material-ui
import { Grid, Typography } from '@mui/material';

// project imports
import ManageAccountsComponent from './manageAccounts';

// ==============================|| STUDIO ADMIN -> ACCOUNT -> CREATE ACCOUNT ||============================== //

const ManageAccounts = () => (
    // eslint-disable-next-line camelcase
    <Grid container direction="column">
        <Grid item xs={7}>
            <Typography gutterBottom variant="h4">
                Manage Employee & Instructor Accounts
            </Typography>
        </Grid>
        <Grid item xs={7} sx={{ mt: 2 }}>
            <ManageAccountsComponent />
        </Grid>
    </Grid>
);
export default ManageAccounts;
