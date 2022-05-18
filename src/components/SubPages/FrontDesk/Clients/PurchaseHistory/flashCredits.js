import React from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';
import getClientTransactions from 'actions/studios/users/getClientTransactions';
import FlashCreditTable from 'shared/components/Table/FlashCreditTable';

import { useSelector, useDispatch } from 'store';
import getCurrentClientInfo from 'actions/studios/users/getCurrentClientInfo';
import { setCurrentClientProfileStudioAdmin } from 'store/slices/currentclient';

// ==============================|| TRANSACTION HISTORY - TYPE UPCOMING CLASSES ||============================== //

const TransactionHistoryFlashCredits = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { userid } = useParams();
    const dispatch = useDispatch();
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [didRun, setDidRun] = React.useState(false);
    const [firstName, setFirstName] = React.useState('');
    React.useEffect(() => {
        const getTransactions = async () => {
            const type = 'flash';
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
    const getHeaderEntries = () => ['Date Awarded', 'Amount Earned', 'Expiration', 'Used'];
    const noPurchasesString = `${firstName} has not received any flash credits yet.`;
    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                {loading ? (
                    <Typography variant="h5">Loading...</Typography>
                ) : (
                    <FlashCreditTable
                        loading={loading}
                        data={transactions}
                        noneString={noPurchasesString}
                        typeprop="flash"
                        headers={getHeaderEntries()}
                    />
                )}
            </Grid>
        </Grid>
    );
};

export default TransactionHistoryFlashCredits;
