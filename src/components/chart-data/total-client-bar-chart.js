// ==============================|| DASHBOARD - TOTAL GROWTH BAR CHART ||============================== //

const clientData = {
    height: 480,
    type: 'bar',
    options: {
        chart: {
            id: 'bar-chart',
            stacked: true,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                    }
                }
            }
        ],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '50%'
            }
        },
        xaxis: {
            type: 'category',
            categories: {
                monthly: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                weekly: ['1/14', '1/21', '1/28', '2/5', '2/12', '2/18', '2/22', '2/29', '3/5'],
                annually: ['2016', '2017', '2018', '2019', '2020', '2021', '2022']
            }
        },
        legend: {
            show: true,
            fontFamily: `'Roboto', sans-serif`,
            position: 'bottom',
            offsetX: 20,
            labels: {
                useSeriesColors: false
            },
            markers: {
                width: 16,
                height: 16,
                radius: 5
            },
            itemMargin: {
                horizontal: 15,
                vertical: 8
            }
        },
        fill: {
            type: 'solid'
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true
        }
    },
    series: [
        {
            name: 'Memberships',
            data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
        },
        {
            name: 'Packages',
            data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
        },
        {
            name: 'Profit',
            data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
        },
        {
            name: 'Maintenance',
            data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
        }
    ],
    seriesreplace: {
        weekly: [
            {
                name: 'Memberships',
                data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
            },
            {
                name: 'Packages',
                data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
            },
            {
                name: 'Single',
                data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
            },
            {
                name: 'Retail',
                data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
            }
        ],
        monthly: [
            {
                name: 'Memberships',
                data: [350, 1250, 350, 350, 350, 800, 350, 200, 350, 450, 150, 750]
            },
            {
                name: 'Packages',
                data: [35, 15, 15, 35, 65, 40, 80, 25, 15, 85, 25, 75]
            },
            {
                name: 'Single',
                data: [35, 145, 35, 35, 20, 105, 100, 10, 65, 45, 30, 10]
            },
            {
                name: 'Retail',
                data: [0, 0, 75, 0, 0, 115, 0, 0, 0, 0, 150, 0]
            }
        ],
        annually: [
            {
                name: 'Memberships',
                data: [3500, 12500, 3500, 35, 35, 80]
            },
            {
                name: 'Packages',
                data: [35, 15, 15, 35, 65, 40, 80]
            },
            {
                name: 'Single',
                data: [35, 145, 35, 35, 20, 105, 100]
            },
            {
                name: 'Retail',
                data: [0, 0, 75, 0, 0, 115, 0]
            }
        ]
    }
};
export default clientData;
