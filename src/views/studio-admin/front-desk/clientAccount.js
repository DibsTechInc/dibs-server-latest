// material-ui
import { Grid, Paper, Box } from '@mui/material';
import ClientAccountContent from '../../../components/SubPages/FrontDesk/subpage-clients-account';

// project imports

// ==============================|| FrontDesk Page ||============================== //

const ClientAccountPage = () => {
    console.log('Client Account Page');

    return (
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
                        <ClientAccountContent />
                    </Grid>
                </Box>
            </Grid>
        </Paper>
    );
};

export default ClientAccountPage;
