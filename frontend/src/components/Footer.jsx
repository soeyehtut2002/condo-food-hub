import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Building } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer" id="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="logo-icon"><Building size={20} /></span>
              <span className="logo-text">
                Condo<span className="logo-accent">FoodHub</span>
              </span>
            </div>
            <p className="footer-desc">
              Your building's private marketplace. Order food, drinks, and services from local vendors right to your room.
            </p>
          </div>

          <div className="footer-links">
            <h4>Quick Links</h4>
            <Link to="/">Home</Link>
            <Link to="/vendors">All Vendors</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/cart">Shopping Cart</Link>
          </div>

          <div className="footer-links">
            <h4>Categories</h4>
            <Link to="/vendors?category=food">Thai Food</Link>
            <Link to="/vendors?category=drink">Coffee & Drinks</Link>
            <Link to="/vendors?category=service">Services</Link>
          </div>

          <div className="footer-contact">
            <h4>Contact</h4>
            <p><MapPin size={14} /> Condo Building, Floor G</p>
            <p><Phone size={14} /> 02-000-0000</p>
            <p><Mail size={14} /> support@condofoodhub.com</p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CondoFoodHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
