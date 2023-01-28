import { Card } from '@mui/material';
import { CardElement,useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CurrencyFormat from 'react-currency-format';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import './Payment.css'
import { getBasketTotal } from './reducer';
import { useStateValue } from './StateProvider';
import { db } from "./firebase";
import instance from './axios';



function Payment() {

    const [{ basket, user }, dispatch] = useStateValue();

    const history = useNavigate();

    const stripe = useStripe();
    const elements = useElements();

    

    const [succeeded, setSucceeded] = useState(false);
    const [processing, setProcessing] = useState("");

    const [error, setError] = useState(null);
    const [disabled, setDisabled] = useState(true);


    const [clientSecret, setClientSecret] = useState(true);

    useEffect(() => {
        // generate the special stripe secret which allows us to charge a customer
        const getClientSecret = async () => {
            const response = await instance({
                method: 'POST',
                // Stripe expects the total in a currencies subunits
                url: `/payments/create?total=${getBasketTotal(basket) * 100}`,

                
            });
            setClientSecret(response.data.clientSecret)
        }

        getClientSecret();

    }, [basket])


    console.log('THE SECRET IS >>>', clientSecret)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true); 

        const payload = await stripe.confirmCardPayment(clientSecret,{
            payment_method: {
                card: elements.getElement(CardElement)
            }
        }).then(({ paymentIntent }) => {

            db
            .collection('users')
            .doc(user?.uid)
            .collection('orders')
            .doc(paymentIntent.id)
            .set({
                basket: basket,
                amount: paymentIntent.amount,
                created: paymentIntent.created
            })
            

            setSucceeded(true);
            setError(null);
            setProcessing(false);


            dispatch({
                type: 'EMPTY_BASKET'
            })


            //history.repalce('/orders')
            history('/orders', { replace: true })
        })
    }


    const handleChange = event => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    }

  return (
    <div className='payment'>
        <div className='payment__container'>

            <h1>
                Checkout (<Link to = "/checkout">{basket?.length} items</Link>)
            </h1>



            {/* Payment section */}
            <div className='payment__section'>
                <div className = 'payment__title'>
                    <h3>Delivery Address</h3>
                </div>
                
                <div className='payment__address'>
                    <p>{user?.email}</p>
                    <p>123 React Lane</p>
                    <p>Los Angeles, CA</p>


                </div>

            </div>
            {/* Payment section */}

            <div className='payment__section'>
                <div className='payment__title'>
                    <h3>Review items and Delivery</h3>
                </div>

                <div className='payment__items'>
                    {basket.map(item => (
                        <CheckoutProduct
                            id = {item.id}
                            title = {item.title}
                            image = {item.image}
                            price = {item.price}
                            rating = {item.rating} 
                    />
                    ))}
                </div>

                
            </div>

            {/* Payment section */}

            <div className='payment__section'>

                <div className='payment__title'>
                    <h3>Payment Method</h3>
                </div>

                <div className='payment__details'>
                    
                    <form onSubmit = {handleSubmit}>
                        <CardElement onChange={handleChange}/>

                        <div className='payment__priceContainer'>
                            <CurrencyFormat
                                renderText={(value) => (
                                    <h3>Order Total: {value}</h3>
                                )}
                                decimalScale={2}
                                value={getBasketTotal(basket)} // Part of the homework
                                displayType={"text"}
                                thousandSeparator={true}
                                prefix={"$"}
                            />

                            <button disabled={processing || disabled || succeeded}> 
                                <span>{processing ? <p>Processing</p> : "Buy Now"}</span>
                            </button>
                        </div>

                        {error && <div>{error}</div>}
                    </form>

                </div>
            </div>


        </div>
    </div>
  )
}

export default Payment