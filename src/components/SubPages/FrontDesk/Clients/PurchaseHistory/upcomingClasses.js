import React from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';
import getClientTransactions from 'actions/studios/users/getClientTransactions';
import UpcomingClassesTable from 'shared/components/Table/UpcomingClassesTable';

import { useSelector } from 'store';

// ==============================|| TRANSACTION HISTORY - TYPE UPCOMING CLASSES ||============================== //

const TransactionHistoryUpcomingClasses = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { userid } = useParams();
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [didRun, setDidRun] = React.useState(false);
    React.useEffect(() => {
        const getTransactions = async () => {
            const type = 'upcoming';
            setLoading(true);
            await getClientTransactions(dibsStudioId, userid, type).then((transactions) => {
                setTransactions(transactions);
                setLoading(false);
                setDidRun(true);
            });
            return () => {
                setLoading(false);
                setTransactions([]);
                setDidRun(false);
            };
        };
        if (!didRun && !loading) getTransactions();
    }, [dibsStudioId, userid, loading, didRun]);
    const getHeaderEntries = () => ['Date', 'Time', 'Class', 'Instructor', 'Payment Method', 'Drop Class'];
    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                {loading ? (
                    <Typography variant="h5">Loading...</Typography>
                ) : (
                    <UpcomingClassesTable loading={loading} data={transactions} typeprop="upcoming" headers={getHeaderEntries()} />
                )}
            </Grid>
        </Grid>
    );
};

export default TransactionHistoryUpcomingClasses;
