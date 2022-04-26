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
    const { userid } = useParams();
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const [username, setUsername] = React.useState('');
    const [userBackground, setUserBackground] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [birthday, setBirthday] = React.useState('N/A');
    const [clientSecret, setClientSecret] = React.useState(null);
    const [stripeid, setStripeid] = React.useState('');
    const [studioStripeId, setStudioStripeId] = React.useState('');
    const [hasPaymentMethod, setHasPaymentMethod] = React.useState(false);
    const [dibsCardInfo, setDibsCardInfo] = React.useState(null);
    const [studioCardInfo, setStudioCardInfo] = React.useState(null);
    const [doneLoadingClientInfo, setDoneLoadingClientInfo] = React.useState(false);
    const [doneLoadingPaymentMethods, setDoneLoadingPaymentMethods] = React.useState(false);
    const [doneGettingClientSecret, setDoneGettingClientSecret] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [cardValueChanged, setCardValueChanged] = React.useState(false);
    // pull all of the client information including name based on their id
    React.useEffect(() => {
        if (cardValueChanged) {
            setUserBackground('');
            setDoneLoadingClientInfo(false);
            setDoneLoadingPaymentMethods(false);
            setDoneGettingClientSecret(false);
            setCardValueChanged(false);
            setReady(false);
        }
        console.log(`just after useEffect - try to determine what changed`);
        const getClientInfo = async () => {
            console.log(`GET CURRENT CLIENT INFO STEP ONE`);
            await getCurrentClientInfo(userid, dibsStudioId).then((user) => {
                if (user !== 0) {
                    console.log(`user is: ${user}`);
                    setUsername(user.nameToDisplay);
                    setUserBackground(user.nameToDisplay);
                    setEmail(user.email);
                    setPhone(user.labelphone);
                    if (user.birthday) setBirthday(user.birthday);
                    if (user.stripeid) setStripeid(user.stripeid);
                    if (user.studioStripeId) setStudioStripeId(user.studioStripeId);
                    setDoneLoadingClientInfo(true);
                }
            });
            console.log('done with step one');
        };
        const getClientPaymentMethods = async () => {
            console.log(`GET CURRENT PAYMENT INFO STEP TWO`);
            if (stripeid) {
                await axios
                    .post('/api/stripe-get-payment-methods', {
                        userid,
                        stripeid,
                        studioStripeId,
                        dibsStudioId
                    })
                    .then((response) => {
                        console.log(`response from getClientPaymentMethods is: ${response}`);
                        if (response.data.msg === 'success') {
                            if (response.data.paymentMethodsStudio.data.length > 0 || response.data.paymentMethodsDibs.data.length > 0) {
                                console.log(`THERE is at least ONE payment method in stripe`);
                                setHasPaymentMethod(true);
                                setStudioStripeId(response.data.paymentMethodsStudio.data[0].customer);
                                setStudioCardInfo(response.data.paymentMethodsStudio.data);
                                setDibsCardInfo(response.data.paymentMethodsDibs.data);
                            }
                        } else if (response.data.msg === 'no payment methods on dibs') {
                            console.log(`THERE is NO payment method in stripe`);
                            setHasPaymentMethod(false);
                        } else {
                            console.log(`Error getting payment info from stripe`);
                            setHasPaymentMethod(false);
                        }
                    });
            }
            console.log('done with step two');
            setDoneLoadingPaymentMethods(true);
        };
        const getClientSecret = async () => {
            console.log(`GET CURRENT CLIENT SECRET`);
            await axios
                .post('/api/stripe-setup-intent', {
                    userid,
                    stripeid
                })
                .then((response) => {
                    console.log(`\n\n\n##############\n\nCLIENT SECRET is being set now`);
                    console.log(`clientSecret is: ${response.data.clientSecret}`);
                    setClientSecret(response.data.stripeIntent);
                    setStripeid(response.data.stripeId);
                    setDoneGettingClientSecret(true);
                });
            console.log('done with step three');
        };
        const setupclientinfo = async () => {
            console.log(`\n\n\n\n\n\n\n\n\n\n\nusername is: ${userBackground}`);
            console.log(`\n\n\n\n\n\n\n\n\n\n\nstripeid is: ${stripeid}`);
            console.log(`doneLoadingClientInfo: ${doneLoadingClientInfo}`);
            console.log(`doneLoadingPaymentMethods: ${doneLoadingPaymentMethods}`);
            console.log(`hasPaymentMethod: ${hasPaymentMethod}`);
            if (userBackground === '') {
                await getClientInfo();
            }
            if (doneLoadingClientInfo && !doneLoadingPaymentMethods) {
                await getClientPaymentMethods();
            }
            if (!hasPaymentMethod && doneLoadingClientInfo && doneLoadingPaymentMethods && !doneGettingClientSecret) {
                await getClientSecret();
            }
        };
        setupclientinfo();
        if (hasPaymentMethod || clientSecret) {
            setReady(true);
        }
    }, [
        clientSecret,
        dibsCardInfo,
        dibsStudioId,
        doneGettingClientSecret,
        doneLoadingClientInfo,
        doneLoadingPaymentMethods,
        hasPaymentMethod,
        stripeid,
        studioStripeId,
        userid,
        userBackground,
        cardValueChanged,
        username
    ]);
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
                </SubCard>
                <Grid item xs={12} sx={{ mt: 1 }}>
                    <SubCard title="Payment Information">
                        {/* {clientSecret && <CollectPaymentInfo clientSecret={clientSecret} />}
                        {doneLoading && <CollectPaymentInfo dibsCardInfo={dibsCardInfo} studioCardInfo={studioCardInfo} />} */}
                        {ready && (
                            <CollectPaymentInfo
                                dibsCardInfo={dibsCardInfo}
                                hasPaymentMethod={hasPaymentMethod}
                                clientSecret={clientSecret}
                                studioCardInfo={studioCardInfo}
                                setCardValueChanged={setCardValueChanged}
                            />
                        )}
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
