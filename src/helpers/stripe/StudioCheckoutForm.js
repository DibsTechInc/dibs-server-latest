// import React from 'react';
// import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
// import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'store';
import { setIsEditingCreditCardRedux, setNeedToGetCardInfoFromStripeRedux } from 'store/slices/actionstatus';
import './stripe.css';

const StudioCheckoutForm = (props) => {
    const stripe = useStripe();
    const dispatch = useDispatch();
    const elements = useElements();
    const { addSpace, clientSecret } = props;
    const [isLoading, setIsLoading] = useState(false);
    const [buttonnote, setButtonNote] = useState(`Add Card`);
    const [processing, setProcessing] = useState(false);
    const [successfulIntent, setSuccessfulIntent] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setIsLoading(true);
        await stripe
            .confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                    // card: CardElement
                }
            })
            .then((result) => {
                if (result) {
                    if (result.setupIntent.id) {
                        setSuccessfulIntent(true);
                        setButtonNote('Edit Credit Card');
                        setProcessing(false);
                        setIsLoading(false);
                        dispatch(setIsEditingCreditCardRedux(false));
                        dispatch(setNeedToGetCardInfoFromStripeRedux(true));
                    }
                }
            });
    };
    const cardStyle = {
        style: {
            base: {
                color: '#32325d',
                fontSmoothing: 'antialiased',
                fontSize: '14px',
                '::placeholder': {
                    color: '#32325d'
                }
            },
            invalid: {
                color: '#fa755a',
                iconColor: '#fa755a'
            }
        }
    };
    // TODO - set disabled to true if isLoading is true
    return (
        <form onSubmit={handleSubmit} className="form">
            {addSpace && <div className="addrow" />}
            {!successfulIntent && <CardElement id="card-element" options={cardStyle} spacing={1} />}
            <button type="submit" id="payment-request-button" disabled={isLoading || processing}>
                <span id="button-text">
                    {processing ? (
                        <div className="spinner" id="spinner">
                            Processing
                        </div>
                    ) : (
                        buttonnote
                    )}
                </span>
            </button>
        </form>
    );
};
StudioCheckoutForm.propTypes = {
    addSpace: propTypes.bool,
    clientSecret: propTypes.string
};

export default StudioCheckoutForm;
