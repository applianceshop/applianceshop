import { useState } from 'react';
import { db } from '../firebase/config';
import { collection, getDocs } from 'firebase/firestore';

const TrackOrderPage = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    const snapshot = await getDocs(collection(db, 'orders'));
    const found = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .find(doc => doc.orderId === orderId.trim().toUpperCase());

    if (found) {
      setOrder(found);
      setError('');
    } else {
      setOrder(null);
      setError('Order not found. Check the ID and try again.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Track Your Order</h2>
      <input
        type="text"
        value={orderId}
        onChange={e => setOrderId(e.target.value)}
        placeholder="Enter Order ID"
      />
      <button onClick={handleSearch}>Check Status</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {order && (
        <div style={{ marginTop: '2rem' }}>
          <p><strong>Name:</strong> {order.name}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          {/* Add more order info if needed */}
        </div>
      )}
    </div>
  );
};

export default TrackOrderPage;
