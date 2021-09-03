import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import PaymentForm from './PaymentForm';

const PUBLIC_KEY = "pk_test_51JV8XiSI3U5QEj060uoEJDCxOwgMTl4CtNRzgT5bRy3FHrBwKIpqlXEPWXjzx2Jcw0u2KzsWNRL5TEOeARq1KrZ200N9oDf7U2";
const stripeTestPromise = loadStripe(PUBLIC_KEY);

const StripeContainer = ({amount, buyCallBack, errorCallback}) => {
    return (
        <Elements stripe={stripeTestPromise}>
            <PaymentForm amount={amount} buyCallBack={buyCallBack} errorCallback={errorCallback}/>
        </Elements>
    );
}

export default StripeContainer;