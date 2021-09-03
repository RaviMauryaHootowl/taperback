import React, {useState} from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import styles from './PaymentForm.module.css';
import { PaymentMethod, PaymentMethodResult, StripeCardElementOptions, StripeElement, StripeElements, StripeError } from '@stripe/stripe-js';
import RippleButton from '../RippleButton/RippleButton';


const CARD_OPTIONS: StripeCardElementOptions = {
	iconStyle: "solid",
	style: {
		base: {
			iconColor: "#FC7B03",
			color: "#FC7B03",
			fontWeight: 500,
			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
			fontSize: "16px",
			fontSmoothing: "antialiased",
			":-webkit-autofill": { color: "#fce883" },
			"::placeholder": { color: "#ffaa5b" }
		},
		invalid: {
			iconColor: "#FC7B03",
			color: "#FC7B03"
		}
	}
}

const PaymentForm = ({amount, buyCallBack, errorCallback}) => {

    const stripe = useStripe()
    const elements: StripeElements = useElements()!;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const cardElement = elements!.getElement(CardElement);
        const paymentRes: PaymentMethodResult|undefined = await stripe?.createPaymentMethod({
            type: "card",
            card: cardElement!
        })
        const error: StripeError|undefined = paymentRes?.error
        const paymentMethod: PaymentMethod|undefined = paymentRes?.paymentMethod
       
        if(!error){
            try{
                const {id} = paymentMethod!
                const response = await axios.post("/api/payment", {
                    amount: amount,
                    id
                })

                if(response.data.success){
                    console.log("Success Payment!!!");
                    buyCallBack();
                }

            }catch(error){
                errorCallback();
            }
        }else{
            alert(error.message);
        }

    }


    return (
        <div className={styles.paymentFormContainer}>
            <form>
                <fieldset className={styles.paymentFormGroup}>
                    <div className={styles.paymentFormRow}>
                        <CardElement options={CARD_OPTIONS}/>
                    </div>
                </fieldset>
                <RippleButton onClick={handleSubmit}>Confirm Purchase</RippleButton>
            </form>
        </div>
    );
}

export default PaymentForm;