import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = () => {
    if (!address.trim()) {
      alert('Please enter a delivery address.');
      return;
    }

    // Simulate placing order
    alert('Order placed! You’ll pay cash on delivery.');
    clearCart();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Checkout</h2>
        <p>Total: <strong>${total}</strong></p>

        <label style={{ display: 'block', margin: '1rem 0 0.5rem' }}>
          Delivery Address:
        </label>
        <textarea
          value={address}
          onChange={e => setAddress(e.target.value)}
          rows="4"
          style={{ width: '100%', padding: '0.5rem', borderRadius: '4px' }}
        />

        <button
          onClick={handleOrder}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1f2937',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Place Order (Cash on Delivery)
        </button>
      </div>
    </>
  );
};

export default CheckoutPage;

