import React, { use, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [sortOrder, setSortOrder] = useState(''); 
   const navigate = useNavigate();
   const [searchQuery, setSearchQuery] = useState('');
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
   const handleSearch = (e) => {
      e.preventDefault();
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
      }
    };
  const fetchProducts = async () => {
   const categ = await getDocs(collection(db, 'categories'));
   const items = categ.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  
  setCategories(items)
    const snapshot = await getDocs(collection(db, 'products'));
    if(sortOrder){
    const items = snapshot.docs
  .filter(doc => doc.data().category.toUpperCase() === sortOrder.toUpperCase())
  .map(doc => ({ id: doc.id, ...doc.data() }));

setProducts(items);
}else{
   const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
setProducts(items);
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
  useEffect(() => {
    fetchProducts();
  }, [sortOrder]);
  const selectElement = document.getElementById('catergory');

  return (
    <>
      <div className="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6"  >
        <h1 className="Product-container" style={{color:'white', fontWeight:'bold'}}>Products</h1>
        {/* Dropdown */}
        <div style={isMobile?{display:'flex',flexDirection:'column',marginLeft:'2rem'}:{display:"flex",marginLeft:'2rem'}}>
      <label style={{ marginRight: '0.5rem',color:'white' }}>Sort by category:</label>
      <select id="catergory"
        value={sortOrder}
        onChange={e => {e.preventDefault();
          setSortOrder(e.target.value)}}
        style={{  marginBottom: '1rem', borderRadius:'8px',width:'200px',border: '1px solid #ccc',marginBottom: '8px',marginRight:'4px' }}
      >
        <option key={0} value=""></option>
        {categories.length === 0 ? (<p>loading...</p>) : categories.map(category => (
          <option value={category.category}>{category.category}</option>
          ))}
          
       
          {/* <option key={1} value="cleaning">cleaning</option>
          <option key={2} value="test">test</option> */}
      </select>
       {/* <form onSubmit={handleSearch} style={isMobile?{display: 'flex',flexDirection:'column', gap: '0.5rem', marginBottom: '8px'}:{ display: 'flex', gap: '0.5rem', marginBottom: '8px' }}>
        <label style={{ marginRight: '0.5rem',color:'white' }}>Search by item name:</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              style={{  borderRadius: '4px', border: '1px solid #ccc' }}
            />
            <button type="submit" style={navButtonStyle}>Search</button>
          </form> */}
          </div>
        {products.length === 0 ? (
          <p style={{color:'white'}}>No products available.</p>
        ) : (
          <div className='product-items' >
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;

