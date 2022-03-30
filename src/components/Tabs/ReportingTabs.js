import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs } from '@mui/material';

// assets
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
// import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';

// Reporting subpages mapped to tabs
import ReportingSalesRevenueSubPage from '../SubPages/Reporting/subpage-reporting-sales-revenue';
import ReportingAttendanceRevenueSubPage from '../SubPages/Reporting/subpage-reporting-attendance';
import ReportingClientsSubpage from '../SubPages/Reporting/subpage-reporting-clients';
import ReportingCustomReportsSubpage from '../SubPages/Reporting/subpage-reporting-custom-reports';

// tab content customize
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        p: 3
                    }}
                >
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// ================================|| UI TABS - COLOR ||================================ //

export default function ColorTabs() {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Tabs
                value={value}
                variant="scrollable"
                onChange={handleChange}
                textColor="secondary"
                indicatorColor="secondary"
                allowScrollButtonsMobile
                sx={{
                    mb: 3,
                    '& a': {
                        minHeight: 'auto',
                        minWidth: 180,
                        py: 1.5,
                        px: 6,
                        pl: 2,
                        // mr: 3,
                        color: theme.palette.grey[550],
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                    },
                    '& a.Mui-selected': {
                        color: theme.palette.primary.main
                    },
                    '& a > svg': {
                        mb: '0px !important',
                        mr: 1.1
                    }
                }}
            >
                <Tab
                    component={Link}
                    to="#"
                    icon={<PersonOutlineIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Sales Reports"
                    {...a11yProps(0)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<LibraryBooksOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Attendance Reports"
                    {...a11yProps(1)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<DiscountOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Client Reports"
                    {...a11yProps(2)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<CollectionsBookmarkOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Custom Reports"
                    {...a11yProps(3)}
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <ReportingSalesRevenueSubPage />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ReportingAttendanceRevenueSubPage />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ReportingClientsSubpage />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <ReportingCustomReportsSubpage />
            </TabPanel>
        </>
    );
}
