import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CartPreview = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (cart.length > 0) {
      setVisible(true);
    }
  }, [cart]);

  if (!visible || cart.length === 0) return null;

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleGoToCart = () => {
    setVisible(false);
    setTimeout(() => {
      navigate('/cart');
    }, 100);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '20px',
        backgroundColor: '#1a365d',
        color: 'white',
        padding: '1rem',
        border: '1px solid #ccc',
        zIndex: 9999,
        width: '300px',
        boxShadow: '0 0 15px rgba(0,0,0,0.5)',
        borderRadius: '12px',
        maxHeight: '80vh',
        overflowY: 'auto',
        backdropFilter: 'blur(5px)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>🛒 Your Cart</h4>
        <button
          onClick={() => setVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ marginTop: '1rem' }}>
        {cart.map(item => (
          <div key={item.id} style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            alignItems: 'center',
            borderBottom: '1px solid #ccc',
            paddingBottom: '0.5rem'
          }}>
            {item.image && (
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '6px' }}
              />
            )}
            <div>
              <div style={{ fontWeight: 'bold' }}>{item.name}</div>
              <div style={{ fontSize: '0.9rem' }}>
                ${item.price} × {item.quantity}
              </div>
            </div>
          </div>
        ))}

        <div style={{
          fontWeight: 'bold',
          fontSize: '1rem',
          marginTop: '1rem',
          textAlign: 'right'
        }}>
          Total: ${total.toFixed(2)}
        </div>

        <button
          onClick={handleGoToCart}
          style={{
            marginTop: '1rem',
            width: '100%',
            backgroundColor: '#00d4ff',
            color: '#000',
            padding: '0.6rem 1rem',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Go to Cart
        </button>
      </div>
    </div>
  );
};

export default CartPreview;
