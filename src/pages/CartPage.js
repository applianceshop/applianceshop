import React from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cart, removeFromCart } = useCart();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cart.map(item => (
                <li key={item.id} style={{ marginBottom: '1rem' }}>
                  <strong>{item.name}</strong> — ${item.price} × {item.quantity}
                  <button onClick={() => removeFromCart(item.id)} style={{ marginLeft: '1rem' }}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <h3>Total: ${total}</h3>
            <Link to="/checkout">
              <button style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}>
                Proceed to Checkout
              </button>
            </Link>	
          </>
        )}
      </div>
    </>
  );
};

export default CartPage;

