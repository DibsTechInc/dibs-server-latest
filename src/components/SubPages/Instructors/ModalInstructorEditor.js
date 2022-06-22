import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Grid from '@mui/material/Grid';
import { Switch, TextField, FormGroup, FormControlLabel, Divider, Fade } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { green, red, grey } from '@mui/material/colors';
import validator from 'email-validator';
import { validatePhone, formatPhone } from 'helpers/general';
import UpdateInstructorInfo from 'actions/studios/instructors/updateInstructorInfo';
import DeactivateInstructor from 'actions/studios/instructors/deactivateInstructor';
import ReactivateInstructor from 'actions/studios/instructors/reactivateInstructor';

// ==============================|| MODAL EDITOR ||============================== //

const CreateAccountTextField = styled(TextField)({
    '& .MuiInput-underline:before': {
        borderBottomColor: '#ccc'
    },
    '& .MuiInput-underline:before:hover': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#c96248'
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderBottomColor: '#c96248'
    }
});

const GreenSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
        color: theme.palette.success.dibsgreen,
        '&:hover': {
            backgroundColor: alpha(green[600], theme.palette.success.successDibsGreen)
        }
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: green[600]
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: green[600]
    }
}));
const RedSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: grey[400]
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
        color: red[600]
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
        backgroundColor: red[600]
    },
    '& .MuiSwitch-switchBase + .MuiSwitch-track': {
        backgroundColor: grey[400]
    }
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 550,
    bgcolor: 'background.paper',
    border: '2px solid #d3e2d5',
    boxShadow: 24,
    p: 3,
    borderRadius: '6px'
};

