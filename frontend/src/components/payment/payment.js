import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import "./pay.css"
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cart = location.state?.cart || [];
  const total = location.state?.total || 0;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');

useEffect(() => {
  const canAccess = sessionStorage.getItem("canAccessPayment") === "true";
  
  if (!canAccess || !cart.length || !total) {
    navigate('/cart'); // 🚫 Redirect if direct access or no data
  }

  return () => {
    // Clear the flag when leaving or refreshing
    sessionStorage.removeItem("canAccessPayment");
  };
}, [cart, total, navigate]);


  const handleSuccess = (details) => {
    alert(`Transaction completed by ${details.payer.name.given_name}`);
    console.log("✅ Payment Details:", details);
    // You can send this + cart + user info to backend now
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
