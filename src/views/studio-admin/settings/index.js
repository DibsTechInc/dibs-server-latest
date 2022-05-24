// material-ui
import { Grid, Paper, Box } from '@mui/material';
import SettingsEntryPage from '../../../components/EntryPages/settings';

// project imports

// ==============================|| FrontDesk Page ||============================== //

const Settings = () => (
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
                    <SettingsEntryPage />
                </Grid>
            </Box>
        </Grid>
    </Paper>
);

export default Settings;
