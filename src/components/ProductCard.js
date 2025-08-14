import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { cart, addToCart } = useCart();

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
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center',
      width: '200px',
      backgroundColor: '#fff',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    }}>
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )}
      <h3 style={{ margin: '0.5rem 0' }}>{product.name}</h3>
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
          marginTop: '0.5rem',
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
