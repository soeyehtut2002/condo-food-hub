import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, Minus, Plus, ArrowLeft, Star, Store, AlertCircle } from 'lucide-react';
import { productAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);
      const res = await productAPI.getById(id);
      setProduct(res.data.product);
      setRelated(res.data.related || []);
      setQuantity(1);
      setAdded(false);
    } catch (error) {
      console.error('Failed to load product:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddToCart = async () => {
    if (!user) return;
    const success = await addToCart(product.id, quantity);
    if (success) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;
  if (!product) return (
    <div className="page"><div className="container">
      <div className="empty-state">
        <div className="empty-state-icon"><AlertCircle size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px' }} /></div>
        <h3>Product not found</h3>
        <Link to="/vendors" className="btn btn-primary">Browse Vendors</Link>
      </div>
    </div></div>
  );

  const imageUrl = product.image
    ? `/uploads/${product.image}`
    : `https://placehold.co/600x400/E6F9EF/00B14F?text=${encodeURIComponent(product.name)}`;

  return (
    <div className="page" id="product-details">
      <div className="container">
        <Link to={`/vendors/${product.vendor?.id}`} style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '24px',
        }}>
          <ArrowLeft size={18} /> Back to {product.vendor?.shop_name}
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
          {/* Image */}
          <div style={{
            borderRadius: 'var(--radius-xl)', overflow: 'hidden',
            aspectRatio: '4/3', background: 'var(--bg-secondary)',
          }}>
            <img src={imageUrl} alt={product.name} style={{
              width: '100%', height: '100%', objectFit: 'cover',
            }} />
          </div>

          {/* Info */}
          <div>
            {product.is_popular && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '4px',
                padding: '4px 12px', background: '#FFF7ED', color: '#F59E0B',
                borderRadius: 'var(--radius-full)', fontSize: '13px', fontWeight: 600,
                marginBottom: '12px',
              }}>
                Popular
              </span>
            )}

            <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>
              {product.name}
            </h1>

            <Link to={`/vendors/${product.vendor?.id}`} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '16px',
            }}>
              <Store size={16} />
              {product.vendor?.shop_name}
              {product.vendor?.rating > 0 && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '8px' }}>
                  <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
                  {product.vendor.rating.toFixed(1)}
                </span>
              )}
            </Link>

            <div className="price price-large" style={{ marginBottom: '20px' }}>
              ฿{parseFloat(product.price).toFixed(0)}
            </div>

            {product.description && (
              <p style={{
                color: 'var(--text-secondary)', lineHeight: 1.7,
                marginBottom: '24px', fontSize: '15px',
              }}>
                {product.description}
              </p>
            )}

            {product.category && (
              <div style={{ marginBottom: '24px' }}>
                <span style={{
                  padding: '6px 14px', background: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-full)', fontSize: '13px',
                  color: 'var(--text-secondary)', fontWeight: 500,
                }}>
                  {product.category}
                </span>
              </div>
            )}

            <div className="divider" />

            {/* Quantity + Add to Cart */}
            {user?.role === 'resident' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div className="qty-control">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                  <span>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)}>+</button>
                </div>

                <button
                  className={`btn ${added ? 'btn-secondary' : 'btn-primary'} btn-lg`}
                  onClick={handleAddToCart}
                  style={{ flex: 1 }}
                  id="add-to-cart-btn"
                >
                  {added ? (
                    'Added to Cart!'
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Add to Cart — ฿{(parseFloat(product.price) * quantity).toFixed(0)}
                    </>
                  )}
                </button>
              </div>
            )}

            {!user && (
              <Link to="/login" className="btn btn-primary btn-lg btn-full">
                Sign in to Order
              </Link>
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div style={{ marginTop: '60px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '20px' }}>
              More from {product.vendor?.shop_name}
            </h2>
            <div className="grid-4">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} showVendor={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #product-details .container > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  );
}
