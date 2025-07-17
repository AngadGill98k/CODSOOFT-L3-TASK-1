import React from 'react';
import Navbar from '../navabar/navbar';
import './bill.css';

const Bill = ({ items = [] }) => {
  const total = items.reduce((sum, value) => sum + (value.price * value.qnt), 0);

  return (
    <>
      <Navbar />
      <div className="bill-container">
        <h2>Bill Summary</h2>
        <ul className="bill-list">
          {items.map((item, index) => (
            <li key={index} className="bill-item">
              <span>{item.name}</span>
              <span>₹{item.price * item.qnt}</span>
            </li>
          ))}
        </ul>
        <div className="bill-total">
          <strong>Total:</strong> ₹{total}
        </div>
      </div>
    </>
  );
};

export default Bill;
