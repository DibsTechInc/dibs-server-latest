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
import UpdateStudioEmployeeAccount from 'actions/studios/account/updateStudioEmployeeAccount';
import DeactivateStudioEmployeeAccount from 'actions/studios/account/deactivateStudioEmployeeAccount';

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

export default function ModalAccountEditor({
    openStatus,
    employeeId,
    firstname,
    lastname,
    email,
    admin,
    phone,
    handleModalClose,
    setRefreshData
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
    const handleClose = () => {
        setOpen(false);
        setHasSuccess(false);
        setHasError(false);
        setClickedDeactivate(false);
        setDeactivateAccount(false);
        handleModalClose();
    };

    React.useEffect(() => {
        if (openStatus) {
            handleOpen();
        }
        if (!openStatus) {
            handleClose();
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
        if (admin) {
            setCheckedManager(true);
            setAllowManagerAccess(true);
        }
    }, [openStatus, firstname, lastname, email, phoneString, admin]);
    const allowManagerAccessLabel = `Allow manager access is ${checkedManager ? 'ON' : 'OFF'}`;
    const deactiveThisAccount = `Deactivate this account`;
    const handleChange = (event) => {
        setCheckedManager(event.target.checked);
        setAllowManagerAccess(!allowManagerAccess);
    };
    const handleDeactivateChange = (event) => {
        setDeactivateAccount(!deactivateAccount);
        setTimeout(() => {
            setClickedDeactivate(!clickedDeactivate);
        }, 700);
    };
    // const managerText = `Managers have access to all areas of the platform including financial data and reporting. If you do not enable manager access, this account will be limited to the 'Front Desk' and 'Class Schedule' sections of the platform.`;
    const handleTextChange = (e) => {
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
        setTimeout(() => {
            setHasError(false);
            setErrorMessage('');
        }, 10000);
    };
    const handleSuccessProcess = (successMsg) => {
        setHasError(false);
        setSuccessMessage(successMsg);
        setHasSuccess(true);
        setTimeout(() => {
            setHasSuccess(false);
            setSuccessMessage('');
        }, 7000);
        clearData();
        handleClose();
    };
    const handleCancel = () => {
        handleClose();
        clearData();
    };
    const handleDeactivateSubmit = async () => {
        await DeactivateStudioEmployeeAccount(employeeId).then((res) => {
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
        const isValidEmail = validator.validate(emailStr);
        if (!isValidEmail) {
            handleErrorProcess(`The email address you entered doesn't seem to be valid. Can you try again?`);
            return;
        }
        if (phoneStr.length > 4) {
            const isValidPhone = validatePhone(phoneStr);
            if (!isValidPhone) {
                handleErrorProcess(`The phone number you entered doesn't seem to be valid. Can you try again?`);
                return;
            }
        }
        await UpdateStudioEmployeeAccount(employeeId, firstnameStr, lastnameStr, emailStr, phoneStr, allowManagerAccess).then((res) => {
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
    const areYouSure = `Are you sure you want to deactivate ${firstnameStr}'s account?`;
    const noteToReactive = `You can enable it again at any time by viewing your inactive accounts and clicking 'Reactivate'`;
    return (
        <div>
            <Modal open={open} onClose={handleModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Edit Employee Account
                    </Typography>
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
                            </Grid>
                        </Fade>
                    )}
                    {/* end of deactivate account question */}
                    {!clickedDeactivate && (
                        <Grid container spacing={2}>
                            <Grid item xs={12} sx={{ mt: 2.5 }}>
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
                                    required
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
                            <Grid item xs={12} sx={{ mt: 2 }}>
                                <FormGroup>
                                    <FormControlLabel
                                        control={<GreenSwitch checked={checkedManager} onChange={handleChange} />}
                                        label={allowManagerAccessLabel}
                                    />
                                </FormGroup>
                            </Grid>
                            {!clickedDeactivate && (
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
                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <FormGroup>
                                            <FormControlLabel
                                                control={<RedSwitch checked={deactivateAccount} onChange={handleDeactivateChange} />}
                                                label={deactiveThisAccount}
                                            />
                                        </FormGroup>
                                    </Grid>
                                </>
                            )}
                        </Grid>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
ModalAccountEditor.propTypes = {
    openStatus: PropTypes.bool,
    employeeId: PropTypes.number,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string,
    admin: PropTypes.bool,
    phone: PropTypes.string,
    handleModalClose: PropTypes.func,
    setRefreshData: PropTypes.func
};
