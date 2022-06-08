import { useState } from 'react';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { Grid, TextField, Button, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { useSelector } from 'store';

const AccountTextField = styled(TextField)({
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

const auth = getAuth();
const user = auth.currentUser;

const ChangePassword = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { email } = config;
    const theme = useTheme();
    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasSuccess, setHasSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [password, setPassword] = useState('******');
    const [passwordConfirm, setPasswordConfirm] = useState('******');
    const [passwordOld, setPasswordOld] = useState('******');
    const [madePasswordBlank, setMadePasswordBlank] = useState(false);
    const newPassword = password;
    const reauthenticateUser = async (pwd) => {
        const credential = EmailAuthProvider.credential(email, pwd);
        await reauthenticateWithCredential(user, credential)
            .then(() => {
                console.log('reauthenticated');
                return true;
            })
            .catch((error) => {
                console.log(`error in reauth - ${error}`);
                return false;
            });
    };
    const handleSetNewPassword = async () => {
        if (password !== passwordConfirm) {
            console.log('Passwords do not match');
            setHasError(true);
            setErrorMessage('Passwords do not match. Please enter your the passwords again.');
            setTimeout(() => {
                setHasError(false);
                setErrorMessage('');
            }, 7000);
            return;
        }
        const authenticated = reauthenticateUser(passwordOld);
        console.log(`authenticated: ${authenticated}`);
        if (authenticated) {
            updatePassword(user, newPassword)
                .then(() => {
                    console.log('Password updated successfully');
                    setMadePasswordBlank(false);
                    setHasSuccess(true);
                    setSuccessMessage('Password updated successfully.');
                    setTimeout(() => {
                        setHasSuccess(false);
                        setSuccessMessage('');
                    }, 7000);
                })
                .catch((error) => {
                    console.log(`error setting password: ${error}`);
                    setHasError(true);
                    setErrorMessage(
                        `There was an error updating your password. Did you enter your old password before pressing submit? Error: ${error} Contact studios@ondibs.com if you continue to have problems.`
                    );
                    setTimeout(() => {
                        setHasError(false);
                        setErrorMessage('');
                    }, 12000);
                });
        }
    };
    const handlePasswordFocus = () => {
        if (!madePasswordBlank) {
            setPassword('');
            setPasswordConfirm('');
            setPasswordOld('');
            setMadePasswordBlank(true);
        }
    };
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };
    const handleChangePasswordConfirm = (e) => {
        setPasswordConfirm(e.target.value);
    };
    const handleChangePasswordOld = (e) => {
        setPasswordOld(e.target.value);
    };
    return (
        <Grid container direction="column">
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
            <Grid item xs={12} sx={{ mb: 4 }}>
                <AccountTextField
                    required
                    id="passwordOld"
                    label="Old Password"
                    value={passwordOld}
                    variant="standard"
                    sx={{ mr: 3 }}
                    type="password"
                    onChange={(e) => handleChangePasswordOld(e)}
                    onFocus={handlePasswordFocus}
                />
            </Grid>
            <Grid item xs={12}>
                <AccountTextField
                    required
                    id="password"
                    label="Password"
                    value={password}
                    variant="standard"
                    sx={{ mr: 3 }}
                    type="password"
                    onChange={(e) => handleChangePassword(e)}
                    onFocus={handlePasswordFocus}
                />
                <AccountTextField
                    required
                    id="password2"
                    label="Confirm Password"
                    value={passwordConfirm}
                    variant="standard"
                    sx={{ mr: 3 }}
                    type="password"
                    onChange={(e) => handleChangePasswordConfirm(e)}
                    onFocus={handlePasswordFocus}
                />
            </Grid>
            <Grid item xs={12} sx={{ mt: 4 }}>
                <Button
                    onClick={handleSetNewPassword}
                    sx={{
                        bgcolor: theme.palette.globalcolors.submit,
                        '&:hover': {
                            backgroundColor: theme.palette.globalcolors.hoverSubmit
                        }
                    }}
                >
                    Set New Password
                </Button>
            </Grid>
        </Grid>
    );
};

export default ChangePassword;
