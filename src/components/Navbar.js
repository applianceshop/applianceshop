// src/components/Navbar.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import BAYTAKLOGO from '../images/Baytak logo.png';
import CartPreview from './CartPreview';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { motion, AnimatePresence } from "framer-motion";

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
   const [isOpen, setIsOpen] = useState(false);
const { user } = useAuth();
  const links = user ? [
    
    { name: "Cart", href: "cart" },
    { name: "Track order", href: "track-order" },
    { name: "Profile", href: "profile" },
{ name: "My orders", href: "my-orders" },
    
  ]:[
    { name: "Cart", href: "cart" },
    { name: "Track order", href: "track-order" },
    
];

  const linkVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };
	
	const handleLogout = async () => {
      try {
        await signOut(auth);
        navigate('/');  // 👈 Redirect to home page
      } catch (err) {
        console.error('Logout error:', err.message);
      }
    };
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState('');
   const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
      }
    };
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
    <>
    
    <nav className="bg-white shadow-md fixed w-full px-2 z-0" style={{position:"absolute",top:'0'}}>
      <div >
        <div className="flex justify-between h-16 items-center">
          
          {/* Logo */}
          {/* <div className="text-2xl font-bold text-gray-800">Baytak plast & Detergents</div> */}
          

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6">
            {links.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-gray-700 hover:text-blue-500 transition"
              >
                <b>{link.name}</b>
              </Link>
            ))}
          </div>

          {/* Mobile Button with Animated Icon */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="relative w-8 h-8 flex items-center justify-start">
              <motion.span
                className="absolute w-6 h-0.5 bg-gray-800"
                animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute w-6 h-0.5 bg-gray-800"
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="absolute w-6 h-0.5 bg-gray-800"
                animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 6 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
              <form onSubmit={handleSearch} style={isMobile?{display: 'flex',flexDirection:'row'}:{ display: 'flex',flexDirection:'row'}}>
        
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={isMobile? {padding:'4px', borderRadius: '4px', border: '1px solid #ccc', maxWidth:'160px'}:{ padding:'4px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={navButtonStyle}>Search</button>
            
          </form>
          <div style={isMobile?{display: 'flex',flexDirection:'column'}:{ display: 'flex',flexDirection:'row'}}> 
          
          {user ? <button type='button'  onClick={handleLogout} style={navButtonStyle}>Logout</button> :  <Link  to="/login" style={navButtonStyle}>Login</Link>}</div>
         
        </div>
        
      </div>

      {/* Mobile Menu with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white shadow-md px-4 pb-4 space-y-2 overflow-hidden"
          >
            {links.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="block text-gray-700 hover:text-blue-500 transition"
                variants={linkVariants}
                initial="hidden"
                animate="visible"
                custom={i}
              >
                {link.name}
              </motion.a>
            ))}
          
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    <div className="Product-container" style={{marginTop:'100px'}} >
       
                <div style={{width:'200px'}} class="flex items-center gap-4">
                    {/* <p class="text-3xl font-bold text-white">BAYTAK PLAST & DETERGENTS</p> */}
                    {/* <span class="text-gray-300">{getCurrentDate('/')}</span> */}
                </div>
                <div class="flex items-center gap-3" style={{width:'200px',height:'200px'}}><Link to="/">
                    <img  style={{width:'200px',height:'200px', borderRadius: '8px'}} src={BAYTAKLOGO} alt="Logo"  />
                    </Link>
                </div>
               

      {/* Right: Links + Live Cart Preview */}
      
      <div style={!isMobile ? { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', width: '250px' }:{display: 'flex', flexDirection: 'column', alignItems: 'center', width: '250px', marginTop:'5px '}}>
        <div style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
          

      {/* {user ? (
            <>
             
              <button className="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" onClick={handleLogout} style={navButtonStyle}>Logout</button>
          <div>
           <Link className="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" to="/my-orders" style={navButtonStyle}>My Orders</Link>
              <Link  to="/profile">
                <button className="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none"  style={navButtonStyle}>
                  Profile
                </button>
              </Link> 
              </div>
            </>
          ) : (
            <Link className="text-sm font-medium text-button hover:text-white px-3 py-1 mx-1 my-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" to="/login" style={navButtonStyle}>Login</Link>
          )} */}
                  </div>
		  {/* <Link
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
		  <Link className="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" to="/track-order" style={{ ...navButtonStyle, whiteSpace: 'nowrap' }}>
            Track Order
          </Link> */}
         
          
        </div>
      </div>
    
    </div>
    </>
  );
};

export default Navbar;
