// material-ui
import { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import { Grid, Typography, Divider, Stack } from '@mui/material';
import ToggleButton from 'shared/components/Button/toggleButton';
import ChooseDateOptions from 'components/SubComponents/Reporting/ChooseDateOptions';
import RunReportButton from 'shared/components/Button/nonSubmitButtons';
import ReportsTable from 'shared/components/Table/AttendanceReportsTable';
import SummaryForReportTable from 'shared/components/Table/SummaryForReport';
import ExportToCsv from 'shared/components/Table/ExportToCsv';
import LoaderLinear from 'shared/components/Progress/ProgressLinear';
import { setReportingDataForTable, setSummaryForTable, setCsvDataForTable } from 'store/slices/datatables';

// project imports
import LocationSelector from 'shared/components/Selectors/LocationSelectors';
import { useSelector, useDispatch } from 'store';
import RunAttendanceReport from 'actions/studios/reporting/runAttendanceReportNew';
import RunCsvReport from 'actions/studios/reporting/runCSVReport';
import RunSummaryReport from 'actions/studios/reporting/runSummaryReport';
import InfoIcon from 'shared/components/HelpInfo/infoIcon';

// ==============================|| SALES REPORTS ||============================== //

const menuOptions = [{ value: '999', label: 'All Locations' }];
const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: '7days', label: '7 Days' },
    { value: '30days', label: '30 Days' },
    { value: '90days', label: '90 Days' },
    { value: 'custom', label: 'Custom' }
];
const headers = [
    'NAME',
    'EMAIL',
    'CLASS DATE',
    'CLASS TIME',
    'LOCATION',
    'CLASS NAME',
    'INSTRUCTOR',
    'ATTENDED',
    'PAYMENT TYPE',
    'GROSS REV ATTRIBUTED',
    'NET REV ATTRIBUTED'
];
const csvHeaders = [
    'ID',
    'CLASS DATE',
    'DAY OF WEEK',
    'CLASS TIME',
    'CLASS NAME',
    'LOCATION',
    'INSTRUCTOR',
    'EVENTID',
    'USERID',
    'EMAIL',
    'NAME',
    'ATTENDED',
    'DATE BOOKED',
    'PAYMENT TYPE',
    'ORIGINAL PRICE',
    'PROMO CODE APPLIED',
    'FLASH CREDIT APPLIED',
    'TOTAL DISCOUNTS',
    'GROSS REVENUE ATTRIBUTED',
    'NET REVENUE ATTRIBUTED'
];
const summaryTitles = ['Gross Revenue', 'Tax Withheld', 'Dibs Fee', 'Stripe Fee', 'Net Revenue'];
const widthNumber = 270;
const attendanceMsg =
    'This report shows each visit in the specified time period. It also shows the actual revenue that can be attributed to each visit. This report does not include retail sales.';

const ReportingSalesReports = () => {
    const dispatch = useDispatch();
    const { studioConfig, config } = useSelector((state) => state.dibsstudio);
    const { timeZone } = studioConfig;
    const { dibsStudioId } = config;
    const [showReportResults, setShowReportResults] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [salesValue, setSalesValue] = useState(menuOptions[0].value);
    const [dateRange, setDateRange] = useState(dateOptions[0].value);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [locationToShow, setLocationToShow] = useState(menuOptions[0].value);
    const handleLocationChange = (e) => {
        console.log(`location change is happening: ${e}`);
        setLocationToShow(e);
        setSalesValue(e);
    };
    const handleRunReport = async () => {
        const reportSpecs = {
            startDate,
            endDate
        };
        setShowLoader(true);
        await RunSummaryReport(dibsStudioId, reportSpecs, timeZone).then((res) => {
            if (res.msg === 'failure') {
                console.log('it was an error');
            }
            if (res.msg === 'success') {
                dispatch(setSummaryForTable(res.summaryData));
                setShowLoader(false);
            }
        });
        await RunAttendanceReport(dibsStudioId, reportSpecs, timeZone, locationToShow).then((res) => {
            console.log(`\n\n\n\n\n\n\n8/8 - Got response from running attendance report --> \n\n\n\n${JSON.stringify(res)}\n\n\n\n\n\n\n`);
            if (res.msg === 'failure') {
                console.log('there was an error calling the attendance report');
            }
            if (res.msg === 'success') {
                dispatch(setReportingDataForTable(res.reportData));
                setShowReportResults(true);
                setShowLoader(false);
            }
        });
        await RunCsvReport(dibsStudioId, reportSpecs, timeZone).then((res) => {
            if (res.msg === 'failure') {
                console.log('it was an error');
            }
            if (res.msg === 'success') {
                dispatch(setCsvDataForTable(res.reportData));
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
            } else if (dateRange === '7days') {
                setFormattedStartDate(7);
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
                <Stack direction="row" spacing={1}>
                    <Typography gutterBottom variant="h4">
                        View Attendance Reports
                    </Typography>
                    <InfoIcon msg={attendanceMsg} />
                </Stack>
            </Grid>
            <Grid item sx={{ mt: 2 }}>
                <LocationSelector
                    dibsStudioId={dibsStudioId}
                    options={menuOptions}
                    valueString={salesValue}
                    widthNumber={widthNumber}
                    onChangeLocation={handleLocationChange}
                />
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
            <Grid item sx={{ mt: 4, mb: 5 }}>
                <RunReportButton id="run-report" valueString="Run Report" onClick={handleRunReport} />
            </Grid>
            {showLoader && (
                <Grid item xs={12} sx={{ mt: 1 }}>
                    <LoaderLinear />
                </Grid>
            )}
            {showReportResults && (
                <Grid container>
                    <Grid item xs={12} sx={{ mt: 6 }}>
                        <Divider variant="fullWidth" />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 5 }}>
                        <Typography gutterBottom variant="h4">
                            Report Summary
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 3, mb: 3 }}>
                        <SummaryForReportTable headers={summaryTitles} />
                    </Grid>
                    <Grid item xs={12}>
                        <ExportToCsv headers={csvHeaders} />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 6 }}>
                        <Divider variant="fullWidth" />
                    </Grid>
                    <Grid item xs={12} sx={{ mt: 5 }}>
                        <Typography gutterBottom variant="h4">
                            Report Details
                        </Typography>
                    </Grid>
                    <Grid item sx={{ mt: 4, mb: 3 }}>
                        <ReportsTable headers={headers} />
                    </Grid>
                </Grid>
            )}
        </Grid>
    );
};

export default ReportingSalesReports;
