// material-ui
import { Grid, Paper, Box } from '@mui/material';
import ClassScheduleEntryPage from '../../../components/EntryPages/class-schedule';

// project imports

// ==============================|| FrontDesk Page ||============================== //

const ClassSchedule = () => {
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
                        <ClassScheduleEntryPage />
                    </Grid>
                </Box>
            </Grid>
        </Paper>
    );
};

export default ClassSchedule;
