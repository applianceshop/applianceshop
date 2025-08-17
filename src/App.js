import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './admin/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RequireAuth from './auth/RequireAuth';
import AdminOrders from './admin/AdminOrders';
import Navbar from './components/Navbar';
import CartPreview from './components/CartPreview';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import TrackOrderPage from './pages/TrackOrderPage';
import { AuthProvider } from './context/AuthContext';
import MyOrders from './pages/MyOrders';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <AuthProvider>
      <>
        <Navbar />
        <CartPreview />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
          <Route path="/track-order" element={<TrackOrderPage />} />
          <Route path="/login" element={<LoginPage />} />
		  <Route path="/profile" element={<ProfilePage />} />
		  <Route path="/my-orders" element={<MyOrders />} />

          {/* Protected admin routes */}
          <Route path="/admin" element={
            <RequireAuth>
              <AdminDashboard />
            </RequireAuth>
          } />
          <Route path="/admin/orders" element={
            <RequireAuth>
              <AdminOrders />
            </RequireAuth>
          } />
        </Routes>
      </>
    </AuthProvider>
  );
}

export default App;