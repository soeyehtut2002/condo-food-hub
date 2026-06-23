import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  Home, ShoppingCart, User, LogOut, Store, ClipboardList,
  Menu, X, ChevronDown, Shield, Search, Building
} from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" id="navbar-logo">
          <span className="logo-icon"><Building size={20} /></span>
          <span className="logo-text">
            Condo<span className="logo-accent">FoodHub</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="navbar-links hide-mobile">
          <Link to="/" className="nav-link" id="nav-home">
            <Home size={18} />
            Home
          </Link>
          <Link to="/vendors" className="nav-link" id="nav-vendors">
            <Store size={18} />
            Vendors
          </Link>
          {user && user.role !== 'admin' && (
            <Link to="/orders" className="nav-link" id="nav-orders">
              <ClipboardList size={18} />
              Orders
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="navbar-actions">
          {user ? (
            <>
              {/* Cart (not for admin/vendor) */}
              {user.role === 'resident' && (
                <Link to="/cart" className="nav-cart" id="nav-cart">
                  <ShoppingCart size={22} />
                  {cartCount > 0 && (
                    <span className="cart-badge">{cartCount}</span>
                  )}
                </Link>
              )}

              {/* User Dropdown */}
              <div className="nav-dropdown">
                <button
                  className="nav-user-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="nav-user-menu"
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hide-mobile user-name">{user.name}</span>
                  <ChevronDown size={16} className={`chevron ${dropdownOpen ? 'rotated' : ''}`} />
                </button>

                {dropdownOpen && (
                  <>
                    <div className="dropdown-backdrop" onClick={() => setDropdownOpen(false)} />
                    <div className="dropdown-menu">
                      <div className="dropdown-header">
                        <strong>{user.name}</strong>
                        <span className="dropdown-role">{user.role}</span>
                      </div>
                      <div className="dropdown-divider" />

                      {user.role === 'vendor' && (
                        <Link
                          to="/vendor/dashboard"
                          className="dropdown-item"
                          id="nav-vendor-dashboard"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Store size={16} /> Vendor Dashboard
                        </Link>
                      )}

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          className="dropdown-item"
                          id="nav-admin-dashboard"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Shield size={16} /> Admin Dashboard
                        </Link>
                      )}

                      <button className="dropdown-item logout" onClick={handleLogout} id="nav-logout">
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="navbar-auth hide-mobile">
              <Link to="/login" className="btn btn-outline btn-sm" id="nav-login">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register">Sign Up</Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            className="mobile-toggle hide-desktop"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="mobile-menu">
          <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>
            <Home size={18} /> Home
          </Link>
          <Link to="/vendors" className="mobile-link" onClick={() => setMobileOpen(false)}>
            <Store size={18} /> Vendors
          </Link>
          {user && user.role !== 'admin' && (
            <Link to="/orders" className="mobile-link" onClick={() => setMobileOpen(false)}>
              <ClipboardList size={18} /> Orders
            </Link>
          )}
          {user && user.role === 'vendor' && (
            <Link to="/vendor/dashboard" className="mobile-link" onClick={() => setMobileOpen(false)}>
              <Store size={18} /> Dashboard
            </Link>
          )}
          {user && user.role === 'admin' && (
            <Link to="/admin" className="mobile-link" onClick={() => setMobileOpen(false)}>
              <Shield size={18} /> Admin
            </Link>
          )}

          <div className="dropdown-divider" />

          {!user ? (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMobileOpen(false)}>Log In</Link>
              <Link to="/register" className="btn btn-primary btn-full" onClick={() => setMobileOpen(false)}>Sign Up</Link>
            </div>
          ) : (
            <button className="mobile-link logout" onClick={handleLogout}>
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
