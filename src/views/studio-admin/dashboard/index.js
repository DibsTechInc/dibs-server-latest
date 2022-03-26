// material-ui
import { Typography, Grid, Paper, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import EarningCard from '../../../components/EarningCard';
import GlanceStats from '../../../components/GlanceStats';
import SalesRevenueChart from '../../../components/SalesRevenueChart';
import ActiveClientChart from '../../../components/ActiveClientChart';
import RevenuePerCustomer from '../../../components/RevenuePerCustomer';

// project imports
import { useTheme } from '@emotion/react';

// ==============================|| Dashboard Page ||============================== //

const Dashboard = () => {
    const theme = useTheme();
    const dataValues = [
        {
            id: 1,
            title: 'TODAY',
            revenue: '$26',
            up: 0,
            comparedwith: 'yesterday',
            percentage: 2
        },
        {
            id: 2,
            title: 'WEEK-TO-DATE',
            revenue: '$250',
            up: 1,
            comparedwith: 'last week',
            percentage: 32
        },
        {
            id: 3,
            title: 'MONTH-TO-DATE',
            revenue: '$12,829',
            up: 0,
            comparedwith: 'lastmonth',
            percentage: 12
        },
        {
            id: 4,
            title: 'YEAR-TO-DATE',
            revenue: '$57,622',
            up: 1,
            comparedwith: 'lastmonth',
            percentage: 87
        }
    ];
    console.log('data-values');
    console.log(JSON.stringify(dataValues));
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
                        <Grid container spacing={2}>
                            {dataValues.map((value, i) => (
                                <Grid key={i} item xs={3} sx={{ marginTop: '40px' }}>
                                    <EarningCard
                                        title={value.title}
                                        revenue={value.revenue}
                                        stateUp={value.up}
                                        percentage={value.percentage}
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
