import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, Phone, Home, Store, Building } from 'lucide-react';
import './AuthPages.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'resident', room_number: '', phone: '', shop_name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      if (form.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" id="register-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo"><Building size={40} /></div>
            <h1>Create Account</h1>
            <p>Join Condo Food Hub today</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Role Selector */}
            <div className="role-selector">
              <button
                type="button"
                className={`role-option ${form.role === 'resident' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'resident' })}
              >
                <User size={20} />
                <span>Resident</span>
              </button>
              <button
                type="button"
                className={`role-option ${form.role === 'vendor' ? 'active' : ''}`}
                onClick={() => setForm({ ...form, role: 'vendor' })}
              >
                <Store size={20} />
                <span>Vendor</span>
              </button>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className="input-icon-wrap">
                <User size={18} className="input-icon" />
                <input type="text" id="name" className="form-input form-input-icon"
                  placeholder="Your full name" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email Address</label>
              <div className="input-icon-wrap">
                <Mail size={18} className="input-icon" />
                <input type="email" id="reg-email" className="form-input form-input-icon"
                  placeholder="you@example.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-icon" />
                  <input type="password" id="reg-password" className="form-input form-input-icon"
                    placeholder="Min 6 characters" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <div className="input-icon-wrap">
                  <Lock size={18} className="input-icon" />
                  <input type="password" id="confirm-password" className="form-input form-input-icon"
                    placeholder="Repeat password" value={form.confirmPassword}
                    onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-icon-wrap">
                <Phone size={18} className="input-icon" />
                <input type="tel" id="phone" className="form-input form-input-icon"
                  placeholder="08x-xxx-xxxx" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            {form.role === 'resident' && (
              <div className="form-group">
                <label htmlFor="room">Room Number</label>
                <div className="input-icon-wrap">
                  <Home size={18} className="input-icon" />
                  <input type="text" id="room" className="form-input form-input-icon"
                    placeholder="e.g. A-1201" value={form.room_number}
                    onChange={(e) => setForm({ ...form, room_number: e.target.value })} />
                </div>
              </div>
            )}

            {form.role === 'vendor' && (
              <div className="form-group">
                <label htmlFor="shop-name">Shop Name</label>
                <div className="input-icon-wrap">
                  <Store size={18} className="input-icon" />
                  <input type="text" id="shop-name" className="form-input form-input-icon"
                    placeholder="Your shop name" value={form.shop_name}
                    onChange={(e) => setForm({ ...form, shop_name: e.target.value })} required />
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-lg btn-full" disabled={loading} id="register-submit">
              {loading ? 'Creating account...' : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login">Sign in</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
