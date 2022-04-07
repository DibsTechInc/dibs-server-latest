import * as React from 'react';

// material-ui
import { Typography, Grid, Paper, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import EarningCard from '../../../components/EarningCard';
import GlanceStats from '../../../components/GlanceStats';
import SalesRevenueChart from '../../../components/SalesRevenueChart';
import ActiveClientChart from '../../../components/ActiveClientChart';
import RevenuePerCustomer from '../../../components/RevenuePerCustomer';
import getDashboardData from '../../../actions/studios/getDashboardData';
import getXAxisCategories from '../../../actions/studios/getXAxisCategories';
// import { getDashboardRevenue } from '../../../store/slices/dashboard';
import { addRevenueDataToDashboard, addXAxisDataToDashboard } from '../../../store/slices/dashboard';

// project imports
import { useDispatch, useSelector } from 'store';

// ==============================|| Dashboard Page ||============================== //

const Dashboard = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const valuesfordashboard = useSelector((state) => state.dashboard);
    const { revenuetotals } = valuesfordashboard;
    const dispatch = useDispatch();
    React.useEffect(() => {
        getDashboardData(config.dibsStudioId).then((result) => {
            dispatch(addRevenueDataToDashboard(result.data));
        });
        getXAxisCategories(config.dibsStudioId)
            .then((result) => {
                console.log(`result is: ${JSON.stringify(result)}`);
                dispatch(addXAxisDataToDashboard(result));
            })
            .catch((err) => {
                console.log(`error getting x-axis categories: ${err}`);
            });
    }, [config.dibsStudioId, dispatch]);
    const textGraph = `The total spend per active client over a given period of time (monthly, 90 days, annual, lifetime)`;
    const friendReferralText = `See how many friends have been referred and see how much each referral is worth on a monthly annual basis.`;
    const topfans = `Track your top clients' activity`;
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
                    <Grid item xs={9} sx={{ marginRight: '120px' }}>
                        <Typography gutterBottom variant="h3">
                            SALES REVENUE
                        </Typography>
                        <Typography gutterBottom variant="h6">
                            Revenue generated from purchases (retail, package, classes).
                        </Typography>
                        <Grid container spacing={1.7}>
                            {revenuetotals.map((value, i) => (
                                <Grid key={i} item xs={4} md={2.3} lg={3} sx={{ marginTop: '40px', alignItems: 'left' }}>
                                    <EarningCard
                                        title={value.label}
                                        revenue={value.value}
                                        stateUp={value.up}
                                        percentage={value.percentage}
                                        comparison={value.comparedwith}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sx={{ marginTop: '60px' }}>
                                <Typography gutterBottom variant="h3">
                                    SALES REVENUE TRENDS
                                </Typography>
                                <Typography gutterBottom variant="h6">
                                    How your sales are performing over time.
                                </Typography>
                                <Grid container>
                                    <Grid item xs={12} sx={{ marginTop: '15px' }}>
                                        <SalesRevenueChart />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: '110px' }}>
                                <Typography gutterBottom variant="h3">
                                    CLIENT TRENDS - # OF ACTIVE CUSTOMERS
                                </Typography>
                                <Typography gutterBottom variant="h6">
                                    The total # of unique clients that visit your studio in any given period.
                                </Typography>
                                <Grid container>
                                    <Grid item xs={12} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12} sx={{ marginTop: '60px' }}>
                                        <Typography gutterBottom variant="h3">
                                            CLIENT TRENDS - REVENUE PER CLIENT
                                        </Typography>
                                        <Typography gutterBottom variant="h6">
                                            {textGraph}
                                        </Typography>
                                        <Grid container>
                                            <Grid item xs={12} sx={{ marginTop: '15px' }}>
                                                <RevenuePerCustomer />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: '110px' }}>
                                <Typography gutterBottom variant="h3">
                                    CLASS STATISTICS (Avg utilization & Revenue per class - make graph smaller - maybe even a line graph)
                                </Typography>
                                <Typography gutterBottom variant="h6">
                                    A closer look at your class trends, broken down by week, month, or year.
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                    <Grid item xs={6} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: '110px' }}>
                                <Typography gutterBottom variant="h3">
                                    FRIEND REFERRALS
                                </Typography>
                                <Typography gutterBottom variant="h6">
                                    {friendReferralText}
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                    <Grid item xs={6} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: '110px' }}>
                                <Typography gutterBottom variant="h3">
                                    MOST POPULAR CLASSES & INSTRUCTORS
                                </Typography>
                                <Typography gutterBottom variant="h6">
                                    Top classes - average revenue per week & most popular instructor by week - tile
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                    <Grid item xs={6} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sx={{ marginTop: '110px' }}>
                                <Typography gutterBottom variant="h3">
                                    YOUR BIGGEST FANS (list of top clients)
                                </Typography>
                                <Typography gutterBottom variant="h6">
                                    {topfans}
                                </Typography>
                                <Grid container spacing={1}>
                                    <Grid item xs={6} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                    <Grid item xs={6} sx={{ marginTop: '15px' }}>
                                        <ActiveClientChart />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid sx={{ marginTop: '100px' }}>
                            <Divider />
                        </Grid>
                    </Grid>
                    <Grid item xs={3} sx={{ marginRight: '20px' }}>
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
