import { useState } from 'react';

import { Grid, TextField, Typography, Button, Switch, FormGroup, FormControlLabel } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { useSelector } from 'store';
import validator from 'email-validator';
import { validatePhone } from 'helpers/general';
import UpdateStudioProfileAccount from 'actions/studios/account/createNewEmployeeAccount';

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

const CreateAccountComponent = () => {
    const theme = useTheme();
    const { dibsStudioId } = useSelector((state) => state.dibsstudio.config);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [allowManagerAccess, setAllowManagerAccess] = useState(false);
    const allowManagerAccessLabel = 'Allow manager access';
    const managerText = `Managers have access to all areas of the platform including financial data and reporting. If you do not enable manager access, this account will be limited to the 'Front Desk' and 'Class Schedule' sections of the platform.`;
    const [checkedManager, setCheckedManager] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    // not including instructor account for now because it is not high demand
    const handleChange = (event) => {
        setCheckedManager(event.target.checked);
        setAllowManagerAccess(!allowManagerAccess);
    };
    const clearData = () => {
        setPhone('');
        setEmail('');
        setFirstName('');
        setLastName('');
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
    };
    const handleTextChange = (e) => {
        if (e.target.id === 'phone') setPhone(e.target.value);
        if (e.target.id === 'email') setEmail(e.target.value);
        if (e.target.id === 'firstname') setFirstName(e.target.value);
        if (e.target.id === 'lastname') setLastName(e.target.value);
    };
    const handleSubmit = async () => {
        console.log(`submitting the new employee account`);
        const isValidEmail = validator.validate(email);
        if (!isValidEmail) {
            handleErrorProcess(`The email address you entered doesn't seem to be valid. Can you try again?`);
            return;
        }
        console.log(`phone is: ${phone}`);
        if (phone.length > 2) {
            const isValidPhone = validatePhone(phone);
            if (!isValidPhone) {
                handleErrorProcess(`The phone number you entered doesn't seem to be valid. Can you try again?`);
                return;
            }
        }
        await UpdateStudioProfileAccount(dibsStudioId, firstName, lastName, email, phone, allowManagerAccess).then((res) => {
            if (res.msg === 'failure') {
                handleErrorProcess(res.error);
            }
            if (res.msg === 'success') {
                handleSuccessProcess(
                    'Successfully created a new employee account. You can create another account by submitting new information.'
                );
            }
        });
    };
    return (
        <Grid container>
            <Grid item xs={12}>
                <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint, fontWeight: 400 }}>
                    Fill in the information below to create new accounts for your employees and staff.
                </Typography>
            </Grid>
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
            <Grid item xs={7} sx={{ mt: 4 }}>
                <CreateAccountTextField
                    required
                    id="firstname"
                    label="First Name"
                    value={firstName}
                    variant="standard"
                    sx={{ mr: 3, width: 220 }}
                    onChange={(e) => handleTextChange(e)}
                />
                <CreateAccountTextField
                    required
                    id="lastname"
                    label="Last Name"
                    value={lastName}
                    variant="standard"
                    sx={{ mr: 3, width: 220 }}
                    onChange={(e) => handleTextChange(e)}
                />
            </Grid>
            <Grid item xs={7} sx={{ mt: 4 }}>
                <CreateAccountTextField
                    required
                    id="email"
                    label="Email"
                    value={email}
                    variant="standard"
                    sx={{ mr: 3, width: 220 }}
                    onChange={(e) => handleTextChange(e)}
                />
                <CreateAccountTextField
                    id="phone"
                    label="Phone Number"
                    value={phone}
                    variant="standard"
                    sx={{ mr: 3, width: 220 }}
                    onChange={(e) => handleTextChange(e)}
                />
            </Grid>
            <Grid item xs={7} sx={{ mt: 4 }}>
                <FormGroup>
                    <FormControlLabel
                        control={<GreenSwitch checked={checkedManager} onChange={handleChange} />}
                        label={allowManagerAccessLabel}
                    />
                </FormGroup>
                <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    {managerText}
                </Typography>
            </Grid>
            {/* <Grid item xs={7} sx={{ mt: 4 }}>
                <FormGroup>
                    <FormControlLabel control={<GreenSwitch checked={checkedInstructor} />} label={instructorAccessOnlyLabel} />
                </FormGroup>
            </Grid> */}
            <Grid item xs={7} sx={{ mt: 4 }}>
                <Button onClick={handleSubmit}>Create New Account</Button>
            </Grid>
        </Grid>
    );
};
export default CreateAccountComponent;
