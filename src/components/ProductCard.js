 import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
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
  const { cart, addToCart } = useCart();
const isMobile = useMediaQuery('(max-width: 600px)');
  const outOfStock = product.stock === 0;

  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const handleAddToCart = () => {
    if (quantityInCart >= product.stock) {
      alert("You've added the maximum available stock.");
      return;
    }
    addToCart(product);
  };

  return (
    <div style={{
      display:'flex',
      flexDirection:'column',
      placeItems:'center',
      alignItems:'center',
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '5px',
      margin: '5px',
      textAlign: 'center',
      width: 'auto',
      height:'300px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>

	  <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
       {product.image && (
         <img
           src={product.image}
           alt={product.name}
           style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
         />
       )}
       <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
     </Link>
      <p style={{ fontWeight: 'bold' }}>${product.price}</p>

      {outOfStock ? (
        <p style={{ color: 'red', marginTop: '0.5rem' }}>Out of stock</p>
      ) : quantityInCart >= product.stock ? (
        <button disabled style={{
          marginTop: '0.5rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#9ca3af',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'not-allowed'
        }}>
          Max Reached
        </button>
      ) : (
        <button onClick={handleAddToCart} style={{
          alignSelf:'center',
          justifySelf:'self-end',
          marginTop: 'auto',
          padding: '0.5rem 1rem',
          backgroundColor: '#1f2937',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add to Cart
        </button>
      )}
    </div>
  );
};

export default ProductCard;
