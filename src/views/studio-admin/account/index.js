// material-ui
import { Grid, Paper, Box } from '@mui/material';
import AccountsEntryPage from '../../../components/EntryPages/accounts';

// project imports

// ==============================|| FrontDesk Page ||============================== //

const Accounts = () => (
    <Paper
        sx={{
            bgcolor: '#ffffff',
            borderRadius: 2,
            elevation: 0
        }}
    >
        <Grid container>
            <Box
                xs={12}
                sx={{
                    marginTop: '20px',
                    marginLeft: '20px',
                    marginRight: '20px',
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%'
                }}
            >
                <Grid item xs={12}>
                    <AccountsEntryPage />
                </Grid>
            </Box>
        </Grid>
    </Paper>
);

export default Accounts;
