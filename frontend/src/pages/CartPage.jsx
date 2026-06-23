import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';

export default function CartPage() {
  const { cartItems, cartTotal, cartCount, loading, updateQuantity, removeItem, clearCart } = useCart();

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page" id="cart-page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1>Shopping Cart</h1>
          <p>{cartCount} item{cartCount !== 1 ? 's' : ''} in your cart</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Your cart is empty</h3>
            <p>Add some delicious items from our vendors!</p>
            <Link to="/vendors" className="btn btn-primary">
              <ShoppingBag size={18} /> Browse Vendors
            </Link>
          </div>
        ) : (
          <>
            <div className="card" style={{ marginBottom: '24px' }}>
              <div className="card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Cart Items</h3>
                  <button
                    className="btn btn-sm"
                    style={{ color: 'var(--error)', fontSize: '13px' }}
                    onClick={clearCart}
                    id="clear-cart"
                  >
                    <Trash2 size={14} /> Clear All
                  </button>
                </div>

                {cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="card">
              <div className="card-body">
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>Order Summary</h3>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>Subtotal ({cartCount} items)</span>
                  <span>฿{cartTotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  <span>Delivery Fee</span>
                  <span style={{ color: 'var(--success)', fontWeight: 600 }}>FREE</span>
                </div>

                <div className="divider" />

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700 }}>Total</span>
                  <span className="price price-large">฿{cartTotal}</span>
                </div>

                <Link to="/checkout" className="btn btn-primary btn-lg btn-full" id="proceed-checkout">
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
