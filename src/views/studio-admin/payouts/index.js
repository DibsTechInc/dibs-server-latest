import { useEffect, useState } from 'react';
import axios from 'axios';

// material-ui
import { Grid } from '@mui/material';

// redux
import { useDispatch, useSelector } from 'store';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import GetPayouts from 'actions/studios/payouts/getPayouts';
import PayoutsMainPage from '../../../components/EntryPages/payouts';

// ==============================|| STUDIO PAYOUTS ||============================== //

const Payouts = () => {
    const { config } = useSelector((state) => state.dibsstudio);
    const { id, dibsStudioId } = config;
    const [isLoading, setIsLoading] = useState(false);
    const [payoutsData, setPayoutsData] = useState([]);
    const [error, setError] = useState('');
    const [hasError, setHasError] = useState(false);
    const [showNormal, setShowNormal] = useState(true);
    useEffect(() => {
        const getPayouts = async () => {
            setIsLoading(true);
            await GetPayouts(dibsStudioId, id)
                .then((payments) => {
                    if (payments.msg === 'success') {
                        const { payouts } = payments;
                        setPayoutsData(payouts);
                        setIsLoading(false);
                    } else {
                        const { error } = payments;
                        setError(error);
                        setHasError(true);
                        setIsLoading(false);
                        setShowNormal(false);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                });
        };
        getPayouts();
    }, [dibsStudioId, id]);
    return (
        <MainCard title="Payouts" sx={{ borderRadius: 2 }}>
            {hasError && (
                <Grid container spacing={3}>
                    <Grid item xs={9} sx={{ ml: 2, mt: 2 }}>
                        <p>{error}</p>
                    </Grid>
                </Grid>
            )}
            {isLoading && (
                <Grid container>
                    <Grid item xs={12} sx={{ ml: 2, mt: 2 }}>
                        Loading...
                    </Grid>
                </Grid>
            )}
            {!isLoading && showNormal && <PayoutsMainPage listofpayouts={payoutsData} />}
        </MainCard>
    );
};

export default Payouts;
