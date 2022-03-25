// material-ui
import { Typography, Grid, Paper, Box } from '@mui/material';
import EarningCard from '../../../components/EarningCard';
import GlanceStats from '../../../components/GlanceStats';

// project imports
import { useTheme } from '@emotion/react';

// ==============================|| Dashboard Page ||============================== //

const Dashboard = () => {
    const theme = useTheme();
    const dataValues = [
        {
            id: 1,
            title: 'Today',
            revenue: '$26',
            comparedwith: 'yesterday'
        },
        {
            id: 2,
            title: 'This week',
            revenue: '$250',
            comparedwith: 'last week'
        },
        {
            id: 3,
            title: 'This month',
            revenue: '12829',
            comparedwith: 'lastmonth'
        },
        {
            id: 4,
            title: 'This year',
            revenue: '57622',
            comparedwith: 'lastmonth'
        }
    ];
    console.log('data-values');
    console.log(JSON.stringify(dataValues));
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
                        marginTop: '50px',
                        marginLeft: '35px',
                        marginRight: '20px',
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%'
                    }}
                >
                    <Grid item xs={9} sx={{ marginRight: '30px' }}>
                        <Typography gutterBottom variant="h3">
                            SALES REVENUE
                        </Typography>
                        <Typography gutterBottom variant="h6">
                            Revenue generated from purchases (retail, package, classes).
                        </Typography>
                        <Grid container spacing={2}>
                            {dataValues.map((value, i) => (
                                <Grid key={i} item xs={3} sx={{ marginTop: '20px' }}>
                                    <EarningCard title={value.title} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography gutterBottom variant="h3">
                            MARCH SUMMARY
                        </Typography>
                        <GlanceStats />
                    </Grid>
                </Box>
            </Grid>
        </Paper>
    );
};

export default Dashboard;
