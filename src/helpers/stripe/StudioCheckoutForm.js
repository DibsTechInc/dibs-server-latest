// import React from 'react';
// import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
// import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useSelector, useDispatch } from 'store';
import './stripe.css';

const StudioCheckoutForm = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const { config } = useSelector((state) => state.dibsstudio);
    const { dibsStudioId } = config;
    const { addSpace, clientSecret, billingContact, billingEmail, stripeid } = props;
    const [message, setMessage] = useState(null);
    // const [clientSecretValue, setClientSecretValue] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonnote, setButtonNote] = useState(`Add Card`);
    const [processing, setProcessing] = useState(false);
    const [successfulIntent, setSuccessfulIntent] = useState(false);
    const [alreadyStarted, setAlreadyStarted] = useState(false);
    useEffect(() => {
        console.log(`inside of useEffect of the studio checkout form`);
        // const createClientSecret = async () => {
        //     await axios
        //         .post('/api/stripe-setup-intent', {
        //             dibsStudioId,
        //             billingEmail,
        //             billingContact,
        //             stripeid
        //         })
        //         .then((response) => {
        //             console.log(`response from setting up intent is: ${JSON.stringify(response.data)}`);
        //             // setClientSecret(response.data.stripeIntent);
        //             // setStripeid(response.data.stripeId);
        //             // setDoneGettingClientSecret(true);
        //         });
        // };
        // const getSetupIntent = async () => {
        //     setAlreadyStarted(true);
        //     stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
        //         switch (setupIntent.status) {
        //             case 'succeeded':
        //                 setMessage(`Card info has been saved.`);
        //                 break;
        //             case 'processing':
        //                 setMessage('Your payment is processing.');
        //                 break;
        //             case 'requires_payment_method':
        //                 setMessage('');
        //                 break;
        //             default:
        //                 setMessage('Something went wrong.');
        //                 break;
        //         }
        //     });
        // };
        // if (message === 'null' && !alreadyStarted) {
        //     getSetupIntent();
        // }
        // createClientSecret();
    }, []);

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
                console.log(`result is (from checkoutForm - confirmCardSetup): ${JSON.stringify(result)}`);
                if (result) {
                    if (result.setupIntent.id) {
                        setSuccessfulIntent(true);
                        setButtonNote('Edit card');
                        setProcessing(false);
                        // setCardValueChanged(true);
                    }
                }
            });
        const error = null;
        if (error) {
            setMessage(error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
        setIsLoading(false);
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
            {message && <div>{message}</div>}
        </form>
    );
};
StudioCheckoutForm.propTypes = {
    stripeid: propTypes.string,
    addSpace: propTypes.bool,
    billingContact: propTypes.string,
    billingEmail: propTypes.string
};

export default StudioCheckoutForm;
