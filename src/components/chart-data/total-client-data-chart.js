// ==============================|| DASHBOARD - TOTAL GROWTH BAR CHART ||============================== //

const ClientData = {
    height: 250,
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
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        xaxisreplace: {
            monthly: [
                {
                    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                }
            ],
            weekly: [
                {
                    categories: ['1/14', '1/21', '1/28', '2/5', '2/12', '2/18', '2/22', '2/29', '3/5']
                }
            ],
            annually: [
                {
                    categories: ['2016', '2017', '2018', '2019', '2020', '2021', '2022']
                }
            ]
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
            name: 'Total # of Clients',
            data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
        }
    ],
    seriesreplace: {
        weekly: [
            {
                name: 'Total # of Clients',
                data: [35, 125, 35, 35, 35, 80, 35, 20, 35, 45, 15, 75]
            }
        ],
        monthly: [
            {
                name: 'Total # of Clients',
                data: [350, 1250, 350, 350, 350, 800, 350, 200, 350, 450, 150, 750]
            }
        ],
        annually: [
            {
                name: 'Total # of Clients',
                data: [3500, 12500, 3500, 35, 35, 80]
            }
        ]
    }
};
export default ClientData;
