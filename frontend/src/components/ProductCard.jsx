import { Link } from 'react-router-dom';
import { Star, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, showVendor = true }) {
  const { user } = useAuth();
  const { addToCart } = useCart();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return;
    await addToCart(product.id);
  };

  const imageUrl = product.image
    ? `/uploads/${product.image}`
    : `https://placehold.co/400x300/E6F9EF/00B14F?text=${encodeURIComponent(product.name)}`;

  return (
    <Link to={`/products/${product.id}`} className="product-card animate-in" id={`product-${product.id}`}>
      <div className="product-card-image">
        <img src={imageUrl} alt={product.name} loading="lazy" />
        {product.is_popular && <span className="popular-badge">🔥 Popular</span>}
        {user?.role === 'resident' && (
          <button className="add-to-cart-float" onClick={handleAddToCart} title="Add to cart">
            <Plus size={18} />
          </button>
        )}
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.name}</h3>
        {showVendor && product.vendor && (
          <p className="product-card-vendor">{product.vendor.shop_name}</p>
        )}
        {product.description && (
          <p className="product-card-desc">{product.description}</p>
        )}
        <div className="product-card-footer">
          <span className="price">฿{parseFloat(product.price).toFixed(0)}</span>
          {product.category && (
            <span className="product-card-category">{product.category}</span>
          )}
        </div>
      </div>

      <style>{`
        .product-card {
          display: block;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-base);
        }
        .product-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-3px);
        }
        .product-card-image {
          position: relative;
          aspect-ratio: 4/3;
          overflow: hidden;
          background: var(--bg-secondary);
        }
        .product-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }
        .product-card:hover .product-card-image img {
          transform: scale(1.05);
        }
        .popular-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 4px 10px;
          background: rgba(255,255,255,0.95);
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }
        .add-to-cart-float {
          position: absolute;
          bottom: 10px;
          right: 10px;
          width: 36px;
          height: 36px;
          background: var(--primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: var(--shadow-md);
          opacity: 0;
          transform: scale(0.8);
          transition: all var(--transition-fast);
        }
        .product-card:hover .add-to-cart-float {
          opacity: 1;
          transform: scale(1);
        }
        .add-to-cart-float:hover {
          background: var(--primary-dark);
          transform: scale(1.1) !important;
        }
        .product-card-body {
          padding: 16px;
        }
        .product-card-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 4px;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .product-card-vendor {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }
        .product-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
          line-height: 1.5;
        }
        .product-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .product-card-category {
          font-size: 11px;
          padding: 3px 8px;
          background: var(--bg-secondary);
          color: var(--text-secondary);
          border-radius: var(--radius-full);
          font-weight: 500;
        }
      `}</style>
    </Link>
  );
}
