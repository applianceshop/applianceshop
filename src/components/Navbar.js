// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import BAYTAKLOGO from '../images/Baytak logo.png';
import CartPreview from './CartPreview';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const navButtonStyle = {
  padding: '6px 12px',
  backgroundColor: '#1f2937',
  color: 'white',
  borderRadius: '4px',
  border: '1px solid #ccc',
  margin: '0 6px',
  textDecoration: 'none',
  fontSize: '14px'
};
const Navbar = () => {
	const { user } = useAuth();
	const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/');  // 👈 Redirect to home page
      } catch (err) {
        console.error('Logout error:', err.message);
      }
    };
   const navigate = useNavigate();
   const useMediaQuery = (query) => {
        const mediaMatch = window.matchMedia(query);
        const [matches, setMatches] = useState(mediaMatch.matches);
  
        useEffect(() => {
          const handler = (e) => setMatches(e.matches);
          mediaMatch.addListener(handler);
          return () => mediaMatch.removeListener(handler);
        }, [mediaMatch]);
  
        return matches;
      };
      const isMobile = useMediaQuery('(max-width: 600px)');
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
      <div style={!isMobile ? { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '250px' }:{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px', marginTop:'5px '}}>
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
		  <Link to="/track-order" style={{ ...navButtonStyle, whiteSpace: 'nowrap' }}>
            Track Order
          </Link>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          {user ? (
            <>
              <Link to="/my-orders" style={navButtonStyle}>My Orders</Link>
              <button onClick={handleLogout} style={navButtonStyle}>Logout</button>
            </>
          ) : (
            <Link to="/login" style={navButtonStyle}>Login</Link>
          )}
          <Link to="/track-order" style={navButtonStyle}>Track Order</Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
