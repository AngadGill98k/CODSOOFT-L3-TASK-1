import React, { useRef } from 'react';
import './store.css'; 
import Navbar from '../navabar/navbar';
import { useNavigate } from 'react-router-dom';
const Store = () => {
  const url = 'http://localhost:3001';
  const navigate=useNavigate()
  const product = useRef(null);
  const title = useRef(null);
  const price = useRef(null);
  const description = useRef(null);
  const image = useRef(null);
  const quantity = useRef(null);

  const handleClick = () => {
    const p_name = product.current.value;
    const p_price = Number(price.current.value);
    const p_des = description.current.value;
    const img = image.current.files[0];
    const qnt = Number(quantity.current.value);

    const formData = new FormData();
    formData.append('p_name', p_name);
    formData.append('p_price', p_price);
    formData.append('p_des', p_des);
    formData.append('img', img);
    formData.append('qnt', qnt);

    fetch(`${url}/add_p`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.msg);
        navigate('/home')
      });
  };

  return (
    <><Navbar/>
    <div className="store-container">
      <h2 className="store-heading">Add New Product</h2>

      <input type="text" placeholder="Product Name" ref={product} className="store-input" />
      <input type="text" placeholder="Title (optional)" ref={title} className="store-input" />
      <input type="number" placeholder="Price" ref={price} className="store-input" />
      <input type="text" placeholder="Description" ref={description} className="store-input" />
      <input type="file" ref={image} className="store-input file-input" />
      <input type="number" placeholder="Quantity" ref={quantity} className="store-input" />

      <button onClick={handleClick} className="store-button">Add Product</button>
    </div>
    </>
  );
};

export default Store;
