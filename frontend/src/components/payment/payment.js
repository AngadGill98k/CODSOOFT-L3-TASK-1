import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./pay.css"
let Payment = () => {
  let location = useLocation();
  let navigate = useNavigate();

  let cart = location.state?.cart || [];
  let total = location.state?.total || 0;

  let [name, setName] = useState('');
  let [email, setEmail] = useState('');
  let [userPhone, setUserPhone] = useState('');

useEffect(() => {
  let canAccess = sessionStorage.getItem("canAccessPayment") === "true";
  
  if (!canAccess || !cart.length || !total) {
    navigate('/cart'); 
  }

  return () => {
    sessionStorage.removeItem("canAccessPayment");
  };
}, [cart, total, navigate]);


  let handleSuccess = (details) => {
    alert(`Transaction completed by ${details.payer.name.given_name}`);
    console.log("✅ Payment Details:", details);
  };

return (
  <PayPalScriptProvider options={{ "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID }}>
    <div className="payment-container">
      <h2>Payment Page</h2>
      <p><strong>Total: ₹{total}</strong> </p>

      <div className="payment-inputs">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          placeholder="Phone"
          value={userPhone}
          onChange={(e) => setUserPhone(e.target.value)}
        />
      </div>

      <div className="payment-buttons">
        <PayPalButtons
          style={{ layout: "vertical" }}
          createOrder={(data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: (total / 83).toFixed(2),
                  currency_code: "USD"
                }
              }]
            });
          }}
          onApprove={(data, actions) => {
            return actions.order.capture().then(handleSuccess);
          }}
        />
      </div>
    </div>
  </PayPalScriptProvider>
);
};

export default Payment;
