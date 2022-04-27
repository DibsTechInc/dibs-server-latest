import * as React from 'react';
import { useParams } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import validator from 'email-validator';

// material-ui
import {
    // Box,
    Button,
    // CardContent,
    Chip,
    Divider,
    Grid,
    // IconButton,
    InputBase,
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
    // TextField,
    Typography,
    ClickAwayListener
} from '@mui/material';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';

// assets
// import { IconEdit } from '@tabler/icons';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import CakeTwoToneIcon from '@mui/icons-material/CakeTwoTone';
import { useSelector } from 'store';
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
    const textInput = React.useRef(null);
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
    const [newClientSecret, setNewClientSecret] = React.useState(null);
    const [showAddCardComponent, setShowAddCardComponent] = React.useState(false);
    const [editingEmail, setEditingEmail] = React.useState(false);
    React.useEffect(() => {
        if (cardValueChanged) {
            setUserBackground('');
            setDoneLoadingClientInfo(false);
            setDoneLoadingPaymentMethods(false);
            setDoneGettingClientSecret(false);
            setCardValueChanged(false);
            setReady(false);
        }
        const getClientInfo = async () => {
            await getCurrentClientInfo(userid, dibsStudioId).then((user) => {
                if (user !== 0) {
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
        };
        const getClientPaymentMethods = async () => {
            if (stripeid) {
                await axios
                    .post('/api/stripe-get-payment-methods', {
                        userid,
                        stripeid,
                        studioStripeId,
                        dibsStudioId
                    })
                    .then((response) => {
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
            setDoneLoadingPaymentMethods(true);
        };
        const getClientSecret = async () => {
            await axios
                .post('/api/stripe-setup-intent', {
                    userid,
                    stripeid
                })
                .then((response) => {
                    setClientSecret(response.data.stripeIntent);
                    setStripeid(response.data.stripeId);
                    setDoneGettingClientSecret(true);
                });
        };
        const setupclientinfo = async () => {
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
    const toggleEditingEmail = () => {
        if (!editingEmail) {
            setTimeout(() => {
                textInput.current.focus();
            }, 100);
        }
        if (editingEmail) {
            const editedemail = textInput.current.value;
            const isEmail = validator.validate(editedemail);
            if (isEmail) setEmail(editedemail);
            textInput.current.blur();
        }
        setEditingEmail(!editingEmail);
    };
    const handleClickAway = () => {
        setEditingEmail(false);
    };
    // eslint-disable-next-line no-unused-vars
    const getNewSetupIntent = async (event) => {
        console.log(`BUTTON WAS CLICKED`);
        await axios
            .post('/api/stripe-setup-intent', {
                stripeid,
                userid
            })
            .then((response) => {
                console.log(`\n\n\n##############\n\nNEW CLIENT SECRET MORE CARDS is being set now`);
                console.log(`new clientSecret is: ${response.data.clientSecret}`);
                setNewClientSecret(response.data.stripeIntent);
                // setStripeid(response.data.stripeId);
                setShowAddCardComponent(true);
            });
    };
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
                        <ClickAwayListener onClickAway={handleClickAway}>
                            <ListItemButton
                                onClick={() => toggleEditingEmail()}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        toggleEditingEmail();
                                    }
                                }}
                            >
                                <ListItemIcon>
                                    <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                                <ListItemSecondaryAction>
                                    {!editingEmail ? (
                                        <Typography variant="subtitle2" align="right">
                                            {email}
                                        </Typography>
                                    ) : (
                                        <InputBase
                                            sx={{ color: '#9e9e9e', fontSize: '.75rem' }}
                                            type="text"
                                            placeholder="Enter New Email"
                                            inputProps={{
                                                style: { textAlign: 'right' }
                                            }}
                                            inputRef={textInput}
                                        />
                                    )}
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </ClickAwayListener>
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
                        {!showAddCardComponent && (
                            <Grid item xs={3} sx={{ mt: 4 }}>
                                <Button
                                    onClick={(event) => getNewSetupIntent(event)}
                                    sx={{ width: '100px', height: '20px', fontSize: '12px', fontWeight: 200, color: '#fff' }}
                                >
                                    Add new card
                                </Button>
                            </Grid>
                        )}
                        {showAddCardComponent && (
                            <CollectPaymentInfo
                                dibsCardInfo={null}
                                hasPaymentMethod={false}
                                clientSecret={newClientSecret}
                                studioCardInfo={null}
                                setCardValueChanged={setCardValueChanged}
                                addSpace
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
