import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();

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
              <li key={idx}>{item.name} x{item.quantity}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
