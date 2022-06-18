import { useState, useEffect } from 'react';

import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'store';
import getEmployeeAccounts from 'actions/studios/account/getStudioEmployeeAccounts';
import EmployeeAccountList from './EmployeeAccountList';

const ManageAccountsComponent = () => {
    const theme = useTheme();
    const { dibsStudioId } = useSelector((state) => state.dibsstudio.config);
    const [activeAccounts, setActiveAccounts] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
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
            setRefreshData(false);
        };
        getAccountInfo();
    }, [dibsStudioId, refreshData]);
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
                    <EmployeeAccountList list={activeAccounts} setRefreshData={setRefreshData} />
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
