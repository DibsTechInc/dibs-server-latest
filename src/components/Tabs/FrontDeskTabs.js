import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Tab, Tabs, Typography } from '@mui/material';

// assets
import PersonOutlineTwoToneIcon from '@mui/icons-material/PersonOutlineTwoTone';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PanoramaTwoToneIcon from '@mui/icons-material/PanoramaTwoTone';
import PeopleAltTwoToneIcon from '@mui/icons-material/PeopleAltTwoTone';
import RecentActorsTwoToneIcon from '@mui/icons-material/RecentActorsTwoTone';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import LibraryBooksOutlinedIcon from '@mui/icons-material/LibraryBooksOutlined';
import DiscountOutlinedIcon from '@mui/icons-material/DiscountOutlined';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';

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
                    <Typography>{children}</Typography>
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
                scrollButtons
                allowScrollButtonsMobile
                sx={{
                    mb: 3,
                    '& a': {
                        minHeight: 'auto',
                        minWidth: 10,
                        py: 1.5,
                        px: 3,
                        mr: 3,
                        color: theme.palette.grey[600],
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
                    {...a11yProps(1)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<CollectionsBookmarkOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Memberships & Packages"
                    {...a11yProps(1)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<OndemandVideoOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Video On Demand (beta)"
                    {...a11yProps(1)}
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                Anim pariah&apos;s cliche reprehended, enid elusion high life accusals terry richardson ad squid. 3 wolf moon official auth,
                non cuspidate skateboard dolor brunch.
            </TabPanel>
            <TabPanel value={value} index={1}>
                Anim pariah&apos;s cliche reprehended, enid elusion high life accusals terry richardson ad squid. 3 wolf moon official auth,
                non cuspidate skateboard dolor brunch. Food truck quinoa nescient labarum elusion.
            </TabPanel>
            <TabPanel value={value} index={2}>
                Nihil anim keffiyeh helvetic, craft beer laborer wes anderson cred mesclun sapient ea provident. Ad vegan exceptive butcher
                vice lome.
            </TabPanel>
            <TabPanel value={value} index={3}>
                Nihil anim keffiyeh helmeting, craft beer labourer wes anderson cred mesclun sapiency ea provident.
            </TabPanel>
        </>
    );
}
