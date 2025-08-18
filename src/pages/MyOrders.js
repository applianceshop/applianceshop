import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

import baytakLogo from '../images/Baytak logo.png';

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
    const generatePDF = async (order) => {
      const doc = new jsPDF();
    
      // ✅ Load Arabic font dynamically
      const fontUrl = `${process.env.PUBLIC_URL}/fonts/Cairo-Regular.ttf`;
      const fontData = await fetch(fontUrl).then(res => res.arrayBuffer());
      const base64Font = btoa(String.fromCharCode(...new Uint8Array(fontData)));
    
      doc.addFileToVFS('Cairo-Regular.ttf', base64Font);
      doc.addFont('Cairo-Regular.ttf', 'Cairo', 'normal');
      doc.setFont('Cairo');
    
      // ✅ Add logo
      doc.addImage(baytakLogo, 'PNG', 20, 10, 40, 20);
    
      doc.setFontSize(16);
      doc.text('Baytak Plast & Detergents - Invoice', 70, 25);
    
      doc.setFontSize(12);
      let y = 40;
      doc.text(`Order ID: ${order.orderId}`, 20, y);
      doc.text(`Date: ${order.timestamp?.toDate().toLocaleString()}`, 20, y += 7);
      doc.text(`Name: ${order.name || ''}`, 20, y += 7);
      doc.text(`Phone: ${order.phone || ''}`, 20, y += 7);
      doc.text(`Address: ${order.address || ''}`, 20, y += 7);
    
      doc.text('Items:', 20, y += 10);
      order.items.forEach(item => {
        doc.text(`- ${item.name} x${item.stock || item.quantity || 1} ($${item.price})`, 25, y += 7);
      });
    
      doc.text(`Total: $${order.total}`, 20, y += 10);
      doc.text('Thank you for your order!', 20, y += 15);
    
      doc.save(`invoice_${order.orderId}.pdf`);
    };

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
		            <button
            onClick={() => generatePDF(order)}
            style={{
              marginTop: '0.5rem',
              marginLeft: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#4a5568',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Download Invoice
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
