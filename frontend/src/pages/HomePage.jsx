import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Store, ShoppingBag, Star, Building, Soup, Coffee, Utensils } from 'lucide-react';
import { vendorAPI, productAPI } from '../services/api';
import VendorCard from '../components/VendorCard';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

export default function HomePage() {
  const [featuredVendors, setFeaturedVendors] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [vendorsRes, productsRes] = await Promise.all([
        vendorAPI.getFeatured(),
        productAPI.getPopular(),
      ]);
      setFeaturedVendors(vendorsRes.data.vendors);
      setPopularProducts(productsRes.data.products);
    } catch (error) {
      console.error('Failed to load home data:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/vendors?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const categories = [
    { name: 'Thai Food', icon: <Soup size={24} />, type: 'food' },
    { name: 'Korean Food', icon: <Utensils size={24} />, type: 'food' },
    { name: 'Home Cooking', icon: <Utensils size={24} />, type: 'food' },
    { name: 'Coffee', icon: <Coffee size={24} />, type: 'drink' },
    { name: 'Juices', icon: <Coffee size={24} />, type: 'drink' },
    { name: 'Desserts', icon: <Soup size={24} />, type: 'food' },
  ];

  return (
    <div className="home-page" id="home-page">
      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="container hero-content">
          <div className="hero-text">
            <span className="hero-badge">Your Building Marketplace</span>
            <h1>
              Delicious food,<br />
              delivered to your <span className="hero-accent">room</span>
            </h1>
            <p>Order from local vendors in your condo. Fresh food, cold drinks, and services — delivered right to your door.</p>

            <form className="hero-search" onSubmit={handleSearch}>
              <Search size={20} className="hero-search-icon" />
              <input
                type="text"
                placeholder="Search for food, drinks, or vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="hero-search-input"
              />
              <button type="submit" className="btn btn-primary" id="hero-search-btn">
                Search
              </button>
            </form>

            <div className="hero-stats">
              <div className="hero-stat">
                <Store size={18} />
                <span><strong>5+</strong> Vendors</span>
              </div>
              <div className="hero-stat">
                <ShoppingBag size={18} />
                <span><strong>20+</strong> Products</span>
              </div>
              <div className="hero-stat">
                <Star size={18} />
                <span><strong>4.8</strong> Avg Rating</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-food-grid">
              <div className="hero-food-item"><Soup size={32} style={{ color: 'var(--primary)' }} /></div>
              <div className="hero-food-item"><Coffee size={32} style={{ color: 'var(--primary)' }} /></div>
              <div className="hero-food-item"><Utensils size={32} style={{ color: 'var(--primary)' }} /></div>
              <div className="hero-food-item"><Store size={32} style={{ color: 'var(--primary)' }} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories Section ─────────────────────────────── */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Browse Categories</h2>
          </div>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                to={`/vendors?category=${cat.type}`}
                key={cat.name}
                className="category-card"
              >
                <span className="category-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Vendors ───────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Vendors</h2>
            <Link to="/vendors" className="see-all">
              See All <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : featuredVendors.length > 0 ? (
            <div className="grid-3">
              {featuredVendors.map((vendor) => (
                <VendorCard key={vendor.id} vendor={vendor} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Store size={48} style={{ color: 'var(--text-tertiary)' }} /></div>
              <h3>No vendors yet</h3>
              <p>Check back soon for new vendors!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Popular Items ──────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Right Now</h2>
            <Link to="/vendors" className="see-all">
              View Menu <ArrowRight size={16} />
            </Link>
          </div>
          {loading ? (
            <div className="spinner" />
          ) : popularProducts.length > 0 ? (
            <div className="grid-4">
              {popularProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon"><Utensils size={48} style={{ color: 'var(--text-tertiary)' }} /></div>
              <h3>No items yet</h3>
              <p>Vendors are setting up their menus!</p>
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────── */}
      <section className="section how-it-works">
        <div className="container">
          <div className="section-header" style={{ justifyContent: 'center' }}>
            <h2>How It Works</h2>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <div className="step-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Search size={32} /></div>
              <h3>Browse</h3>
              <p>Explore vendors and menus in your building</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <div className="step-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><ShoppingBag size={32} /></div>
              <h3>Order</h3>
              <p>Add items to your cart and checkout</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <div className="step-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Building size={32} /></div>
              <h3>Receive</h3>
              <p>Get it delivered right to your room</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
