import PropTypes from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Tab, Tabs } from '@mui/material';

// assets
import FaceRetouchingOffIcon from '@mui/icons-material/FaceRetouchingOff';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import AddReactionOutlinedIcon from '@mui/icons-material/AddReactionOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined';

// Reporting subpages mapped to tabs
import InstructorsActive from '../SubPages/Instructors';
import InstructorsInactive from '../SubPages/Instructors/inactiveInstructors';
import CreateInstructors from '../SubPages/Instructors/createInstructor';

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

export default function SettingsTabs() {
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
                    icon={<EmojiPeopleIcon sx={{ fontSize: '1.5rem', color: theme.palette.chart.light }} />}
                    label="Active Instructors"
                    sx={{
                        width: '300px'
                    }}
                    {...a11yProps(0)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<FaceRetouchingOffIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Inactive Instructors"
                    sx={{
                        width: '300px'
                    }}
                    {...a11yProps(1)}
                />
                <Tab
                    component={Link}
                    to="#"
                    icon={<GroupAddOutlinedIcon sx={{ fontSize: '1.3rem', color: theme.palette.chart.light }} />}
                    label="Add New Instructors"
                    sx={{
                        width: '300px'
                    }}
                    {...a11yProps(2)}
                />
            </Tabs>
            <TabPanel value={value} index={0}>
                <InstructorsActive />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <InstructorsInactive />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <CreateInstructors />
            </TabPanel>
        </>
    );
}
