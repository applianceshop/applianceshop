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
      <div class="bg-card rounded-lg shadow-lg px-6 py-1 border border-customgray mb-6">
              
      <div style={{ padding: '2rem' , color:'white', }}>
        <h2> <b>Your Cart</b></h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <ul>
              {cart.map(item => (
                <li key={item.id} style={{ marginBottom: '1rem' }}>
                  <strong>{item.name}</strong> — ${item.price} × {item.quantity}
                  <button class="text-sm font-medium text-button hover:text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors border border-button focus:outline-none" onClick={() => removeFromCart(item.id)} style={{ marginLeft: '1rem' }}>
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
      </div>
    </>
  );
};

export default CartPage;

