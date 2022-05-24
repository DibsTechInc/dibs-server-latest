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
import GetIntegrationStatus from 'actions/studios/settings/getIntegrationStatus';
import { setClasspass, setGympass } from 'store/slices/dibsstudio';

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
    const [classpass, setFileClasspass] = React.useState(false);
    const [gympass, setFileGympass] = React.useState(false);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    useEffect(() => {
        // check for classpass status
        const getSettings = async () => {
            await GetIntegrationStatus(dibsStudioId).then((settings) => {
                const { statustosend } = settings;
                setFileClasspass(statustosend.classpass);
                setFileGympass(statustosend.gympass);
                dispatch(setClasspass(statustosend.classpass));
                dispatch(setGympass(statustosend.gympass));
            });
        };
        getSettings();
    }, [dibsStudioId]);

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
                <RevenueManagementSettingsPage dynamicpricing />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <IntegrationsSettingsPage classpass={classpass} gympass={gympass} />
            </TabPanel>
        </>
    );
}
