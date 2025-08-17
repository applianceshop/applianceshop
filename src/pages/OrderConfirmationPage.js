import { useParams } from 'react-router-dom';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>🎉 Thank you for your order!</h2>
      <p>Your order ID is:</p>
      <h3 style={{ color: 'green' }}>{orderId}</h3>
      <p>Keep it safe to track your order status.</p>
    </div>
  );
};

export default OrderConfirmationPage;
