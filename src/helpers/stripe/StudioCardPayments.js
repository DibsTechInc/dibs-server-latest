/* eslint-disable camelcase */
// import React from 'react';
// import ReactDOM from 'react-dom';
import axios from 'axios';
import propTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Grid, Typography, Button } from '@mui/material';
import { useSelector, useDispatch } from 'store';
import { setIsEditingCreditCardRedux, setNeedToGetCardInfoFromStripeRedux } from 'store/slices/actionstatus';

import './stripe.css';

import StudioCheckoutForm from './StudioCheckoutForm';

const StudioPaymentForm = (props) => {
    const dispatch = useDispatch();
    const { stripeid, billingContact, billingEmail } = props;
    const { config } = useSelector((state) => state.dibsstudio);
    const { isEditingCreditCardViaStripe, needToGetCardInfoFromStripe } = useSelector((state) => state.actionstatus);
    const { dibsStudioId } = config;
    const [getCardInfoAgain, setGetCardInfoAgain] = useState(needToGetCardInfoFromStripe);
    const [publishableKey, setPublishableKey] = useState('');
    const [hasPaymentMethod, setHasPaymentMethod] = useState(false);
    const [lastFour, setLastFour] = useState('');
    const [expMonth, setExpMonth] = useState('');
    const [expYear, setExpYear] = useState('');
    const [stripePromiseLoaded, setStripePromiseLoaded] = useState(false);
    const [stripeidValue, setStripeidValue] = useState(stripeid);
    const [doneGettingClientSecret, setDoneGettingClientSecret] = useState(false);
    const [isUpdatingCreditCard, setIsUpdatingCreditCard] = useState(false);
    const [clientSecret, setClientSecret] = useState(null);
    const [doneLoadingPaymentMethods, setDoneLoadingPaymentMethods] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [stripePromise, setStripePromise] = useState(null);
    // const appearance = {
    //     theme: 'stripe'
    // };
    // const options = {
    //     clientSecret,
    //     appearance
    // };
    useEffect(() => {
        if (needToGetCardInfoFromStripe) setGetCardInfoAgain(true);
        const getKey = async () => {
            await axios.post('api/get-stripe-publishable-key').then((res) => {
                setPublishableKey(res.data.stripePublishableKey);
            });
        };
        const loadStripePromise = () => {
            if (publishableKey !== '') setStripePromise(loadStripe(publishableKey, { apiVersion: '2020-08-27' }));
            setStripePromiseLoaded(true);
        };
        const getClientSecret = async () => {
            await axios
                .post('/api/stripe-setup-studio-intent', {
                    dibsStudioId,
                    stripeidValue,
                    billingContact,
                    billingEmail
                })
                .then((response) => {
                    setClientSecret(response.data.stripeIntent);
                    setStripeidValue(response.data.stripeId);
                    setDoneGettingClientSecret(true);
                });
        };
        const getPaymentMethods = async () => {
            await axios
                .post('/api/stripe-get-studio-payment-methods', {
                    stripeid
                })
                .then((response) => {
                    if (response.data.msg === 'success') {
                        if (response.data.paymentOnFile) {
                            setHasPaymentMethod(true);
                            const { card } = response.data.paymentInfo;
                            // eslint-disable-next-line camelcase
                            const { last4, exp_month, exp_year } = card;
                            setLastFour(last4);
                            setExpMonth(exp_month);
                            setExpYear(exp_year);
                            setDoneLoadingPaymentMethods(true);
                            setGetCardInfoAgain(false);
                            dispatch(setNeedToGetCardInfoFromStripeRedux(false));
                        }
                    } else {
                        setHasPaymentMethod(false);
                    }
                });
        };
        if (publishableKey === '') getKey();
        if (publishableKey !== '' && !stripePromiseLoaded) loadStripePromise();
        if (stripeidValue && !doneLoadingPaymentMethods) getPaymentMethods();
        if (getCardInfoAgain) getPaymentMethods();
        if (isUpdatingCreditCard) getClientSecret();
    }, [
        stripeid,
        publishableKey,
        stripeidValue,
        isUpdatingCreditCard,
        dibsStudioId,
        billingContact,
        billingEmail,
        doneLoadingPaymentMethods,
        stripePromiseLoaded,
        getCardInfoAgain,
        needToGetCardInfoFromStripe,
        dispatch
    ]);
    const handleEditCreditCardClick = () => {
        setIsUpdatingCreditCard(true);
        dispatch(setIsEditingCreditCardRedux(true));
    };
    if (!doneLoadingPaymentMethods) {
        return (
            <Grid container sx={{ mt: 4 }}>
                <Grid item xs={7}>
                    Loading credit card details...
                </Grid>
            </Grid>
        );
    }
    if ((hasPaymentMethod && !isUpdatingCreditCard) || !isEditingCreditCardViaStripe) {
        const cc = `XXXX-XXXX-XXXX-${lastFour}`;
        const exp = `${expMonth}/${expYear}`;
        return (
            <Grid container sx={{ mt: 4 }}>
                <Grid item xs={7}>
                    <Grid item xs={12} sx={{ mt: 2 }}>
                        <Grid container sx={{ mb: 3, mt: 1 }}>
                            <Grid item xs={11}>
                                <Typography variant="h5">Credit Card Information</Typography>
                            </Grid>
                            <Grid item sx={{ mt: 4, mr: 8 }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: '100', color: '#999' }}>Credit Card Number</Typography>
                                <Typography sx={{ mt: 1 }}>{cc}</Typography>
                            </Grid>
                            <Grid item sx={{ mt: 4, mr: 6 }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: '100', color: '#999' }}>Exp. Date</Typography>
                                <Typography sx={{ mt: 1 }}>{exp}</Typography>
                            </Grid>
                            <Grid item sx={{ mt: 4.2 }}>
                                <Typography sx={{ fontSize: '12px', fontWeight: '100', color: '#999' }}>CVC</Typography>
                                <Typography sx={{ mt: 1 }}>***</Typography>
                            </Grid>
                        </Grid>
                        <Button onClick={handleEditCreditCardClick}>Edit Credit Card</Button>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
    if (isUpdatingCreditCard && doneGettingClientSecret) {
        return (
            <Elements id="stripe-checkout" stripe={stripePromise}>
                <StudioCheckoutForm
                    stripeid={stripeidValue}
                    clientSecret={clientSecret}
                    billingContact={billingContact}
                    billingEmail={billingEmail}
                    addSpace
                />
            </Elements>
        );
    }
    return (
        <Grid container sx={{ mt: 4 }}>
            <Grid item xs={7}>
                Loading credit card form...
            </Grid>
        </Grid>
    );
};
StudioPaymentForm.propTypes = {
    stripeid: propTypes.string,
    billingContact: propTypes.string,
    billingEmail: propTypes.string
};

export default StudioPaymentForm;
