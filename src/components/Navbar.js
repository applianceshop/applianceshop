// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import CartPreview from './CartPreview';
import EmcreyLogo from '../images/Baytak logo.png';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center mb-8 px-4" style={{ marginTop: '15px' }}>
      {/* Left: Title */}
      <div style={{ width: '300px' }} className="flex items-center gap-4">
        <p className="text-3xl font-bold text-white">BAYTAK PLAST & DETERGENTS</p>
      </div>

      {/* Center: Logo */}
      <div className="flex items-center gap-3" style={{ width: '200px', height: '200px' }}>
        <img
          src={EmcreyLogo}
          alt="Logo"
          style={{ height: '200px', borderRadius: '8px' }} // or 50% for circle
        />
      </div>

      {/* Right: Links + Live Cart Preview */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '250px' }}>
        <div style={{ marginBottom: '8px' }}>
          <Link
            className="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none"
            to="/"
          >
            Home
          </Link>
          <Link
            className="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none"
            to="/cart"
          >
            Cart
          </Link>
        </div>
        <CartPreview />
      </div>
    </div>
  );
};

export default Navbar;
