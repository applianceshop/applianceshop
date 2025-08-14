import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { format } from 'date-fns';
import Navbar from '../components/Navbar';
const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc'); // 'desc' for latest first

  const fetchOrders = async () => {
    const snapshot = await getDocs(collection(db, 'orders'));
    let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    data.sort((a, b) => {
      const aTime = a.timestamp?.seconds || 0;
      const bTime = b.timestamp?.seconds || 0;
      return sortOrder === 'desc' ? bTime - aTime : aTime - bTime;
    });

    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();
  }, [sortOrder]);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status });
    fetchOrders();
  };

  return (
    <div style={{ padding: '2rem',  }}>
      <Navbar isAdmin={true}/>
      <h2 style={{color:'white'}}><b>Customer Orders</b></h2>

      {/* Dropdown */}
      <label style={{ marginRight: '0.5rem',color:'white' }}>Sort by date:</label>
      <select
        value={sortOrder}
        onChange={e => setSortOrder(e.target.value)}
        style={{ padding: '0.25rem 0.5rem', marginBottom: '1rem' }}
      >
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>

      {orders.map(order => (
        <div
          key={order.id}
          style={{
            border: '1px solid #ddd',
            padding: '1rem',
            marginBottom: '1rem',
            borderRadius: '8px',
            background: '#fff'
          }}
        >
          <p><strong>Name:</strong> {order.name || 'N/A'}</p>
          <p><strong>Address:</strong> {order.address}</p>
		  <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ${order.total}</p>
          <p><strong>Ordered At:</strong> {order.timestamp?.seconds ? format(new Date(order.timestamp.seconds * 1000), 'PPpp') : 'N/A'}</p>

          <div>
            <strong>Items:</strong>
            <ul>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.name} x {item.quantity} (${item.price})
                </li>
              ))}
            </ul>
          </div>

          <div style={{ marginTop: '1rem' }}>
            {order.status !== 'shipped' && (
              <button
                onClick={() => updateStatus(order.id, 'shipped')}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.5rem 1rem',
                  backgroundColor: '#f59e0b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Mark as Shipped
              </button>
            )}
            {order.status === 'shipped' && (
              <button
                onClick={() => updateStatus(order.id, 'delivered')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Mark as Delivered
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminOrders;

