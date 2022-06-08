/* eslint-disable camelcase */
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

const AccountStatus = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { admin, instructor_only } = config;
    let status = admin
        ? `You have full administrative privileges. You can view and edit ALL sections of the Dibs Management Software. To add accounts for other staff members, click on the 'Create Accounts' tab above.`
        : 'You have staff privileges. Contact an admin if you need to change your account privileges.';
    status = instructor_only ? 'You have instructor privileges. Contact an admin if you need to change your account privileges.' : status;
    return (
        <Grid container direction="column">
            <Typography gutterBottom variant="h7">
                {status}
            </Typography>
        </Grid>
    );
};

export default AccountStatus;
