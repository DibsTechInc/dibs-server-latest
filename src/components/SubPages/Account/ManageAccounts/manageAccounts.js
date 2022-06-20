import { useState, useEffect } from 'react';

import { Grid, Typography, Button } from '@mui/material';
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
    const [viewingActiveAccounts, setViewingActiveAccounts] = useState(true);
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
    const toggleActiveAccounts = () => {
        setViewingActiveAccounts(!viewingActiveAccounts);
    };
    const accountsToSend = viewingActiveAccounts ? activeAccounts : inactiveAccounts;
    const guidancetext = viewingActiveAccounts ? 'to see your disabled accounts.' : 'to go back to your active accounts.';
    const firstguidancetext = viewingActiveAccounts
        ? 'If you want to re-activate disabled accounts,'
        : 'You are viewing disabled accounts.';
    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                <Typography gutterBottom variant="h5" sx={{ color: theme.palette.text.hint, mt: 1, fontWeight: 400 }}>
                    Click on a staff account below to manage the account. {firstguidancetext}
                    <Button
                        variant="text"
                        onClick={toggleActiveAccounts}
                        sx={{
                            fontWeight: 500,
                            backgroundColor: 'transparent',
                            color: theme.palette.secondary.main,
                            fontSize: '1rem',
                            ml: 0,
                            mr: 0,
                            mb: 0.3,
                            px: 0.5,
                            '&:hover': {
                                backgroundColor: '#ccc'
                            }
                        }}
                    >
                        click here
                    </Button>
                    {guidancetext}
                </Typography>
            </Grid>
            {doneLoadingAccounts && (
                <Grid item xs={7} sx={{ mt: 3 }}>
                    <EmployeeAccountList
                        list={accountsToSend}
                        viewingActiveAccounts={viewingActiveAccounts}
                        setRefreshData={setRefreshData}
                    />
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
