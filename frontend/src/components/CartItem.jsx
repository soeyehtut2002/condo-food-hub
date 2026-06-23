import { Trash2 } from 'lucide-react';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const product = item.product;
  const imageUrl = product?.image
    ? `/uploads/${product.image}`
    : `https://placehold.co/100x100/E6F9EF/00B14F?text=${encodeURIComponent(product?.name?.charAt(0) || '?')}`;

  const subtotal = (parseFloat(product?.price || 0) * item.quantity).toFixed(0);

  return (
    <div className="cart-item" id={`cart-item-${item.id}`}>
      <div className="cart-item-image">
        <img src={imageUrl} alt={product?.name} />
      </div>

      <div className="cart-item-info">
        <h4 className="cart-item-name">{product?.name}</h4>
        <p className="cart-item-vendor">{product?.vendor?.shop_name}</p>
        <p className="cart-item-price">฿{parseFloat(product?.price || 0).toFixed(0)} each</p>
      </div>

      <div className="cart-item-actions">
        <div className="qty-control">
          <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>−</button>
          <span>{item.quantity}</span>
          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
        </div>

        <div className="cart-item-subtotal">
          <span className="price">฿{subtotal}</span>
          <button className="cart-item-remove" onClick={() => onRemove(item.id)} title="Remove">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <style>{`
        .cart-item {
          display: flex;
          gap: 16px;
          padding: 16px 0;
          border-bottom: 1px solid var(--border-light);
          align-items: center;
        }
        .cart-item:last-child {
          border-bottom: none;
        }
        .cart-item-image {
          width: 80px;
          height: 80px;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
          background: var(--bg-secondary);
        }
        .cart-item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .cart-item-info {
          flex: 1;
          min-width: 0;
        }
        .cart-item-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 2px;
        }
        .cart-item-vendor {
          font-size: 13px;
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }
        .cart-item-price {
          font-size: 13px;
          color: var(--text-secondary);
        }
        .cart-item-actions {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
        }
        .cart-item-subtotal {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .cart-item-remove {
          color: var(--text-tertiary);
          padding: 4px;
          transition: color var(--transition-fast);
        }
        .cart-item-remove:hover {
          color: var(--error);
        }
        @media (max-width: 480px) {
          .cart-item {
            flex-wrap: wrap;
          }
          .cart-item-actions {
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            align-items: center;
          }
        }
      `}</style>
    </div>
  );
}
