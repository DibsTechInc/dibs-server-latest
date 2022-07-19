// material-ui
import propTypes from 'prop-types';
import { Grid, Typography, Stack, Fade } from '@mui/material';
import DatePicker from 'shared/components/DatePicker/datePickerNormal';

// ==============================|| SUBCOMPONENT OF REPORTS - CHOOSE DATE OPTIONS ||============================== //

const ChooseDateOptions = ({ dateRange, setStartDate, setEndDate }) => {
    if (dateRange === 'custom') {
        return (
            <Fade in>
                <Grid container spacing={2}>
                    <Grid item sx={{ mt: 3, mr: 1 }}>
                        <Stack direction="column">
                            <Typography gutterBottom variant="h7">
                                Start Date
                            </Typography>
                            <DatePicker setDate={setStartDate} type="start" />
                        </Stack>
                    </Grid>
                    <Grid item sx={{ mt: 3 }}>
                        <Stack direction="column">
                            <Typography gutterBottom variant="h7">
                                End Date
                            </Typography>
                            <DatePicker setDate={setEndDate} type="end" />
                        </Stack>
                    </Grid>
                </Grid>
            </Fade>
        );
    }
    return null;
};
ChooseDateOptions.propTypes = {
    dateRange: propTypes.string,
    setStartDate: propTypes.func,
    setEndDate: propTypes.func
};

export default ChooseDateOptions;
