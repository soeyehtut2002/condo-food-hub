import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, FileText, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';

export default function CheckoutPage() {
  const { user } = useAuth();
  const { cartItems, cartTotal, cartCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const [roomNumber, setRoomNumber] = useState(user?.room_number || '');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!roomNumber.trim()) {
      setError('Please enter your room number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await orderAPI.place({ room_number: roomNumber, notes });
      setSuccess(true);
      await fetchCart();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="page" id="order-success">
        <div className="container" style={{ maxWidth: '500px', textAlign: 'center' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%',
            background: 'var(--success-bg)', color: 'var(--success)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px', animation: 'scaleIn 0.4s ease',
          }}>
            <CheckCircle size={48} />
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>Order Placed! 🎉</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px', fontSize: '16px' }}>
            Your order has been sent to the vendor
          </p>
          <p style={{ color: 'var(--text-tertiary)', marginBottom: '32px' }}>
            Delivery to room <strong>{roomNumber}</strong>
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link to="/orders" className="btn btn-primary btn-lg">View Orders</Link>
            <Link to="/vendors" className="btn btn-outline btn-lg">Keep Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '500px' }}>
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Cart is empty</h3>
            <p>Add items before checking out</p>
            <Link to="/vendors" className="btn btn-primary">Browse Vendors</Link>
          </div>
        </div>
      </div>
    );
  }

  // Group items by vendor
  const vendorGroups = {};
  cartItems.forEach(item => {
    const vendorName = item.product?.vendor?.shop_name || 'Unknown';
    if (!vendorGroups[vendorName]) vendorGroups[vendorName] = [];
    vendorGroups[vendorName].push(item);
  });

  return (
    <div className="page" id="checkout-page">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="page-header">
          <h1>Checkout</h1>
          <p>Review and confirm your order</p>
        </div>

        {error && (
          <div style={{
            background: 'var(--error-bg)', color: 'var(--error)',
            padding: '12px 16px', borderRadius: 'var(--radius-md)',
            marginBottom: '20px', fontSize: '14px',
          }}>
            {error}
          </div>
        )}

        {/* Order Items by Vendor */}
        {Object.entries(vendorGroups).map(([vendorName, items]) => (
          <div className="card" key={vendorName} style={{ marginBottom: '16px' }}>
            <div className="card-body">
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🏪 {vendorName}
              </h3>
              {items.map(item => (
                <div key={item.id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', fontSize: '14px',
                }}>
                  <div>
                    <span style={{ fontWeight: 500 }}>{item.product?.name}</span>
                    <span style={{ color: 'var(--text-tertiary)', marginLeft: '8px' }}>x{item.quantity}</span>
                  </div>
                  <span className="price">฿{(parseFloat(item.product?.price) * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Delivery Details */}
        <form onSubmit={handlePlaceOrder}>
          <div className="card" style={{ marginBottom: '16px' }}>
            <div className="card-body">
              <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={18} /> Delivery Details
              </h3>
              <div className="form-group">
                <label htmlFor="checkout-room">Room Number *</label>
                <input
                  type="text"
                  id="checkout-room"
                  className="form-input"
                  placeholder="e.g. A-1201"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label htmlFor="checkout-notes">Order Notes (optional)</label>
                <textarea
                  id="checkout-notes"
                  className="form-input"
                  placeholder="Special instructions, allergies, etc."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Total */}
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Subtotal ({cartCount} items)</span>
                <span>฿{cartTotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                <span>Delivery</span>
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
              </div>
              <div className="divider" />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <span style={{ fontSize: '18px', fontWeight: 700 }}>Total</span>
                <span className="price price-large">฿{cartTotal}</span>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-full"
                disabled={loading}
                id="place-order-btn"
              >
                {loading ? 'Placing Order...' : `Place Order — ฿${cartTotal}`}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
