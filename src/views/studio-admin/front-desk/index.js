// material-ui
import { Typography, Grid, Paper, Box } from '@mui/material';
import Divider from '@mui/material/Divider';
import EarningCard from '../../../components/EarningCard';
import GlanceStats from '../../../components/GlanceStats';
import SalesRevenueChart from '../../../components/SalesRevenueChart';
import ActiveClientChart from '../../../components/ActiveClientChart';
import RevenuePerCustomer from '../../../components/RevenuePerCustomer';

// project imports

// ==============================|| FrontDesk Page ||============================== //

const FrontDesk = () => {
    console.log('front desk page');
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
                    <Grid item xs={12}>
                        Stuff goes here
                    </Grid>
                </Box>
            </Grid>
        </Paper>
    );
};

export default FrontDesk;
