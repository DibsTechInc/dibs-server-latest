import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs } from '@mui/material';

// assets
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined';
// import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import MailOutlinedIcon from '@mui/icons-material/MailOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
// import ShoppingBasketOutlinedIcon from '@mui/icons-material/ShoppingBasketOutlined';
// import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
// import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';

// Settings subpages mapped to tabs
import GeneralSettingsPage from '../SubPages/Settings/subpage-settings-general';
import CommunicationSettingsPage from '../SubPages/Settings/subpage-settings-communication';
import RevenueManagementSettingsPage from '../SubPages/Settings/subpage-settings-revenue-management';
import IntegrationsSettingsPage from '../SubPages/Settings/subpage-settings-integrations';

// actions
import getIntegrationStatus from 'actions/studios/settings/getIntegrationStatus';
import getDynamicPricing from 'actions/studios/settings/getDynamicPricingStatus';
import getFlashCredits from 'actions/studios/settings/getFlashCreditStatus';
import getMinMaxpricing from 'actions/studios/settings/getMinMaxPricing';
import GetGeneralLocationData from 'actions/studios/settings/getGeneralLocationData';
import {
    setClasspass,
    setGympass,
    setDynamicPricing,
    setFlashCreditsStore,
    setGlobalPrices,
    setGeneralLocationData,
    setCustomEmailToSendFrom
} from 'store/slices/dibsstudio';

import { useSelector, useDispatch } from 'store';

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

// ================================|| SETTINGS TABS ||================================ //

export default function SettingsTabs() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [value, setValue] = React.useState(0);
    // get dynamic pricing status
    const [classpass, setFileClasspass] = React.useState(false);
    // const [dp, setDp] = React.useState(false);
    const [gympass, setFileGympass] = React.useState(false);
    // const [flashcredits, setFlashCredits] = React.useState(false);
    const [minp, setMinP] = React.useState(10);
    const [maxp, setMaxP] = React.useState(100);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    useEffect(() => {
        // check for classpass status
        const getSettings = async () => {
            await getIntegrationStatus(dibsStudioId).then((settings) => {
                const { statustosend } = settings;
                setFileClasspass(statustosend.classpass);
                setFileGympass(statustosend.gympass);
                dispatch(setClasspass(statustosend.classpass));
                dispatch(setGympass(statustosend.gympass));
                dispatch(setCustomEmailToSendFrom(statustosend.customEmailSentFrom));
            });
            await getDynamicPricing(dibsStudioId).then((status) => {
                // console.log(`status from dynamic pricing is: ${JSON.stringify(status)}`);
                const { dp } = status;
                // console.log(`dp is: ${dp.hasDynamicPricing}`);
                // setDp(dp.hasDynamicPricing);
                dispatch(setDynamicPricing(dp.hasDynamicPricing));
            });
            await getFlashCredits(dibsStudioId).then((status) => {
                const { fc } = status;
                // setFlashCredits(fc);
                dispatch(setFlashCreditsStore(fc));
                // dispatch(setClasspass(dynamicpricingtosend));
            });
            await getMinMaxpricing(dibsStudioId).then((status) => {
                const { statustosend } = status;
                const { min, max } = statustosend;
                setMinP(min);
                setMaxP(max);
                const prices = {
                    minPrice: min,
                    maxPrice: max
                };
                dispatch(setGlobalPrices(prices));
            });
            await GetGeneralLocationData(dibsStudioId).then((status) => {
                dispatch(
                    setGeneralLocationData({
                        serviceEmail: status[0].customer_service_email,
                        servicePhone: status[0].customer_service_phone,
                        address: status[0].address,
                        address2: status[0].address2,
                        city: status[0].city,
                        state: status[0].state,
                        zipcode: status[0].zipcode
                    })
                );
            });
        };
        getSettings();
    }, [dibsStudioId, dispatch]);

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
                    icon={<SettingsOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="General"
                    {...a11yProps(0)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<MailOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Communication"
                    {...a11yProps(1)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<AttachMoneyOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Revenue Management"
                    {...a11yProps(1)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<ExitToAppOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Integrations"
                    {...a11yProps(1)}
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <GeneralSettingsPage />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <CommunicationSettingsPage />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <RevenueManagementSettingsPage minp={minp} maxp={maxp} />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <IntegrationsSettingsPage classpass={classpass} gympass={gympass} />
            </TabPanel>
        </>
    );
}
