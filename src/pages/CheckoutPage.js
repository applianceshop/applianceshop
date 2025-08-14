import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { collection, addDoc, serverTimestamp, doc, updateDoc, getDoc } from 'firebase/firestore';
import axios from 'axios';

const CheckoutPage = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const { cart, clearCart } = useCart();
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleOrder = async (e) => {
    e.preventDefault();
    if (!name || !address || !phone) {
      alert('Please fill in all fields.');
      return;
    }

    // ✅ Check live stock before placing the order
    for (const item of cart) {
      const productRef = doc(db, 'products', item.id);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        alert(`Product ${item.name} no longer exists.`);
        return;
      }

      const latestStock = productSnap.data().stock;
      if (item.quantity > latestStock) {
        alert(`Only ${latestStock} unit(s) left of "${item.name}". Please update your cart.`);
        return;
      }
    }

    try {
      // ✅ Create the order
      await addDoc(collection(db, 'orders'), {
        name,
        address,
		phone,
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
	  await sendTelegramMessage({ name, phone, address, items: cart, total });

      // ✅ Deduct stock after order placement
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
    } catch (error) {
      console.error('Order placement failed:', error);
      alert('Something went wrong while placing the order.');
    }
  };

  const TELEGRAM_TOKEN = '7547525645:AAH3QeSB69JR-efyyj0FkK8fRfeNFQ_DKHw';
  const TELEGRAM_CHAT_IDS = ['6203484555', '5015874356'];
  const CHAT_ID_NO_CUT = '5462583517';
  
  const escapeMarkdown = (text) => {
    return text
      .replace(/[_*[\]()~`>#+\-=|{}.!]/g, '\\$&'); // Escapes markdown special characters
  };
  
  const sendTelegramMessage = async (orderDetails) => {
    const baseMessage = `
  🛒 *New Order Received!*
  
  👤 Name: ${escapeMarkdown(orderDetails.name)}
  📞 Phone: ${escapeMarkdown(orderDetails.phone)}
  🏠 Address: ${escapeMarkdown(orderDetails.address)}
  
  🧾 *Items:*
  ${orderDetails.items.map(item => `- ${escapeMarkdown(item.name)} x${item.quantity}`).join('\n')}
  
  💰 Total: $${orderDetails.total.toFixed(2)}
  `;
  
    const messageWithCut = baseMessage + `💼 Your Cut (10%): $${(orderDetails.total * 0.1).toFixed(2)}`;
  
    // Send to CHAT_ID_NO_CUT (without the cut line)
    try {
      await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: CHAT_ID_NO_CUT,
        text: baseMessage,
        parse_mode: 'Markdown'
      });
    } catch (error) {
      console.error(`❌ Failed to send message to chat ${CHAT_ID_NO_CUT}:`, error.response?.data || error.message);
    }
  
    // Send to others with the cut line
    for (const chatId of TELEGRAM_CHAT_IDS) {
      try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          chat_id: chatId,
          text: messageWithCut,
          parse_mode: 'Markdown'
        });
      } catch (error) {
        console.error(`❌ Failed to send message to chat ${chatId}:`, error.response?.data || error.message);
      }
    }
  };


  return (
    <>
      <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <h2>Checkout</h2>
        <p>Total: <strong>${total}</strong></p>
  
        {/* Name Input */}
        <label style={{ display: 'block', margin: '1rem 0 0.5rem' }}>Your Name:</label>
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
  
        {/* Phone Input */}
        <label style={{ display: 'block', margin: '1rem 0 0.5rem' }}>Phone Number:</label>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
  
        {/* Address Input */}
        <label style={{ display: 'block', margin: '1rem 0 0.5rem' }}>Delivery Address:</label>
        <textarea
          value={address}
          onChange={e => setAddress(e.target.value)}
          rows="4"
          required
          style={{
            width: '100%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
        />
  
        {/* Submit Button */}
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
