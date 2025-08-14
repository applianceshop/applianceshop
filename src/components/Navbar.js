// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import BAYTAKLOGO from '../images/WhatsApp Image 2025-08-14 at 11.10.30_acec9ec0.jpg'
const Navbar = () => {
  return (
    // <nav style={{
    //   padding: '1rem 2rem',
    //   backgroundColor: '#1f2937',
    //   color: 'white',
    //   display: 'flex',
    //   justifyContent: 'space-between',
    //   alignItems: 'center'
    // }}>
    //   <p class="text-3xl font-bold text-white">baytak plast & detergents</p>
    //   <div>
        
    //     <Link class="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" to="/" >Home</Link>
    //     <Link class="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" to="/cart" style={{ color: 'white' }}>Cart</Link>
    //   </div>
    // </nav>
    <div class="flex justify-between items-center mb-8" style={{ margin: '15px' }}>
                <div style={{width:'200px'}} class="flex items-center gap-4">
                    <p class="text-3xl font-bold text-white">BAYTAK PLAST & DETERGENTS</p>
                    {/* <span class="text-gray-300">{getCurrentDate('/')}</span> */}
                </div>
                <div class="flex items-center gap-3" style={{width:'200px',height:'200px'}}>
                    <img  style={{width:'200px',height:'200px'}} src={BAYTAKLOGO} alt="Baytak Logo" loading="lazy" />
                </div>
                <div style={{display:'flex', width:'200px'}}> <Link class="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" to="/" >Home</Link>
        <Link class="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" to="/cart" style={{ color: 'white' }}>Cart</Link>
    </div>
   
                
            </div>
  );
};

export default Navbar;

