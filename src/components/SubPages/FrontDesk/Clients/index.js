// material-ui
import {
    Box,
    Button,
    CardContent,
    Chip,
    Divider,
    Grid,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemSecondaryAction,
    ListItemText,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Typography
} from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';

// assets
import { IconEdit } from '@tabler/icons';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import CakeTwoToneIcon from '@mui/icons-material/CakeTwoTone';

// personal details table
/** names Don&apos;t look right */
function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

// ==============================|| SAMPLE PAGE ||============================== //
const picurl = 'https://d2awqhtf1sn10j.cloudfront.net/Alicia-undefined-615094.png';
const rows = [
    createData('Full Name', ':', 'Alicia Ulin'),
    createData('Fathers Name', ':', 'Mr. Deepen Handgun'),
    createData('Address', ':', 'Street 110-B Kalians Bag, Dewan, M.P. INDIA'),
    createData('Zip Code', ':', '12345'),
    createData('Phone', ':', '+0 123456789 , +0 123456789'),
    createData('Email', ':', 'support@example.com'),
    createData('Website', ':', 'http://example.com')
];
const ClientAccountPage = () => (
    <Grid container spacing={2}>
        <Grid item lg={3.75} xs={12}>
            <SubCard
                title={
                    <Grid container spacing={2} alignItems="center">
                        <Grid item>
                            <Avatar alt="User 1" src={picurl} size="sm" />
                        </Grid>
                        <Grid item xs zeroMinWidth>
                            <Typography align="left" variant="subtitle1">
                                Alicia Ulin
                            </Typography>
                            <Typography align="left" variant="subtitle2">
                                (272 visits)
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Chip size="small" label="Top 5%" color="primary" />
                        </Grid>
                    </Grid>
                }
            >
                <List component="nav" aria-label="main mailbox folders">
                    <ListItemButton>
                        <ListItemIcon>
                            <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                demo@sample.com
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Phone</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                (310) 403-7905
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                    <Divider />
                    <ListItemButton>
                        <ListItemIcon>
                            <CakeTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                        </ListItemIcon>
                        <ListItemText primary={<Typography variant="subtitle1">Birthday</Typography>} />
                        <ListItemSecondaryAction>
                            <Typography variant="subtitle2" align="right">
                                12/11/1975
                            </Typography>
                        </ListItemSecondaryAction>
                    </ListItemButton>
                </List>
                <CardContent sx={{ px: '4px !important' }}>
                    <Grid container spacing={0}>
                        <Grid item xs={4}>
                            <Typography align="left" sx={{ ml: 1 }} variant="h3">
                                $212
                            </Typography>
                            <Typography align="left" sx={{ ml: 1 }} variant="subtitle2">
                                Total Spend
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography align="center" variant="h3">
                                7.8
                            </Typography>
                            <Typography align="center" variant="subtitle2">
                                Visits/Month
                            </Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Typography align="right" sx={{ mr: 1 }} variant="h3">
                                9.2
                            </Typography>
                            <Typography align="right" sx={{ mr: 1 }} variant="subtitle2">
                                Loyalty Score
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ mt: 5 }}>
                            <Divider sx={{ mb: 1 }} />
                            <Typography align="left" sx={{ ml: 1 }} variant="subtitle2">
                                First visit on 12/11/2020
                            </Typography>
                            <Typography align="left" sx={{ ml: 1 }} variant="subtitle2">
                                Last visit on 2/23/2022
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </SubCard>
        </Grid>
        <Grid item lg={8} xs={12}>
            <Grid container direction="column" spacing={gridSpacing}>
                <Grid item xs={12}>
                    <SubCard
                        title="Payment Information"
                        secondary={
                            <Button>
                                <IconEdit stroke={1.5} size="1.3rem" />
                            </Button>
                        }
                    >
                        <Grid container direction="column" spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    Hello,I’m Anshan Handgun Creative Graphic Designer & User Experience Designer based in Website, I create
                                    digital Products a more Beautiful and usable place. Morbid accusant ipsum. Nam nec tellus at.
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle1">Personal Details</Typography>
                            </Grid>
                            <Divider sx={{ pt: 1 }} />
                            <Grid item xs={12}>
                                <TableContainer>
                                    <Table
                                        sx={{
                                            '& td': {
                                                borderBottom: 'none'
                                            }
                                        }}
                                        size="small"
                                    >
                                        <TableBody>
                                            {rows.map((row) => (
                                                <TableRow key={row.name}>
                                                    <TableCell variant="head">{row.name}</TableCell>
                                                    <TableCell>{row.calories}</TableCell>
                                                    <TableCell>{row.fat}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
                <Grid item xs={12}>
                    <SubCard title="Education">
                        <Grid container direction="column" spacing={1}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">2014-2017</Typography>
                                        <Typography variant="subtitle2">Master Degree</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="subtitle1">Master Degree in Computer Application</Typography>
                                        <Typography variant="subtitle2">University of Oxford, England</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                            </Box>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">2011-2013</Typography>
                                        <Typography variant="subtitle2">Bachelor</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="subtitle1">Bachelor Degree in Computer Engineering</Typography>
                                        <Typography variant="subtitle2">Imperial College London</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                            </Box>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">2009-2011</Typography>
                                        <Typography variant="subtitle2">School</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="subtitle1">Higher Secondary Education</Typography>
                                        <Typography variant="subtitle2">School of London, England</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
                <Grid item xs={12}>
                    <SubCard title="Employment">
                        <Grid container direction="column" spacing={2}>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">Current</Typography>
                                        <Typography variant="subtitle2">Senior</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="subtitle1">Senior UI/UX designer</Typography>
                                        <Typography variant="subtitle2">
                                            Perform task related to project manager with the 100+ team under my observation. Team management
                                            is key role in this company.
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                            </Box>
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs={12} sm={4}>
                                        <Typography variant="subtitle1">2017-2019</Typography>
                                        <Typography variant="subtitle2">Junior</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={8}>
                                        <Typography variant="subtitle1">Trainee cum Project Manager</Typography>
                                        <Typography variant="subtitle2">Microsoft, TX, USA</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </SubCard>
                </Grid>
            </Grid>
        </Grid>
    </Grid>
);

export default ClientAccountPage;
