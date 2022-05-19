import PropTypes from 'prop-types';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs } from '@mui/material';

// assets
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
import SettingsIcon from '@mui/icons-material/Settings';
import ClientAccountPage from '../SubPages/FrontDesk/Clients/index';
import ClientPurchaseHistory from '../SubPages/FrontDesk/Clients/purchaseHistory';
import BuyRetail from '../SubPages/FrontDesk/Clients/buyRetail';
import FrontDeskPromoCodesSubPage from '../SubPages/FrontDesk/subpage-frontdesk-promocodes';
import { useSelector, useDispatch } from 'store';
import { setRetailProducts } from 'store/slices/retail';
import GetRetailData from 'actions/studios/getRetailProductData';

// tab content customize
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && (
                <Box
                    sx={{
                        p: 1.5
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

function a11yPropsclient(index) {
    return {
        id: `frontdesk-clientpage-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}

// ================================|| UI TABS - COLOR ||================================ //

export default function ColorTabs() {
    const theme = useTheme();
    const location = useLocation();
    let selectedIndex = 0;
    if (location.pathname.includes('transactions')) selectedIndex = 1;
    if (location.pathname.includes('retail')) selectedIndex = 2;
    const [value, setValue] = React.useState(selectedIndex);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const dispatch = useDispatch();
    React.useEffect(() => {
        GetRetailData(config.dibsStudioId).then((result) => {
            dispatch(setRetailProducts(result.data));
        });
    }, [config.dibsStudioId, dibsStudioId, dispatch]);
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
                        minWidth: 'auto',
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
                    label="Client Info"
                    {...a11yPropsclient(0)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<ShoppingBasketOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Purchase History"
                    {...a11yPropsclient(1)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<ShoppingCartOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Buy Retail"
                    {...a11yPropsclient(2)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<SettingsIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Account Settings"
                    {...a11yPropsclient(3)}
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <ClientAccountPage />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ClientPurchaseHistory />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <BuyRetail />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <FrontDeskPromoCodesSubPage />
            </TabPanel>
        </>
    );
}
