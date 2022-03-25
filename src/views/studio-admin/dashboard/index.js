// material-ui
import { Typography, Grid, Paper, Box } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import EarningCard from 'components/EarningCard';
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
                        m: 2,
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
                        <EarningCard />
                    </Grid>
                </Box>
            </Grid>
        </Paper>
    );
};

export default Dashboard;
