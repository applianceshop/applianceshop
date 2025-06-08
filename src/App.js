import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage'
import AdminDashboard from './admin/AdminDashboard';
import LoginPage from './pages/LoginPage';
import RequireAuth from './auth/RequireAuth';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} /> 
      <Route path="/admin" element={<RequireAuth> <AdminDashboard /> </RequireAuth>} />
      <Route path="/login" element={<LoginPage />} />	  
    </Routes>
  );
}

export default App;

