import { Link } from 'react-router-dom';
import { Star, Clock } from 'lucide-react';

export default function VendorCard({ vendor }) {
  const logoUrl = vendor.logo
    ? `/uploads/${vendor.logo}`
    : `https://placehold.co/120x120/E6F9EF/00B14F?text=${encodeURIComponent(vendor.shop_name?.charAt(0) || 'V')}`;

  const categoryEmoji = {
    food: '🍽️',
    drink: '☕',
    service: '🔧',
  };

  return (
    <Link to={`/vendors/${vendor.id}`} className="vendor-card animate-in" id={`vendor-${vendor.id}`}>
      <div className="vendor-card-banner">
        {vendor.banner ? (
          <img src={`/uploads/${vendor.banner}`} alt="" className="vendor-banner-img" />
        ) : (
          <div className="vendor-banner-placeholder" />
        )}
        <div className="vendor-card-logo">
          <img src={logoUrl} alt={vendor.shop_name} />
        </div>
      </div>

      <div className="vendor-card-body">
        <h3 className="vendor-card-name">{vendor.shop_name}</h3>
        <p className="vendor-card-category">
          {categoryEmoji[vendor.category] || '🍽️'} {vendor.category}
        </p>
        {vendor.description && (
          <p className="vendor-card-desc">{vendor.description}</p>
        )}
        <div className="vendor-card-meta">
          <div className="vendor-card-rating">
            <Star size={14} fill="#F59E0B" stroke="#F59E0B" />
            <span>{vendor.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="vendor-card-orders">{vendor.total_orders || 0} orders</span>
          <span className={`badge ${vendor.is_open ? 'badge-open' : 'badge-closed'}`}>
            {vendor.is_open ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>

      <style>{`
        .vendor-card {
          display: block;
          background: var(--surface);
          border: 1px solid var(--border-light);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-base);
        }
        .vendor-card:hover {
          box-shadow: var(--shadow-md);
          transform: translateY(-3px);
        }
        .vendor-card-banner {
          position: relative;
          height: 100px;
          background: linear-gradient(135deg, #E6F9EF 0%, #C6F0D9 100%);
          overflow: hidden;
        }
        .vendor-banner-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .vendor-banner-placeholder {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #E6F9EF 0%, #B8E6CC 50%, #C6F0D9 100%);
        }
        .vendor-card-logo {
          position: absolute;
          bottom: -24px;
          left: 16px;
          width: 56px;
          height: 56px;
          border-radius: var(--radius-md);
          border: 3px solid white;
          overflow: hidden;
          background: white;
          box-shadow: var(--shadow-sm);
        }
        .vendor-card-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .vendor-card-body {
          padding: 32px 16px 16px;
        }
        .vendor-card-name {
          font-size: 16px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 4px;
        }
        .vendor-card-category {
          font-size: 13px;
          color: var(--text-secondary);
          text-transform: capitalize;
          margin-bottom: 6px;
        }
        .vendor-card-desc {
          font-size: 13px;
          color: var(--text-secondary);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 12px;
          line-height: 1.5;
        }
        .vendor-card-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 13px;
        }
        .vendor-card-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
          color: var(--text-primary);
        }
        .vendor-card-orders {
          color: var(--text-tertiary);
        }
      `}</style>
    </Link>
  );
}
