import { useState, useEffect } from 'react';

import { Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useSelector } from 'store';
import getInstructors from 'actions/studios/instructors/getInstructors';
import InstructorList from './InstructorList';

const ManageInactiveInstructors = () => {
    const theme = useTheme();
    const { dibsStudioId } = useSelector((state) => state.dibsstudio.config);
    const [refreshData, setRefreshData] = useState(false);
    const [inactiveAccounts, setInactiveAccounts] = useState([]);
    const viewingActiveAccounts = false;
    const [doneLoadingAccounts, setDoneLoadingAccounts] = useState(false);
    useEffect(() => {
        const getAccountInfo = async () => {
            getInstructors(dibsStudioId).then((sc) => {
                if (sc.msg === 'success') {
                    setInactiveAccounts(sc.disabledInstructors);
                    setDoneLoadingAccounts(true);
                }
            });
            setRefreshData(false);
        };
        getAccountInfo();
    }, [dibsStudioId, refreshData]);
    const instructorguidance = `Click on an instructor below to edit their information. If you'd like to grant an instructor login privileges, you must create a user account for the instructor in the 'Accounts' section.`;
    console.log(`inactive accounts are: ${JSON.stringify(inactiveAccounts)}`);
    return (
        <Grid container>
            <Grid item xs={10}>
                <Typography gutterBottom variant="h5" sx={{ color: theme.palette.text.hint, fontWeight: 400 }}>
                    {instructorguidance}
                </Typography>
            </Grid>
            {doneLoadingAccounts && (
                <Grid item xs={12} sx={{ mt: 3 }}>
                    <InstructorList list={inactiveAccounts} viewingActiveAccounts={viewingActiveAccounts} setRefreshData={setRefreshData} />
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
export default ManageInactiveInstructors;
