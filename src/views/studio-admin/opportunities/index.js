// material-ui
import { Grid, Paper, Box } from '@mui/material';
import OpportunitiesEntryPage from '../../../components/EntryPages/opportunities';

// project imports

// ==============================|| FrontDesk Page ||============================== //

const Opportunities = () => {
    console.log('opportunities page');
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
                        <OpportunitiesEntryPage />
                    </Grid>
                </Box>
            </Grid>
        </Paper>
    );
};

export default Opportunities;
