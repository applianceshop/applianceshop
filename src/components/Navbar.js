// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav style={{
      padding: '1rem 2rem',
      backgroundColor: '#1f2937',
      color: 'white',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h2>Appliance Shop</h2>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '1rem' }}>Home</Link>
        <Link to="/cart" style={{ color: 'white' }}>Cart</Link>
      </div>
    </nav>
  );
};

export default Navbar;

