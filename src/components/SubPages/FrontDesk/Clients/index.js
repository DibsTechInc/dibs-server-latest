import * as React from 'react';
import { useParams } from 'react-router-dom';
// import { loadStripe } from '@stripe/stripe-js';
// import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import validator from 'email-validator';

// material-ui
import {
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
    ClickAwayListener,
    Box
} from '@mui/material';

import UnstyledDropButton from 'assets/graphics/icons/DropButton';

// project imports
import Avatar from 'ui-component/extended/Avatar';
import { gridSpacing } from 'store/constant';
import SubCard from 'ui-component/cards/SubCard';
import UpcomingClasses from '../../../SubComponents/FrontDesk/UpcomingClasses';

// assets
// import { IconEdit } from '@tabler/icons';
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import MailTwoToneIcon from '@mui/icons-material/MailTwoTone';
import CakeTwoToneIcon from '@mui/icons-material/CakeTwoTone';
import { useSelector } from 'store';
import CollectPaymentInfo from '../../../stripe/CardPayments';
import ErrorMessage from 'ui-component/modals/ErrorMessage';

// actions
// import findOrCreateStripeCustomer from 'actions/studios/users/findOrCreateStripeCustomer';
import getCurrentClientInfo from 'actions/studios/users/getCurrentClientInfo';
import updateClientInfo from 'actions/studios/users/updateClientInfo';
import getNumberVisits from 'actions/studios/users/getNumberVisits';

// import ShowUpcomingClasses from 'components/SubComponents/FrontDesk/UpcomingClasses';

const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

// personal details table
/** names Don&apos;t look right */
function createData(id, date, name, time, instructor, packageApplied, carbs, protein) {
    const id2 = `${id}2`;
    return { id, id2, date, name, time, instructor, packageApplied, carbs, protein };
}

