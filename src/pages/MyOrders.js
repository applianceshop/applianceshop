import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import { amiriBase64 } from '../fonts/amiriBase64';
import baytakLogo from '../images/Baytak logo.png';


const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const { addToCart, setCartFlash } = useCart();
  const navigate = useNavigate();
  const generatePDF = (order) => {
    const doc = new jsPDF();
  
    // ✅ Register Arabic font
    doc.addFileToVFS("Amiri-Regular.ttf", amiriBase64);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");
  
    // ✅ Add logo
    doc.addImage(baytakLogo, 'PNG', 20, 10, 40, 20);
  
    // ✅ English heading
    doc.setFontSize(16);
    doc.setFont("helvetica");
    doc.text("Baytak Plast & Detergents - Invoice", 70, 25);
  
    // ✅ Order Info (English)
    doc.setFontSize(12);
    let y = 40;
    doc.text(`Order ID: ${order.orderId}`, 20, y);
    doc.text(`Date: ${order.timestamp?.toDate().toLocaleString()}`, 20, y += 7);
    doc.text(`Name: ${order.name || ''}`, 20, y += 7);
    doc.text(`Phone: ${order.phone || ''}`, 20, y += 7);
    doc.text(`Address: ${order.address || ''}`, 20, y += 7);
  
    // ✅ Switch to Arabic font for items
    doc.setFont("Amiri");
    doc.text('المنتجات:', 20, y += 12);
  
    order.items.forEach(item => {
      const text = `- ${item.name} x${item.stock || item.quantity || 1} ($${item.price})`;
      doc.text(text, 25, y += 8, { align: "left" });
    });
  
    // ✅ Total (back to English font)
    doc.setFont("helvetica");
    doc.text(`Total: $${order.total}`, 20, y += 10);
    doc.text("Thank you for your order!", 20, y += 15);
  
    // ✅ Save the file
    doc.save(`invoice_${order.orderId}.pdf`);
  };

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
		  <button
            onClick={() => generatePDF(order)}
            style={{
              marginTop: '0.5rem',
              marginRight: '0.5rem',
              padding: '0.5rem 1rem',
              backgroundColor: '#4b5563',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📄 Download Invoice
          </button>
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
