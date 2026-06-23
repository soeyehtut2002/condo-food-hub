import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VendorDirectory from './pages/VendorDirectory';
import ShopDetails from './pages/ShopDetails';
import ProductDetails from './pages/ProductDetails';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderHistory from './pages/OrderHistory';
import VendorDashboard from './pages/VendorDashboard';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/vendors" element={<VendorDirectory />} />
          <Route path="/vendors/:id" element={<ShopDetails />} />
          <Route path="/products/:id" element={<ProductDetails />} />

          <Route path="/cart" element={
            <ProtectedRoute roles={['resident']}>
              <CartPage />
            </ProtectedRoute>
          } />

          <Route path="/checkout" element={
            <ProtectedRoute roles={['resident']}>
              <CheckoutPage />
            </ProtectedRoute>
          } />

          <Route path="/orders" element={
            <ProtectedRoute roles={['resident', 'vendor']}>
              <OrderHistory />
            </ProtectedRoute>
          } />

          <Route path="/vendor/dashboard" element={
            <ProtectedRoute roles={['vendor']}>
              <VendorDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
