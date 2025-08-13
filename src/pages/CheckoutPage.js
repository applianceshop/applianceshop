import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const CheckoutPage = () => {
  const [name, setName] = useState('');
  const { cart, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!address.trim()) {
      alert('Please enter a delivery address.');
      return;
    }

    // Simulate placing order
    await addDoc(collection(db, 'orders'), {
      name,
      address,
      items: cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      total,
      status: 'pending',
      timestamp: serverTimestamp()
    });
    // ✅ Deduct stock from each product
    for (const item of cart) {
      const productRef = doc(db, 'products', item.id);
      const productSnap = await getDoc(productRef);
      const currentStock = productSnap.data().stock || 0;
      await updateDoc(productRef, {
        stock: Math.max(currentStock - item.quantity, 0)
      });
    }	  

    alert('Order placed successfully!');
    clearCart();
    navigate('/');
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Checkout</h2>
        <p>Total: <strong>${total}</strong></p>
        {/* Name Input */}
        <label style={{ display: 'block', margin: '1rem 0 0.5rem' }}>
          Your Name:
        </label>
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
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

