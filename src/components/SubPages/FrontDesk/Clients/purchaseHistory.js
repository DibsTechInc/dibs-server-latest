import * as React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Radio, RadioGroup, FormControl, FormControlLabel, CardContent, Grid, Tab, Tabs } from '@mui/material';

// project imports
import Purchases from './PurchaseHistory/purchases';
import AvailablePackages from './PurchaseHistory/availablePackages';
import UnavailablePackages from './PurchaseHistory/unavailablePackages';
import StudioCredit from './PurchaseHistory/studioCredit';
import UpcomingClasses from './PurchaseHistory/upcomingClasses';
import PastClasses from './PurchaseHistory/pastClasses';
import DroppedClasses from './PurchaseHistory/droppedClasses';
import FlashCredits from './PurchaseHistory/flashCredits';
// import Purchases from '../subpage-frontdesk-classes';
import useConfig from 'hooks/useConfig';
import SubCard from 'ui-component/cards/SubCard';
import { gridSpacing } from 'store/constant';
import { useDispatch, useSelector } from 'store';
import getCurrentClientInfo from 'actions/studios/users/getCurrentClientInfo';
import { setCurrentClientProfileStudioAdmin } from 'store/slices/currentclient';

// assets

// tabs
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
            {value === index && <div>{children}</div>}
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

const tabsOption = [
    {
        label: 'Purchases'
    },
    {
        label: 'Available Packages/Memberships'
    },
    {
        label: 'Unavailable Packages/Memberships'
    },
    {
        label: 'Studio Credit'
    },
    {
        label: 'Upcoming Classes'
    },
    {
        label: 'Past Classes'
    },
    {
        label: 'Dropped Classes'
    },
    {
        label: 'Flash Credits'
    }
];

// ==============================|| CLIENT PURCHASE HISTORY ||============================== //

const ClientPurchaseHistory = () => {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);
    const dispatch = useDispatch();
    const [firstname, setFirstName] = React.useState('');
    const [alreadyChecked, setAlreadyChecked] = React.useState(false);
    const [checkingNow, setCheckingNow] = React.useState(false);
    const { borderRadius } = useConfig();
    const { userid } = useParams();
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    console.log(`userid is: ${userid}`);

    React.useEffect(() => {
        const getClientInfo = async () => {
            setCheckingNow(true);
            await getCurrentClientInfo(userid, dibsStudioId).then((user) => {
                if (user !== 0) {
                    setFirstName(user.firstname);
                    dispatch(setCurrentClientProfileStudioAdmin({ id: userid, label: user.nameToDisplay, firstname: user.firstname }));
                    setAlreadyChecked(true);
                }
            });
        };
        if (!alreadyChecked && !checkingNow) {
            getClientInfo();
        }
    }, [userid, dispatch, alreadyChecked, checkingNow, dibsStudioId]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const titlename = `${firstname}'s Purchase History`;
    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubCard title={titlename} content={false}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={3}>
                            <FormControl>
                                <RadioGroup>
                                    <CardContent>
                                        <Tabs
                                            value={value}
                                            onChange={handleChange}
                                            orientation="vertical"
                                            variant="scrollable"
                                            sx={{
                                                '& .MuiTabs-flexContainer': {
                                                    borderBottom: 'none'
                                                },
                                                '& button': {
                                                    color:
                                                        theme.palette.mode === 'dark' ? theme.palette.grey[600] : theme.palette.grey[600],
                                                    minHeight: 'auto',
                                                    minWidth: '100%',
                                                    py: 1.5,
                                                    px: 2,
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    alignItems: 'flex-start',
                                                    textAlign: 'left',
                                                    justifyContent: 'flex-start',
                                                    borderRadius: `${borderRadius}px`
                                                },
                                                '& button: hover': {
                                                    background: theme.palette.grey[100]
                                                },
                                                '& button.Mui-selected': {
                                                    color: theme.palette.primary.main,
                                                    background:
                                                        theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[100]
                                                },
                                                '& button > svg': {
                                                    marginBottom: '0px !important',
                                                    marginRight: 1.25,
                                                    marginTop: 1.25,
                                                    height: 20,
                                                    width: 20
                                                },
                                                '& button > div > span': {
                                                    display: 'block'
                                                },
                                                '& > div > span': {
                                                    display: 'none'
                                                }
                                            }}
                                        >
                                            {tabsOption.map((tab, index) => (
                                                <Tab
                                                    key={index}
                                                    icon={tab.icon}
                                                    label={
                                                        <Grid item xs={12}>
                                                            <Grid container spacing={2}>
                                                                <Grid item>
                                                                    <FormControlLabel
                                                                        control={<Radio />}
                                                                        value={tab.label}
                                                                        label={tab.label}
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                    sx={{ '& selected': { minWidth: '100%' } }}
                                                    {...a11yProps(index)}
                                                />
                                            ))}
                                        </Tabs>
                                    </CardContent>
                                </RadioGroup>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} lg={8}>
                            <CardContent
                                sx={{
                                    borderLeft: '1px solid',
                                    borderColor: theme.palette.mode === 'dark' ? theme.palette.background.default : theme.palette.grey[200],
                                    height: '100%'
                                }}
                            >
                                <TabPanel value={value} index={0}>
                                    <Purchases />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <AvailablePackages />
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <UnavailablePackages />
                                </TabPanel>
                                <TabPanel value={value} index={3}>
                                    <StudioCredit />
                                </TabPanel>
                                <TabPanel value={value} index={4}>
                                    <UpcomingClasses />
                                </TabPanel>
                                <TabPanel value={value} index={5}>
                                    <PastClasses />
                                </TabPanel>
                                <TabPanel value={value} index={6}>
                                    <DroppedClasses />
                                </TabPanel>
                                <TabPanel value={value} index={7}>
                                    <FlashCredits />
                                </TabPanel>
                            </CardContent>
                        </Grid>
                    </Grid>
                </SubCard>
            </Grid>
        </Grid>
    );
};

export default ClientPurchaseHistory;
