import * as React from 'react';
import { useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';

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
import { useSelector, useDispatch } from 'store';
import CollectPaymentInfo from '../../../stripe/CardPayments';

// actions
// import findOrCreateStripeCustomer from 'actions/studios/users/findOrCreateStripeCustomer';
import getCurrentClientInfo from 'actions/studios/users/getCurrentClientInfo';

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
const ClientAccountPage = () => {
    console.log('ClientAccountPage running now');
    const { userid } = useParams();
    console.log(`userid for this client page is: ${userid}`);
    const { profile } = useSelector((state) => state.currentclient);
    const { name } = profile;
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [birthday, setBirthday] = React.useState('N/A');
    const [clientSecret, setClientSecret] = React.useState(null);
    const [stripeid, setStripeid] = React.useState('');
    const [stripeCardId, setStripeCardId] = React.useState('');
    const [hasPaymentMethod, setHasPaymentMethod] = React.useState(false);
    const [cardInfo, setCardInfo] = React.useState([]);
    // pull all of the client information including name based on their id
    React.useEffect(() => {
        console.log(`\n\n\n%%%%%%%%%%%%%%%%%`);
        console.log('ClientAccountPage useEffect running now');
        getCurrentClientInfo(userid).then((user) => {
            console.log(`user returned from client page is: ${JSON.stringify(user)}`);
            if (user !== 0) {
                setUsername(user.nameToDisplay);
                setEmail(user.email);
                setPhone(user.labelphone);
                if (user.birthday) setBirthday(user.birthday);
                if (user.stripeid) setStripeid(user.stripeid);
                if (user.stripe_cardid) setStripeCardId(user.stripe_cardid);
                console.log(`user.stripeid is: ${user.stripeid}`);
                if (user.stripeid !== null) {
                    // get client payment methods
                    console.log(`stripeid (CLIENT ACCOUNT PAGE) is: ${user.stripeid}`);
                    axios
                        .post('/api/stripe-get-payment-methods', {
                            stripeid
                        })
                        .then((response) => {
                            console.log(`\n\n\n\ndo something here related to getting the stripe customer info`);
                            console.log(`response from get payment methods is: ${JSON.stringify(response)}`);
                            if (response.data.msg === 'success') {
                                console.log(`success is true for getting payment methods`);
                                if (response.data.paymentMethods.length > 0) {
                                    console.log(`there is a payment method in stripe`);
                                    setHasPaymentMethod(true);
                                    console.log(`payment methods are: ${JSON.stringify(response.data.paymentMethods)}`);
                                    setCardInfo(response.data.paymentMethods);
                                }
                            }
                        });
                } else {
                    // set up a new payment method - no stripe id for this client
                    // set something here to handle case where user already has stripe id
                    console.log(`\n\nGOING TO SET UP INTENT\n\n`);
                    console.log(`stripeid (CLIENT ACCOUNT PAGE) is: ${user.stripeid}`);
                    axios
                        .post('/api/stripe-setup-intent', {
                            userid
                        })
                        .then((response) => {
                            console.log(`\n\n\n#########\n\nsetting the client now`);
                            setClientSecret(response.data.stripeIntent);
                            setStripeid(response.data.stripeId);
                        });
                }
            }
        });
        // findOrCreateStripeCustomer('alicia.ulin2@gmail.com', 'Alicia Ulin');
    }, [userid, stripeid]);
    return (
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
                                    {username}
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
                                    {email}
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
                                    {phone}
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
                                    {birthday}
                                </Typography>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    </List>
                    {/* <CardContent sx={{ px: '4px !important', mt: '8px' }}>
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
                    </CardContent> */}
                </SubCard>
                <Grid item xs={12} sx={{ mt: 1 }}>
                    <SubCard title="Payment Information">
                        {clientSecret && <CollectPaymentInfo clientSecret={clientSecret} />}
                        {cardInfo.length > 0 && <CollectPaymentInfo cardInfo={cardInfo} />}
                    </SubCard>
                </Grid>
                <Grid item xs={12} sx={{ mt: 1 }}>
                    <SubCard title="Client Notes">CLIENT NOTES WILL GO HERE</SubCard>
                </Grid>
            </Grid>
            <Grid item lg={8} xs={12}>
                <Grid container direction="column" spacing={gridSpacing}>
                    <Grid item xs={12}>
                        <SubCard
                            title="UPCOMING CLASSES"
                            // secondary={
                            //     <Button>
                            //         <IconEdit stroke={1.5} size="1.3rem" />
                            //     </Button>
                            // }
                        >
                            <Grid container direction="column" spacing={2}>
                                <Grid item xs={12}>
                                    BOOK A CLASS BUTTON (off to the right)
                                    <br />
                                    <br />
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
                        <SubCard
                            title="AVAILABLE PASSES"
                            // secondary={
                            //     <Button>
                            //         <IconEdit stroke={1.5} size="1.3rem" />
                            //     </Button>
                            // }
                        >
                            <Grid container direction="column" spacing={2}>
                                <Grid item xs={12}>
                                    PURCHASE A NEW PACKAGE OR MEMBERSHIP (off to the right)
                                    <br />
                                    <br />
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
                        <SubCard
                            title="CREDIT AMOUNT"
                            // secondary={
                            //     <Button>
                            //         <IconEdit stroke={1.5} size="1.3rem" />
                            //     </Button>
                            // }
                        >
                            <Grid container direction="column" spacing={2}>
                                <Grid item xs={12}>
                                    ADD OR REMOVE CREDITS (off to the right)
                                    <br />
                                    <br />
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
                        <SubCard
                            title="RETAIL"
                            // secondary={
                            //     <Button>
                            //         <IconEdit stroke={1.5} size="1.3rem" />
                            //     </Button>
                            // }
                        >
                            <Grid container direction="column" spacing={2}>
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
                        <SubCard
                            title="GIFT CARDS"
                            // secondary={
                            //     <Button>
                            //         <IconEdit stroke={1.5} size="1.3rem" />
                            //     </Button>
                            // }
                        >
                            <Grid container direction="column" spacing={2}>
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
                </Grid>
            </Grid>
        </Grid>
    );
};

export default ClientAccountPage;
