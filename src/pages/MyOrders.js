import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const { addToCart, setCartFlash } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      const q = query(collection(db, 'orders'), where('userId', '==', user.uid));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };

    fetchOrders();
  }, [user]);
    const handleReorder = (order) => {
      order.items.forEach(item => {
        const quantity = item.stock || item.quantity || 1; // fallback logic
        const product = {
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image || '',
        };
        addToCart(product, quantity); 
      });
  
      setCartFlash(true); // ✅ flash cart icon
      setTimeout(() => setCartFlash(false), 1500); // ✅ reset flash after 1.5s
      navigate('/cart'); // ✅ go to cart
    };

  return (
    <div style={{ padding: '2rem', color: 'white' }}>
      <h2>Your Orders</h2>
      {orders.map(order => (
        <div key={order.id} style={{ borderBottom: '1px solid #444', marginBottom: '1rem' }}>
          <p><strong>Order ID:</strong> {order.orderId}</p>
		  <p>Placed On: {order.timestamp?.toDate().toLocaleString()}</p>
      
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>{item.name} x{item.stock || item.quantity || 1}</li> 
            ))}
          </ul>
		  <button
            onClick={() => handleReorder(order)}
            style={{
              marginTop: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#1f2937',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reorder
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
