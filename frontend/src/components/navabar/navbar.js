import React from 'react';
import './nav.css';
import { useNavigate } from 'react-router-dom';

let Navbar = () => {
  let navigate = useNavigate();

  return (
    <nav className="navbar">
      <p className="logo" onClick={() => navigate('/home')}>ShopVerse</p>
      <div className="nav-buttons">
        <button onClick={() => navigate('/home')}>Home</button>
        <button onClick={() => navigate('/add')}>sell</button>
        <button onClick={() => navigate('/cart')}>Cart</button>
      </div>
    </nav>
  );
};

export default Navbar;
