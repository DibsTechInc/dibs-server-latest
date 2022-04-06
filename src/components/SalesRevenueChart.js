import PropTypes from 'prop-types';
import React from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, MenuItem, TextField, Typography } from '@mui/material';

// third-party
import ApexCharts from 'apexcharts';
import Chart from 'react-apexcharts';

// project imports
import useConfig from 'hooks/useConfig';
import SkeletonTotalGrowthBarChart from 'ui-component/cards/Skeleton/TotalGrowthBarChart';
import MainCard from 'ui-component/cards/MainCard';
import { gridSpacing } from 'store/constant';
import { useSelector, dispatch } from 'store';

// chart data
import chartData from './chart-data/total-growth-dibs-sales-chart';

const status = [
    {
        value: 'weekly',
        label: 'Weekly'
    },
    {
        value: 'monthly',
        label: 'Monthly'
    },
    {
        value: 'annually',
        label: 'Annually'
    }
];

// ==============================|| DASHBOARD DEFAULT - TOTAL GROWTH BAR CHART ||============================== //

const TotalGrowthBarChart = ({ isLoading }) => {
    const [value, setValue] = React.useState('monthly');
    const theme = useTheme();
    const { navType } = useConfig();
    const { xaxis } = useSelector((state) => state.dashboard);
    console.log(`xaxiscategories in redux store: ${JSON.stringify(xaxis)}`);
    const [categoriestoshow, setCategoriestoshow] = React.useState([]);
    console.log(`value is: ${value}\ncategoriestoshow = ${JSON.stringify(categoriestoshow)}`);

    const { primary } = theme.palette.text;
    const darkLight = theme.palette.dark.light;
    const grey200 = theme.palette.grey[200];
    const grey500 = theme.palette.grey[500];

    const primary200 = theme.palette.chart[200];
    const primaryDark = theme.palette.chart.dark;
    const secondaryMain = theme.palette.chart.main;
    const secondaryLight = theme.palette.chart.light;

    React.useEffect(() => {
        // console.log(`newCategories = ${JSON.stringify(newCategories)}`);
        // const categoriestoshow = chartData.options.xaxisreplace[value];
        console.log(`xaxiscategories part 2 is: ${JSON.stringify(xaxis)} `);
        setCategoriestoshow(xaxis[value].xaxiscategories);
        console.log(`categories to show after setting value: ${JSON.stringify(categoriestoshow)}`);
        const newChartData = {
            ...chartData.options,
            colors: [primary200, primaryDark, secondaryMain, secondaryLight],
            series: chartData.seriesreplace[value],
            xaxis: {
                type: 'category',
                categories: categoriestoshow,
                labels: {
                    style: {
                        colors: [primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary, primary]
                    }
                }
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [primary]
                    }
                }
            },
            grid: {
                borderColor: navType === 'dark' ? darkLight + 20 : grey200
            },
            tooltip: {
                theme: navType === 'dark' ? 'dark' : 'light'
            },
            legend: {
                labels: {
                    colors: grey500
                }
            }
        };

        // do not load chart when loading
        if (!isLoading) {
            ApexCharts.exec(`bar-chart`, 'updateOptions', newChartData);
        }
    }, [
        navType,
        primary200,
        primaryDark,
        secondaryMain,
        secondaryLight,
        primary,
        darkLight,
        grey200,
        isLoading,
        grey500,
        value,
        categoriestoshow,
        xaxis
    ]);

    return (
        <>
            {isLoading ? (
                <SkeletonTotalGrowthBarChart />
            ) : (
                <MainCard>
                    <Grid container spacing={gridSpacing}>
                        <Grid item xs={12}>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item>
                                    <Grid container direction="column" spacing={1}>
                                        <Grid item>
                                            <Typography variant="subtitle2">Total Revenue</Typography>
                                        </Grid>
                                        <Grid item>
                                            <Typography variant="h3">$2,324.00</Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item>
                                    <TextField
                                        id="standard-select-currency"
                                        select
                                        value={value}
                                        onChange={(e) => setValue(e.target.value)}
                                    >
                                        {status.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Chart {...chartData} />
                        </Grid>
                    </Grid>
                </MainCard>
            )}
        </>
    );
};

TotalGrowthBarChart.propTypes = {
    isLoading: PropTypes.bool
};

export default TotalGrowthBarChart;
