import React from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Grid, Typography } from '@mui/material';
import getClientTransactions from 'actions/studios/users/getClientTransactions';

import { useSelector } from 'store';

// ==============================|| TRANSACTION HISTORY - TYPE PURCHASES ||============================== //

const TransactionHistoryPurchases = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { userid } = useParams();
    console.log('this is a test');
    React.useEffect(() => {
        console.log('running the useEffect client transactions');
        const getTransactions = async () => {
            const type = 'purchases';
            await getClientTransactions(dibsStudioId, userid, type).then((transactions) => {
                console.log(`transactions returned from api call are: ${JSON.stringify(transactions)}`);
            });
        };
        // create the action to call the data
        // pass the data to the table component
        // pass the type to the table component
        // on the table component page, get the headers
        getTransactions();
    }, [dibsStudioId, userid]);
    return (
        <Grid container direction="column">
            <Grid item xs={5}>
                <Typography gutterBottom variant="h4">
                    Purchases will go here
                </Typography>
            </Grid>
        </Grid>
    );
};

export default TransactionHistoryPurchases;
