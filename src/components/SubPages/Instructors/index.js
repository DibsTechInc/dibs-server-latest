import { useState, useEffect } from 'react';

import { Grid, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'store';
import getInstructors from 'actions/studios/instructors/getInstructors';
import InstructorList from './InstructorList';

const ManageInstructors = () => {
    const theme = useTheme();
    const { dibsStudioId } = useSelector((state) => state.dibsstudio.config);
    const [activeAccounts, setActiveAccounts] = useState([]);
    const [refreshData, setRefreshData] = useState(false);
    const [inactiveAccounts, setInactiveAccounts] = useState([]);
    const [doneLoadingAccounts, setDoneLoadingAccounts] = useState(false);
    const [viewingActiveAccounts, setViewingActiveAccounts] = useState(true);
    useEffect(() => {
        const getAccountInfo = async () => {
            getInstructors(dibsStudioId).then((sc) => {
                if (sc.msg === 'success') {
                    setActiveAccounts(sc.activeInstructors);
                    setInactiveAccounts(sc.disabledInstructors);
                    setDoneLoadingAccounts(true);
                }
            });
            setRefreshData(false);
        };
        getAccountInfo();
    }, [dibsStudioId, refreshData]);
    const accountsToSend = viewingActiveAccounts ? activeAccounts : inactiveAccounts;
    const instructorguidance = `Click on an instructor below to edit their account information. If you'd like to grant an instructor login privileges, you must create a user account for the instructor in the 'Accounts' section.`;
    return (
        <Grid container>
            <Grid item xs={10}>
                <Typography gutterBottom variant="h5" sx={{ color: theme.palette.text.hint, fontWeight: 400 }}>
                    {instructorguidance}
                </Typography>
            </Grid>
            {doneLoadingAccounts && (
                <Grid item xs={12} sx={{ mt: 3 }}>
                    <InstructorList list={accountsToSend} viewingActiveAccounts={viewingActiveAccounts} setRefreshData={setRefreshData} />
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
export default ManageInstructors;
