import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Phone, ArrowLeft } from 'lucide-react';
import { vendorAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function ShopDetails() {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    loadVendor();
  }, [id]);

  async function loadVendor() {
    try {
      const res = await vendorAPI.getById(id);
      setVendor(res.data.vendor);
    } catch (error) {
      console.error('Failed to load vendor:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!vendor) return (
    <div className="page"><div className="container">
      <div className="empty-state">
        <div className="empty-state-icon">😕</div>
        <h3>Vendor not found</h3>
        <Link to="/vendors" className="btn btn-primary">Back to Vendors</Link>
      </div>
    </div></div>
  );

  const products = vendor.products || [];
  const categories = ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(p => p.category === activeCategory);

  const bannerUrl = vendor.banner
    ? `/uploads/${vendor.banner}`
    : null;

  return (
    <div className="page" id="shop-details" style={{ paddingTop: 'var(--header-height)' }}>
      {/* Banner */}
      <div style={{
        height: '200px',
        background: bannerUrl
          ? `url(${bannerUrl}) center/cover`
          : 'linear-gradient(135deg, #E6F9EF 0%, #B8E6CC 50%, #C6F0D9 100%)',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(transparent 40%, rgba(0,0,0,0.4))',
        }} />
      </div>

      <div className="container" style={{ marginTop: '-50px', position: 'relative', zIndex: 1 }}>
        {/* Shop Info Card */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <div className="card-body" style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: 'var(--radius-lg)',
              background: 'var(--primary-light)',
              border: '3px solid white',
              boxShadow: 'var(--shadow-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', flexShrink: 0,
            }}>
              {vendor.logo ? (
                <img src={`/uploads/${vendor.logo}`} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--radius-md)' }} />
              ) : '🍽️'}
            </div>

            <div style={{ flex: 1, minWidth: '200px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700 }}>{vendor.shop_name}</h1>
                <span className={`badge ${vendor.is_open ? 'badge-open' : 'badge-closed'}`}>
                  {vendor.is_open ? '● Open' : '● Closed'}
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                {vendor.description}
              </p>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', fontSize: '14px', color: 'var(--text-secondary)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={16} fill="#F59E0B" stroke="#F59E0B" />
                  <strong style={{ color: 'var(--text-primary)' }}>{vendor.rating?.toFixed(1)}</strong>
                </span>
                <span>{vendor.total_orders} orders</span>
                {vendor.user?.phone && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Phone size={14} /> {vendor.user.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} showVendor={false} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🍽️</div>
            <h3>No items available</h3>
            <p>This vendor hasn't added any products yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
