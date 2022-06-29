// material-ui
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Grid, Typography, Divider, Stack } from '@mui/material';
import ToggleButton from 'shared/components/Button/toggleButton';
import ChooseDateOptions from 'components/SubComponents/Reporting/ChooseDateOptions';

// project imports
import ExistingClasses from '../../SubComponents/FrontDesk/ExistingClasses';
import DropDownMenu from 'shared/components/TextField/DropDownOutlined';
import { useSelector } from 'store';

// ==============================|| SALES REPORTS ||============================== //

const menuOptions = [
    { value: 'groupedcategories', label: 'Grouped By Category' },
    { value: 'orderedbydate', label: 'Ordered By Date' }
];
const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' },
    { value: 'custom', label: 'Custom' }
];
const widthNumber = 250;

const ReportingSalesReports = () => {
    const { studioConfig } = useSelector((state) => state.dibsstudio);
    const { timeZone } = studioConfig;
    const [salesCategory, setSalesCategory] = useState(menuOptions[0].label);
    const [salesValue, setSalesValue] = useState(menuOptions[0].value);
    const [dateRange, setDateRange] = useState(dateOptions[0].value);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    console.log(`\n\n\n\n\nstartDate is: ${startDate}`);
    console.log(`endDate is: ${endDate}`);
    const handleOptionChange = (e) => {
        setSalesCategory(e.target.value);
        menuOptions.forEach((option) => {
            if (option.value === e.target.value) {
                setSalesCategory(option.label);
                setSalesValue(e.target.value);
            }
        });
    };
    useEffect(() => {
        const setFormattedStartDate = (daysToSubtract) => {
            const datetouse = moment().tz(timeZone);
            setStartDate(moment(datetouse).subtract(daysToSubtract, 'days').startOf('day').utc().format('YYYY-MM-DD HH:mm:ss'));
        };
        const setFormattedEndDate = (daysToSubtract) => {
            const datetouse = moment().tz(timeZone);
            setEndDate(moment(datetouse).subtract(daysToSubtract, 'days').endOf('day').utc().format('YYYY-MM-DD HH:mm:ss'));
        };
        const getStartEndDate = (dateRange) => {
            if (dateRange === 'today') {
                setFormattedStartDate(0);
                setFormattedEndDate(0);
            } else if (dateRange === 'yesterday') {
                setFormattedStartDate(1);
                setFormattedEndDate(1);
            } else if (dateRange === '30days') {
                setFormattedStartDate(30);
                setFormattedEndDate(1);
            } else if (dateRange === '90days') {
                setFormattedStartDate(90);
                setFormattedEndDate(1);
            }
        };
        getStartEndDate(dateRange);
    }, [dateRange, timeZone]);
    return (
        <Grid container direction="column">
            <Grid item xs={5}>
                <Typography gutterBottom variant="h4">
                    View Sales Reports
                </Typography>
            </Grid>
            <Grid item sx={{ mt: 2 }}>
                <DropDownMenu options={menuOptions} valueString={salesValue} widthNumber={widthNumber} onChange={handleOptionChange} />
            </Grid>
            <Grid item sx={{ mt: 3 }}>
                <Typography gutterBottom variant="h6">
                    Date Range
                </Typography>
            </Grid>
            <Grid item sx={{ mt: 1 }}>
                <Stack direction="row" justifyContent="flex-start" alignItems="center" spacing={2}>
                    <ToggleButton choices={dateOptions} setDateRange={setDateRange} />
                </Stack>
            </Grid>
            <ChooseDateOptions dateRange={dateRange} setStartDate={setStartDate} setEndDate={setEndDate} />
            <Grid item sx={{ marginTop: '60px' }}>
                <Divider variant="fullWidth" />
            </Grid>
            <Grid item sx={{ marginTop: '60px' }}>
                <Typography gutterBottom variant="h4">
                    Report Data - Data will appear here
                </Typography>
            </Grid>
            <Grid item sx={{ marginTop: '45px', marginBottom: '200px' }}>
                <ExistingClasses />
            </Grid>
        </Grid>
    );
};

export default ReportingSalesReports;
