// import React from 'react';
// import ReactDOM from 'react-dom';
import propTypes from 'prop-types';
import { loadStripe } from '@stripe/stripe-js';
import { useState, useEffect } from 'react';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
// import Payment from 'views/application/e-commerce/Checkout/Payment';

const CheckoutForm = (props) => {
    const stripe = useStripe();
    const elements = useElements();
    const { clientSecret } = props;
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    // const stripePromise = loadStripe('pk_test_7PNwQZV5OJNWDC2wh7RoqePN');

    useEffect(() => {
        if (!stripe) return;
        // const clientSecret = new URLSearchParams(window.location.search).get('payment_intent_client_secret');
        if (!clientSecret) {
            return;
        }
        console.log(`inside of useEffect of the checkout form`);
        stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
            console.log(`setupIntent is: ${JSON.stringify(setupIntent)}`);
            switch (setupIntent.status) {
                case 'succeeded':
                    setMessage('Payment succeeded!');
                    break;
                case 'processing':
                    setMessage('Your payment is processing.');
                    break;
                case 'requires_payment_method':
                    setMessage('Your payment was not successful, please try again.');
                    break;
                default:
                    setMessage('Something went wrong.');
                    break;
            }
        });
    }, [stripe]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }
        setIsLoading(true);
        console.log(`going into confirmSetup`);
        // const { error } = await stripe.confirmSetup({
        //     // `Elements` instance that was used to create the Payment Element
        //     elements,
        //     confirmParams: {
        //         return_url: 'https://example.com/account/payments/setup-complete'
        //     }
        // });
        console.log(`clientSecret in checkoutForm is: ${clientSecret}`);
        await stripe
            .confirmCardSetup(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)
                    // card: CardElement
                }
            })
            .then((result) => {
                console.log(`result is: ${JSON.stringify(result)}`);
            });
        // const { error, paymentMethod } = await stripe.createPaymentMethod({
        //     type: 'card',
        //     card: elements.getElement(CardElement)
        // });
        const error = null;
        if (error) {
            // This point will only be reached if there is an immediate error when
            // confirming the payment. Show error to your customer (for example, payment
            // details incomplete)
            setMessage(error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
        setIsLoading(false);
    };
    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit">Pay</button>
            {message && <div>{message}</div>}
        </form>
    );
};
CheckoutForm.propTypes = {
    clientSecret: propTypes.string
};

export default CheckoutForm;