export default function ModalInstructorEditor({
    openStatus,
    instructorID,
    firstname,
    lastname,
    email,
    adminStatus,
    loginStatusInstructor,
    canlogin,
    phone,
    handleModalClose,
    setRefreshData,
    viewingActiveAccounts
}) {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const [allowManagerAccess, setAllowManagerAccess] = React.useState(false);
    const [hasError, setHasError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');
    const [hasSuccess, setHasSuccess] = React.useState(false);
    const [successMessage, setSuccessMessage] = React.useState('');
    const [clickedDeactivate, setClickedDeactivate] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const [checkedManager, setCheckedManager] = React.useState(false);
    const [deactivateAccount, setDeactivateAccount] = React.useState(false);
    const phoneString = phone || 'N/A';
    const [phoneStr, setPhoneStr] = React.useState(phoneString);
    const [emailStr, setEmailStr] = React.useState(email);
    const [firstnameStr, setFirstnameStr] = React.useState(firstname);
    const [lastnameStr, setLastnameStr] = React.useState(lastname);
    const [timeoutArray, setTimeoutArray] = React.useState([]);

    React.useEffect(() => {
        console.log('use effect is running');
        if (openStatus) {
            handleOpen();
        }
        if (!openStatus) {
            setOpen(false);
        }
        if (firstname.length > 1) {
            setFirstnameStr(firstname);
        }
        if (lastname.length > 1) {
            setLastnameStr(lastname);
        }
        if (email.length > 1) {
            setEmailStr(email);
        }
        if (phoneString.length > 1) {
            const phoneFormatted = formatPhone(phoneString);
            setPhoneStr(phoneFormatted);
        }
        if (canlogin) {
            setCheckedManager(true);
            setAllowManagerAccess(true);
        }
        if (!canlogin) {
            setCheckedManager(false);
            setAllowManagerAccess(false);
        }
        return () => {
            timeoutArray.forEach((timeout) => {
                clearTimeout(timeout);
            });
        };
    }, [instructorID, openStatus, firstname, lastname, email, phoneString, timeoutArray, canlogin]);
    const handleClose = () => {
        setOpen(false);
        setHasSuccess(false);
        setHasError(false);
        setClickedDeactivate(false);
        setDeactivateAccount(false);
        handleModalClose();
    };
    const displayLoginPrivileges = `${firstnameStr} ${checkedManager ? 'DOES' : 'does NOT'} have login privileges.`;
    const deactiveThisInstructor = `Deactivate this instructor`;
    const handleChange = (event) => {
        setCheckedManager(event.target.checked);
        setAllowManagerAccess(!allowManagerAccess);
    };
    const handleDeactivateChange = (event) => {
        setDeactivateAccount(!deactivateAccount);
        const tid = setTimeout(() => {
            setClickedDeactivate(!clickedDeactivate);
        }, 700);
        setTimeoutArray([...timeoutArray, tid]);
    };
    // const managerText = `Managers have access to all areas of the platform including financial data and reporting. If you do not enable manager access, this account will be limited to the 'Front Desk' and 'Class Schedule' sections of the platform.`;
    const handleTextChange = (e) => {
        console.log(`targetid is: ${e.target.id}`);
        console.log(`target value is: ${e.target.value}`);
        if (e.target.id === 'phone') setPhoneStr(e.target.value);
        if (e.target.id === 'email') setEmailStr(e.target.value);
        if (e.target.id === 'firstname') setFirstnameStr(e.target.value);
        if (e.target.id === 'lastname') setLastnameStr(e.target.value);
    };
    const clearData = () => {
        setPhoneStr('');
        setEmailStr('');
        setFirstnameStr('');
        setLastnameStr('');
        setCheckedManager(false);
        setAllowManagerAccess(false);
    };
    const handleErrorProcess = (errorMsg) => {
        setHasSuccess(false);
        setErrorMessage(errorMsg);
        setHasError(true);
        const tid = setTimeout(() => {
            setHasError(false);
            setErrorMessage('');
        }, 10000);
        setTimeoutArray([...timeoutArray, tid]);
    };
    const handleSuccessProcess = (successMsg) => {
        setHasError(false);
        setSuccessMessage(successMsg);
        setHasSuccess(true);
        const tid = setTimeout(() => {
            setHasSuccess(false);
            setSuccessMessage('');
        }, 7000);
        setTimeoutArray([...timeoutArray, tid]);
        clearData();
        handleClose();
    };
    const handleCancel = () => {
        handleClose();
        clearData();
    };
    const handleDeactivateSubmit = async () => {
        console.log(`deactivate instructor is happening: ${instructorID}`);
        await DeactivateInstructor(instructorID).then((res) => {
            if (res.msg === 'failure') {
                handleErrorProcess(res.error);
            }
            if (res.msg === 'success') {
                handleSuccessProcess(`Successfully deactivated ${firstnameStr}'s account. You can re-enable it at any time.`);
                setRefreshData(true);
            }
        });
    };
    const handleReactivateSubmit = async () => {
        await ReactivateInstructor(instructorID).then((res) => {
            if (res.msg === 'failure') {
                handleErrorProcess(res.error);
            }
            if (res.msg === 'success') {
                handleSuccessProcess(`Successfully deactivated ${firstnameStr}'s account. You can re-enable it at any time.`);
                setRefreshData(true);
            }
        });
    };
    const handleSubmit = async () => {
        if (emailStr.length > 5) {
            const isValidEmail = validator.validate(emailStr);
            if (!isValidEmail) {
                handleErrorProcess(`The email address you entered doesn't seem to be valid. Can you try again?`);
                return;
            }
        }
        if (phoneStr.length > 4) {
            const isValidPhone = validatePhone(phoneStr);
            if (!isValidPhone) {
                handleErrorProcess(`The phone number you entered doesn't seem to be valid. Can you try again?`);
                return;
            }
        }
        await UpdateInstructorInfo(instructorID, firstnameStr, lastnameStr, emailStr, phoneStr).then((res) => {
            if (res.msg === 'failure') {
                handleErrorProcess(res.error);
            }
            if (res.msg === 'success') {
                handleSuccessProcess(
                    `Successfully updated ${firstnameStr}'s account. You can create another account by submitting new information.`
                );
                setRefreshData(true);
            }
        });
    };
    const areYouSure = `Are you sure you want to deactivate ${firstnameStr} as an instructor?`;
    const reactivateAccountString = `You must activate ${firstnameStr} as an instructor before you can make edits. Do you want to activate ${firstnameStr} as an instructor now?`;
    const noteToReactive = `You can reactivate ${firstnameStr}'s instructor status at any time by viewing your inactive instructors and clicking 'Reactivate'.`;
    const extranote = `Please Note: Employee accounts are not affected by instructor deactivation. If ${firstnameStr} currently has login privileges, that account will still function as normal unless you explicitly disable it.`;
    const noteToReactivation = `Once you activate ${firstnameStr} as an instructor, you will be able to edit information by clicking the link above to return to 'Active Instructors'.`;
    const titleHeader = `Manage ${firstnameStr}'s Information`;
    const subtext = `This screen helps you collect contact information and manage how ${firstnameStr}'s name appears on your schedule as an instructor.`;
    const loginInfo = `If you want to update ${firstnameStr}'s login privileges, you can manage or create accounts on the 'Accounts' tab.`;
    return (
        <div>
            <Modal open={open} onClose={handleModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    {!viewingActiveAccounts && (
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Instructor Information
                        </Typography>
                    )}
                    {hasError && (
                        <Grid item xs={12}>
                            <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                                {errorMessage}
                            </Typography>
                        </Grid>
                    )}
                    {hasSuccess && (
                        <Grid item xs={12}>
                            <Typography variant="body1" sx={{ mb: 2, color: theme.palette.success.dark }}>
                                {successMessage}
                            </Typography>
                        </Grid>
                    )}
                    {/* deactivate account question */}
                    {clickedDeactivate && (
                        <Fade in={clickedDeactivate}>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <Typography variant="h4" sx={{ color: theme.palette.error.main }}>
                                        {areYouSure}
                                    </Typography>
                                </Grid>
                                <Grid container spacing={2} sx={{ mt: 2, ml: 0.1 }}>
                                    <Grid item>
                                        <Button
                                            onClick={handleCancel}
                                            sx={{
                                                bgcolor: theme.palette.globalcolors.cancel,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.globalcolors.hover
                                                }
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            onClick={handleDeactivateSubmit}
                                            sx={{
                                                bgcolor: theme.palette.globalcolors.submit,
                                                '&:hover': {
                                                    backgroundColor: theme.palette.globalcolors.hoverSubmit
                                                }
                                            }}
                                        >
                                            Yes
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <Typography variant="h7" sx={{ fontStyle: 'italic' }}>
                                        {noteToReactive}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <Typography variant="h7" sx={{ fontStyle: 'italic' }}>
                                        {extranote}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Fade>
                    )}
                    {/* end of deactivate account question */}
                    {!clickedDeactivate && viewingActiveAccounts && (
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="h4">{titleHeader}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h7">{subtext}</Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 1.75 }}>
                                <CreateAccountTextField
                                    required
                                    id="firstname"
                                    label="First Name"
                                    value={firstnameStr}
                                    variant="standard"
                                    sx={{ mr: 4, width: 220 }}
                                    onChange={(e) => handleTextChange(e)}
                                />
                                <CreateAccountTextField
                                    required
                                    id="lastname"
                                    label="Last Name"
                                    value={lastnameStr}
                                    variant="standard"
                                    sx={{ width: 220 }}
                                    onChange={(e) => handleTextChange(e)}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <CreateAccountTextField
                                    id="email"
                                    label="Email"
                                    value={emailStr}
                                    variant="standard"
                                    sx={{ mr: 4, width: 220 }}
                                    onChange={(e) => handleTextChange(e)}
                                />
                                <CreateAccountTextField
                                    id="phone"
                                    label="Phone Number"
                                    value={phoneStr}
                                    variant="standard"
                                    sx={{ width: 220 }}
                                    onChange={(e) => handleTextChange(e)}
                                />
                            </Grid>
                            {!clickedDeactivate && viewingActiveAccounts && (
                                <>
                                    <Grid container spacing={2} sx={{ mt: 2, ml: 0.1 }}>
                                        <Grid item>
                                            <Button
                                                onClick={handleCancel}
                                                sx={{
                                                    bgcolor: theme.palette.globalcolors.cancel,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.globalcolors.hover
                                                    }
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                onClick={handleSubmit}
                                                sx={{
                                                    bgcolor: theme.palette.globalcolors.submit,
                                                    '&:hover': {
                                                        backgroundColor: theme.palette.globalcolors.hoverSubmit
                                                    }
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                    <Grid item xs={12} sx={{ mt: 2, mb: 0 }}>
                                        {displayLoginPrivileges}
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 0 }}>
                                        <Typography variant="h7">{loginInfo}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<RedSwitch checked={deactivateAccount} onChange={handleDeactivateChange} />}
                                                label={deactiveThisInstructor}
                                            />
                                        </FormGroup>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    )}
                    {!viewingActiveAccounts && (
                        <Grid container>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="h4" sx={{ color: theme.palette.success.dark }}>
                                    {reactivateAccountString}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <Typography variant="h7" sx={{ fontStyle: 'italic' }}>
                                    {noteToReactivation}
                                </Typography>
                            </Grid>
                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item>
                                    <Button
                                        onClick={handleCancel}
                                        sx={{
                                            bgcolor: theme.palette.globalcolors.cancel,
                                            '&:hover': {
                                                backgroundColor: theme.palette.globalcolors.hover
                                            }
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        onClick={handleReactivateSubmit}
                                        sx={{
                                            bgcolor: theme.palette.globalcolors.submit,
                                            '&:hover': {
                                                backgroundColor: theme.palette.globalcolors.hoverSubmit
                                            }
                                        }}
                                    >
                                        Yes
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
ModalInstructorEditor.propTypes = {
    openStatus: PropTypes.bool,
    instructorID: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    handleModalClose: PropTypes.func,
    setRefreshData: PropTypes.func,
    viewingActiveAccounts: PropTypes.bool,
    canlogin: PropTypes.bool
};
