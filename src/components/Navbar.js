// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import BAYTAKLOGO from '../images/Baytak logo.png';
import CartPreview from './CartPreview';


const Navbar = () => {
  return (
    <div className="Product-container" >
                <div style={{width:'200px'}} class="flex items-center gap-4">
                    <p class="text-3xl font-bold text-white">BAYTAK PLAST & DETERGENTS</p>
                    {/* <span class="text-gray-300">{getCurrentDate('/')}</span> */}
                </div>
                <div class="flex items-center gap-3" style={{width:'200px',height:'200px'}}>
                    <img  style={{width:'200px',height:'200px', borderRadius: '8px'}} src={BAYTAKLOGO} alt="Logo"  />
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
