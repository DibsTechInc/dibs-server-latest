import React from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';
import getClientTransactions from 'actions/studios/users/getClientTransactions';
import UpcomingClassesTable from 'shared/components/Table/UpcomingClassesTable';
import getCurrentClientInfo from 'actions/studios/users/getCurrentClientInfo';
import { setCurrentClientProfileStudioAdmin } from 'store/slices/currentclient';

import { useSelector, useDispatch } from 'store';

// ==============================|| TRANSACTION HISTORY - TYPE UPCOMING CLASSES ||============================== //

const TransactionHistoryDroppedClasses = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const dispatch = useDispatch();
    const { userid } = useParams();
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [didRun, setDidRun] = React.useState(false);
    const [firstName, setFirstName] = React.useState('');
    React.useEffect(() => {
        const getTransactions = async () => {
            const type = 'dropped';
            setLoading(true);
            await getClientTransactions(dibsStudioId, userid, type).then((transactions) => {
                setTransactions(transactions);
                setLoading(false);
                setDidRun(true);
            });
            await getCurrentClientInfo(userid, dibsStudioId).then((user) => {
                if (user !== 0) {
                    setFirstName(user.firstname);
                    dispatch(setCurrentClientProfileStudioAdmin({ id: userid, label: user.nameToDisplay, firstname: user.firstname }));
                }
            });
            return () => {
                setLoading(false);
                setTransactions([]);
                setDidRun(false);
            };
        };
        if (!didRun && !loading) getTransactions();
    }, [dibsStudioId, userid, loading, didRun, dispatch]);
    const getHeaderEntries = () => ['Date', 'Time', 'Class', 'Instructor', 'Payment Method'];
    const noClasses = `${firstName} does not have any dropped classes.`;
    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                {loading ? (
                    <Typography variant="h5">Loading...</Typography>
                ) : (
                    <UpcomingClassesTable
                        loading={loading}
                        data={transactions}
                        noneString={noClasses}
                        typeprop="dropped"
                        headers={getHeaderEntries()}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default TransactionHistoryDroppedClasses;
