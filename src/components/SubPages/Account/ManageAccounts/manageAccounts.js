import { useState, useEffect } from 'react';

import { Grid, TextField, Typography, Button, Switch, FormGroup, FormControlLabel, CardHeader, Avatar, IconButton } from '@mui/material';
import { styled, useTheme, alpha } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { useSelector } from 'store';
import validator from 'email-validator';
import { validatePhone } from 'helpers/general';
import UpdateStudioProfileAccount from 'actions/studios/account/createNewEmployeeAccount';
import getEmployeeAccounts from 'actions/studios/account/getStudioEmployeeAccounts';
import EmployeeAccountList from './EmployeeAccountList';

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

const ManageAccountsComponent = () => {
    const theme = useTheme();
    const { dibsStudioId } = useSelector((state) => state.dibsstudio.config);
    const [activeAccounts, setActiveAccounts] = useState([]);
    const [inactiveAccounts, setInactiveAccounts] = useState([]);
    const [doneLoadingAccounts, setDoneLoadingAccounts] = useState(false);
    useEffect(() => {
        const getAccountInfo = async () => {
            getEmployeeAccounts(dibsStudioId).then((sc) => {
                if (sc.msg === 'success') {
                    setActiveAccounts(sc.activeEmployeeAccounts);
                    setInactiveAccounts(sc.inactiveEmployeeAccounts);
                    setDoneLoadingAccounts(true);
                }
            });
        };
        getAccountInfo();
    }, [dibsStudioId]);
    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                <Typography gutterBottom variant="h6" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    Click on a staff account below to manage the account. If you need to re-enable disabled accounts, click here to see all
                    of your disabled accounts.
                </Typography>
            </Grid>
            {doneLoadingAccounts && (
                <Grid item xs={7} sx={{ mt: 3 }}>
                    <EmployeeAccountList list={activeAccounts} />
                </Grid>
            )}
            {!doneLoadingAccounts && (
                <Grid item xs={12} sx={{ mt: 3 }}>
                    Loading...
                </Grid>
            )}
        </Grid>
    );
};
export default ManageAccountsComponent;
