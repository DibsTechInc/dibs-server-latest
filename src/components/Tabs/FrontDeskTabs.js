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
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import FrontDeskClientsSubPage from '../SubPages/FrontDesk/subpage-frontdesk-clients';
import FrontDeskClassesSubPage from '../SubPages/FrontDesk/subpage-frontdesk-classes';
import FrontDeskPromoCodesSubPage from '../SubPages/FrontDesk/subpage-frontdesk-promocodes';
import FrontDeskMemberPackagePage from '../SubPages/FrontDesk/subpage-frontdesk-memberships-packages';
import FrontDeskRetailPage from '../SubPages/FrontDesk/subpage-frontdesk-retail';

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
                    label="Clients"
                    {...a11yProps(0)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<LibraryBooksOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Classes"
                    {...a11yProps(1)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<DiscountOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Promo Codes"
                    {...a11yProps(2)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<CollectionsBookmarkOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Memberships & Packages"
                    {...a11yProps(3)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<ShoppingBasketOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Retail Items"
                    {...a11yProps(4)}
                />
                {/* <Tab
                    component={Link}
                    to="#"
                    icon={<OndemandVideoOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Video On Demand (beta)"
                    {...a11yProps(4)}
                /> */}
            </Tabs>
            <TabPanel value={value} index={0}>
                <FrontDeskClientsSubPage />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <FrontDeskClassesSubPage />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <FrontDeskPromoCodesSubPage />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <FrontDeskMemberPackagePage />
            </TabPanel>
            <TabPanel value={value} index={4}>
                <FrontDeskRetailPage />
            </TabPanel>
        </>
    );
}
