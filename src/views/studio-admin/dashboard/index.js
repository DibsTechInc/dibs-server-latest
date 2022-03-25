// material-ui
import { Typography, Grid, Paper, Box } from '@mui/material';

// project imports
import { useTheme } from '@emotion/react';

// ==============================|| Dashboard Page ||============================== //

const Dashboard = () => {
    const theme = useTheme();
    return (
        <Paper
            sx={{
                bgcolor: '#ffffff',
                borderRadius: 2,
                elevation: 0
            }}
        >
            <Grid container xs={12}>
                <Box
                    xs={12}
                    sx={{
                        marginTop: '20px',
                        marginLeft: '25px',
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                    }}
                >
                    <Grid item xs={9}>
                        <Typography gutterBottom variant="h3">
                            SALES REVENUE
                        </Typography>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom variant="h3">
                            SUMMARY STATS
                        </Typography>
                    </Grid>
                </Box>
            </Grid>
        </Paper>
    );
};

export default Dashboard;
