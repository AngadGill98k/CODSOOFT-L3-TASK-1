import React, { useState } from 'react';
import './prouct.css';
import { useLocation } from 'react-router-dom';
import Navbar from '../navabar/navbar';

let Product = () => {
  let location = useLocation();
  let { name, id, userid, price, desc, quantity, image } = location.state || {};
  let [added, setAdded] = useState(false);

  

  let cart = () => {
    let product = {
      id,
      name,
      image,
      price,
      quantity: 1,
      userid,
      
    };

    fetch(`http://localhost:3001/cart_a`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials:'include',
      body: JSON.stringify({ product })
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.msg);
        setAdded(true); // mark as added
      });
  };

  return (
    <>
      <Navbar />
     <div className="product-background">
  <div className="product-image">
    <img src={`http://localhost:3001${image}`} alt="product" />
  </div>
  <div className="product-details">
    <h2>{name}</h2>
    <p className="price">₹{price}</p>
    <p className="desc">{desc}</p>
    <button
      className="add-cart"
      onClick={cart}
      disabled={added}
    >
      {added ? 'Added to Cart' : 'Add to Cart'}
    </button>
  </div>
</div>

    </>
  );
};

export default Product;
