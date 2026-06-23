import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Package, CheckCircle, XCircle, ChevronDown, ChevronUp, Store, Truck, ShoppingBag } from 'lucide-react';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  async function loadOrders() {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      const res = await orderAPI.getAll(params);
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  }

  const statusIcon = {
    pending: <Clock size={16} />,
    preparing: <Package size={16} />,
    on_the_way: <Truck size={16} />,
    delivered: <CheckCircle size={16} />,
    cancelled: <XCircle size={16} />,
  };

  const filters = [
    { value: '', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'on_the_way', label: 'On The Way' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="page" id="order-history">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="page-header">
          <h1>{user?.role === 'vendor' ? 'Incoming Orders' : 'Order History'}</h1>
          <p>{user?.role === 'vendor' ? 'Manage your incoming orders' : 'Track your past and current orders'}</p>
        </div>

        {/* Status Filter */}
        <div className="tabs" style={{ marginBottom: '24px' }}>
          {filters.map((f) => (
            <button
              key={f.value}
              className={`tab ${statusFilter === f.value ? 'active' : ''}`}
              onClick={() => setStatusFilter(f.value)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner" />
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><ShoppingBag size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px' }} /></div>
            <h3>No orders found</h3>
            <p>{statusFilter ? 'No orders with this status' : 'You haven\'t placed any orders yet'}</p>
            {user?.role === 'resident' && (
              <Link to="/vendors" className="btn btn-primary">Start Ordering</Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.map((order) => (
              <div key={order.id} className="card" style={{ cursor: 'pointer' }}
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                id={`order-${order.id}`}
              >
                <div className="card-body">
                  {/* Order Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: expandedOrder === order.id ? '12px' : '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600 }}>
                        #{order.id}
                      </span>
                      <span className={`badge badge-${order.status}`}>
                        {statusIcon[order.status]} {order.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="price">฿{parseFloat(order.total).toFixed(0)}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
                          {new Date(order.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      {expandedOrder === order.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order.id && (
                    <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '12px', animation: 'fadeIn 0.2s ease' }}>
                      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginBottom: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                        {user?.role === 'vendor' && order.user && (
                          <>
                            <span>👤 {order.user.name}</span>
                            <span>🏠 Room {order.room_number}</span>
                            {order.user.phone && <span>📱 {order.user.phone}</span>}
                          </>
                        )}
                        {user?.role === 'resident' && order.vendor && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Store size={14} /> {order.vendor.shop_name}
                          </span>
                        )}
                        <span>🏠 Room {order.room_number}</span>
                      </div>

                      {order.notes && (
                        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px', fontStyle: 'italic' }}>
                          📝 {order.notes}
                        </p>
                      )}

                      {/* Order Items */}
                      <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', padding: '12px 16px' }}>
                        {order.items?.map((item) => (
                          <div key={item.id} style={{
                            display: 'flex', justifyContent: 'space-between',
                            padding: '6px 0', fontSize: '14px',
                          }}>
                            <span>{item.product?.name} <span style={{ color: 'var(--text-tertiary)' }}>x{item.quantity}</span></span>
                            <span className="price">฿{(parseFloat(item.price) * item.quantity).toFixed(0)}</span>
                          </div>
                        ))}
                      </div>

                      {/* Vendor: Status update buttons */}
                      {user?.role === 'vendor' && order.status !== 'delivered' && order.status !== 'cancelled' && (
                        <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
                          {order.status === 'pending' && (
                            <button className="btn btn-primary btn-sm"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await orderAPI.updateStatus(order.id, { status: 'preparing' });
                                loadOrders();
                              }}>
                              Start Preparing
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button className="btn btn-primary btn-sm"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await orderAPI.updateStatus(order.id, { status: 'on_the_way' });
                                loadOrders();
                              }}>
                              Ship Order
                            </button>
                          )}
                          {order.status === 'on_the_way' && (
                            <button className="btn btn-primary btn-sm"
                              onClick={async (e) => {
                                e.stopPropagation();
                                await orderAPI.updateStatus(order.id, { status: 'delivered' });
                                loadOrders();
                              }}>
                              Mark Delivered
                            </button>
                          )}
                          <button className="btn btn-outline btn-sm"
                            style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                            onClick={async (e) => {
                              e.stopPropagation();
                              await orderAPI.updateStatus(order.id, { status: 'cancelled' });
                              loadOrders();
                            }}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
