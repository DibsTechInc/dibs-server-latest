import React from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';
import getClientTransactions from 'actions/studios/users/getClientTransactions';
import FlashCreditTable from 'shared/components/Table/FlashCreditTable';

import { useSelector } from 'store';

// ==============================|| TRANSACTION HISTORY - TYPE UPCOMING CLASSES ||============================== //

const TransactionHistoryFlashCredits = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { userid } = useParams();
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [didRun, setDidRun] = React.useState(false);
    React.useEffect(() => {
        const getTransactions = async () => {
            const type = 'flash';
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
    const getHeaderEntries = () => ['Date Awarded', 'Amount Earned', 'Expiration', 'Used'];
    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                {loading ? (
                    <Typography variant="h5">Loading...</Typography>
                ) : (
                    <FlashCreditTable loading={loading} data={transactions} typeprop="flash" headers={getHeaderEntries()} />
                )}
            </Grid>
        </Grid>
    );
};

export default TransactionHistoryFlashCredits;