// ==============================|| SAMPLE PAGE ||============================== //
const rows = [
    createData(15, 'Friday, May 2nd, 2022', 'MANIC MONDAY (121 LUDLOW L.E.S)', '8:00AM', 'Coss Marte', 'Unlimited Membership'),
    createData(16, 'Thursday, May 18th, 2022', 'TOUGH LOVE TUESDAY (121 LUDLOW LES)', '9:00AM', 'Jeanette Heck', '10 Pack'),
    createData(18, 'Friday, May 19th, 2022', 'FULL BODY FRIDAY (121 LUDLOW L.E.S)', '10:00AM', 'Erik Ulin', 'Single Class'),
    createData(19, 'Monday, May 22nd, 2022', 'class title 4', '10:20AM', 'Jane Raily', '5 Pack'),
    createData(20, 'Tuesday, May 23rd, 2022', 'class title 5', '11:00AM', 'Alvin Martin', '8 Pack')
];
console.log(`rows: ${JSON.stringify(rows)}`);
const ClientAccountPage = () => {
    const textInput = React.useRef('email');
    const phoneInput = React.useRef('phone');
    const birthdayInput = React.useRef('birthday');
    const { userid } = useParams();
    const [error, setError] = React.useState(null);
    const [numVisits, setNumVisits] = React.useState(0);
    const [errorOptions, setErrorOptions] = React.useState({});
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const [username, setUsername] = React.useState('');
    const [userBackground, setUserBackground] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [phone, setPhone] = React.useState('No Phone');
    const [hasError, setHasError] = React.useState(false);
    const [birthday, setBirthday] = React.useState('N/A');
    const [clientSecret, setClientSecret] = React.useState(null);
    const [stripeid, setStripeid] = React.useState('');
    const [studioStripeId, setStudioStripeId] = React.useState('');
    const [hasPaymentMethod, setHasPaymentMethod] = React.useState(false);
    const [dibsCardInfo, setDibsCardInfo] = React.useState(null);
    const [studioCardInfo, setStudioCardInfo] = React.useState(null);
    const [doneLoadingClientInfo, setDoneLoadingClientInfo] = React.useState(false);
    const [picurl, setPicurl] = React.useState('//d1f9yoxjfza91b.cloudfront.net/dibs-user-placeholder.png');
    const [doneLoadingPaymentMethods, setDoneLoadingPaymentMethods] = React.useState(false);
    const [doneGettingClientSecret, setDoneGettingClientSecret] = React.useState(false);
    const [ready, setReady] = React.useState(false);
    const [cardValueChanged, setCardValueChanged] = React.useState(false);
    const [newClientSecret, setNewClientSecret] = React.useState(null);
    const [showAddCardComponent, setShowAddCardComponent] = React.useState(false);
    const [editingEmail, setEditingEmail] = React.useState(false);
    const [editingPhone, setEditingPhone] = React.useState(false);
    const [editingBirthday, setEditingBirthday] = React.useState(false);
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
                    setPicurl(user.pictureUrl);
                    if (user.birthday) setBirthday(user.birthday);
                    if (user.stripeid) setStripeid(user.stripeid);
                    if (user.studioStripeId) setStudioStripeId(user.studioStripeId);
                    setDoneLoadingClientInfo(true);
                }
            });
            await getNumberVisits(userid, dibsStudioId).then((num) => {
                setNumVisits(num);
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
                                setHasPaymentMethod(true);
                                setStudioStripeId(response.data.paymentMethodsStudio.data[0].customer);
                                setStudioCardInfo(response.data.paymentMethodsStudio.data);
                                setDibsCardInfo(response.data.paymentMethodsDibs.data);
                            }
                        } else if (response.data.msg === 'no payment methods on dibs') {
                            setHasPaymentMethod(false);
                        } else {
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
        return () => {
            setReady(false);
            setEditingPhone(false);
            setEditingEmail(false);
        };
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
    const toggleEditingPhone = async () => {
        if (!editingPhone) {
            setTimeout(() => {
                phoneInput.current.focus();
            }, 100);
        }
        if (editingPhone) {
            const editedphone = phoneInput.current.value;
            if (editedphone) {
                const updated = await updateClientInfo(userid, null, null, editedphone);
                if (updated !== 1) {
                    setError(updated.error);
                    setErrorOptions({
                        name: updated.nameofuser,
                        email: updated.emailofuser,
                        errorMsg: updated.error,
                        errorType: updated.errorType
                    });
                    setHasError(true);
                } else {
                    const number = phoneUtil.parseAndKeepRawInput(editedphone, 'US');
                    const labelphone = phoneUtil.format(number, PNF.NATIONAL);
                    setPhone(labelphone);
                }
            }
            phoneInput.current.blur();
        }
        setEditingPhone(!editingPhone);
    };
    const toggleEditingBirthday = async () => {
        if (!editingBirthday) {
            setTimeout(() => {
                birthdayInput.current.focus();
            }, 100);
        }
        if (editingBirthday) {
            const editedbirthday = birthdayInput.current.value;
            if (editedbirthday) {
                const birthdayupdate = await updateClientInfo(userid, null, null, null, editedbirthday);
                if (birthdayupdate !== 1) {
                    setError(birthdayupdate.error);
                    setErrorOptions({
                        name: birthdayupdate.nameofuser,
                        email: birthdayupdate.emailofuser,
                        errorMsg: birthdayupdate.error,
                        errorType: birthdayupdate.errorType
                    });
                    setHasError(true);
                } else {
                    setBirthday(editedbirthday);
                }
            }
            birthdayInput.current.blur();
        }
        setEditingBirthday(!editingBirthday);
    };
    const toggleEditingEmail = async () => {
        if (!editingEmail) {
            setTimeout(() => {
                textInput.current.focus();
            }, 100);
        }
        if (editingEmail) {
            const editedemail = textInput.current.value;
            const isEmail = validator.validate(editedemail);
            if (isEmail) {
                // working here - update email address
                const updated = await updateClientInfo(userid, editedemail);
                if (updated !== 1) {
                    setError(updated.error);
                    setErrorOptions({
                        name: updated.nameofuser,
                        email: updated.email
                    });
                    setHasError(true);
                } else {
                    setEmail(editedemail);
                }
            }
            textInput.current.blur();
        }
        setEditingEmail(!editingEmail);
    };
    const handleClickAway = () => {
        setEditingEmail(false);
        // setEditingPhone(false);
    };
    // eslint-disable-next-line no-unused-vars
    const getNewSetupIntent = async (event) => {
        await axios
            .post('/api/stripe-setup-intent', {
                stripeid,
                userid
            })
            .then((response) => {
                setNewClientSecret(response.data.stripeIntent);
                setShowAddCardComponent(true);
            });
    };
    return (
        <Grid container spacing={2}>
            <ErrorMessage isOpen={hasError} setHasError={setHasError} errormsg={error} errorOptions={errorOptions} />
            <Grid item lg={3.75} xs={12}>
                <SubCard
                    title={
                        <Grid container spacing={2} alignItems="center">
                            <Grid item>
                                <Avatar alt={username} src={picurl} size="sm" />
                            </Grid>
                            <Grid item xs zeroMinWidth>
                                <Typography align="left" variant="subtitle1">
                                    {username}
                                </Typography>
                                <Typography align="left" variant="subtitle2">
                                    ({numVisits} visits)
                                </Typography>
                            </Grid>
                            {/* <Grid item>
                                <Chip size="small" label="Top 5%" color="primary" />
                            </Grid> */}
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
                                sx={{ pl: 0.7 }}
                            >
                                <ListItemIcon sx={{ paddingRight: 0 }}>
                                    <MailTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                                </ListItemIcon>
                                <ListItemText primary={<Typography variant="subtitle1">Email</Typography>} />
                                <ListItemSecondaryAction sx={{ right: '8px' }}>
                                    {!editingEmail ? (
                                        <Typography variant="subtitle2">{email}</Typography>
                                    ) : (
                                        <InputBase
                                            id="emailInput"
                                            sx={{ color: '#9e9e9e', fontSize: '.75rem' }}
                                            type="email"
                                            placeholder="Enter New Email"
                                            inputProps={{
                                                style: { textAlign: 'right' }
                                            }}
                                            // inputRef={textInput}
                                            inputRef={textInput}
                                        />
                                    )}
                                </ListItemSecondaryAction>
                            </ListItemButton>
                        </ClickAwayListener>
                        <Divider />
                        <ListItemButton
                            onClick={() => toggleEditingPhone()}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    toggleEditingPhone();
                                }
                            }}
                            sx={{ pl: 0.75 }}
                        >
                            <ListItemIcon>
                                <PhonelinkRingTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Phone</Typography>} />
                            <ListItemSecondaryAction sx={{ right: '8px' }}>
                                {!editingPhone ? (
                                    <Typography variant="subtitle2" align="right">
                                        {phone}
                                    </Typography>
                                ) : (
                                    <InputBase
                                        sx={{ color: '#9e9e9e', fontSize: '.75rem' }}
                                        type="text"
                                        id="phoneField"
                                        placeholder="Enter New Phone #"
                                        // value={handlePhoneInput(phone)}
                                        inputProps={{
                                            style: { textAlign: 'right' }
                                        }}
                                        // inputRef={textInput}
                                        inputRef={phoneInput}
                                    />
                                )}
                            </ListItemSecondaryAction>
                        </ListItemButton>
                        <Divider />
                        <ListItemButton
                            onClick={() => toggleEditingBirthday()}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    toggleEditingBirthday();
                                }
                            }}
                            sx={{ pl: 0.7 }}
                        >
                            <ListItemIcon>
                                <CakeTwoToneIcon sx={{ fontSize: '1.3rem' }} />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="subtitle1">Birthday</Typography>} />
                            <ListItemSecondaryAction sx={{ right: '8px' }}>
                                {!editingBirthday ? (
                                    <Typography variant="subtitle2" align="right">
                                        {birthday}
                                    </Typography>
                                ) : (
                                    <InputBase
                                        sx={{ color: '#9e9e9e', fontSize: '.75rem' }}
                                        type="text"
                                        id="birthday"
                                        placeholder="MM/DD"
                                        // value={handlePhoneInput(phone)}
                                        inputProps={{
                                            style: { textAlign: 'right' }
                                        }}
                                        // inputRef={textInput}
                                        inputRef={birthdayInput}
                                    />
                                )}
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
                            secondary={
                                <Grid item xs={3} sx={{ mt: 1, mb: 1 }}>
                                    <Button
                                        onClick={(event) => getNewSetupIntent(event)}
                                        sx={{ width: '120px', height: '30px', fontSize: '12px', fontWeight: 200, color: '#fff' }}
                                    >
                                        Add Client To Class
                                    </Button>
                                </Grid>
                            }
                        >
                            <UpcomingClasses userid={userid} dibsStudioId={dibsStudioId} />
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
                                    {/* <TableContainer>
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
                                                    <TableRow key={row.id}>
                                                        <TableCell variant="head">{row.name}</TableCell>
                                                        <TableCell>{row.calories}</TableCell>
                                                        <TableCell>{row.fat}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer> */}
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
                                    {/* <TableContainer>
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
                                    </TableContainer> */}
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
                                    {/* <TableContainer>
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
                                    </TableContainer> */}
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
                                    {/* <TableContainer>
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
                                    </TableContainer> */}
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
