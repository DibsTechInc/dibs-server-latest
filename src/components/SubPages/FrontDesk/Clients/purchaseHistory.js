import * as React from 'react';
import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Radio, RadioGroup, FormControl, FormControlLabel, CardContent, Divider, Grid, Tab, Tabs } from '@mui/material';

// project imports
import FirstPage from './PurchaseHistory/purchases';
import useConfig from 'hooks/useConfig';
import SubCard from 'ui-component/cards/SubCard';
import AnimateButton from 'ui-component/extended/AnimateButton';
import { gridSpacing } from 'store/constant';

// assets
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import CreditCardTwoToneIcon from '@mui/icons-material/CreditCardTwoTone';
import VpnKeyTwoToneIcon from '@mui/icons-material/VpnKeyTwoTone';

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
    const { borderRadius } = useConfig();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item xs={12}>
                <SubCard title="Alicia's Purchase History" content={false}>
                    <Grid container spacing={gridSpacing}>
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
                                                '& button.Mui-selected': {
                                                    color: theme.palette.primary.main,
                                                    background:
                                                        theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.grey[50]
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
                                            {/* <FormControl>
                                        <RadioGroup
                                            aria-labelledby="demo-radio-buttons-group-label"
                                            defaultValue="female"
                                            name="radio-buttons-group"
                                        /> */}
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
                                                    {...a11yProps(index)}
                                                />
                                            ))}
                                            {/* </RadioGroup>
                                    </FormControl> */}
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
                                    <FirstPage />
                                </TabPanel>
                                <TabPanel value={value} index={1}>
                                    <FirstPage />
                                </TabPanel>
                                <TabPanel value={value} index={2}>
                                    <FirstPage />
                                </TabPanel>
                                <TabPanel value={value} index={3}>
                                    <FirstPage />
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
