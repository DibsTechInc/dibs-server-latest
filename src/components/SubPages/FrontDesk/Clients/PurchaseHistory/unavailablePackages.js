import React from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';
import getClientTransactions from 'actions/studios/users/getClientTransactions';
import Table from 'shared/components/Table';

import { useSelector } from 'store';

// ==============================|| TRANSACTION HISTORY - TYPE UNAVAILABLE PACKAGES ||============================== //

const TransactionHistoryUnavailablePacks = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { userid } = useParams();
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [didRun, setDidRun] = React.useState(false);
    React.useEffect(() => {
        const getTransactions = async () => {
            const type = 'unavailable-packs';
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
    const getHeaderEntries = () => ['Purchase Date', 'Item', 'Expiration', 'Amount Charged', 'Forfeited Uses', 'Edit'];
    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                {loading ? (
                    <Typography variant="h5">Loading...</Typography>
                ) : (
                    <Table loading={loading} data={transactions} typeprop="unavailablePacks" headers={getHeaderEntries()} />
                )}
            </Grid>
        </Grid>
    );
};

export default TransactionHistoryUnavailablePacks;
