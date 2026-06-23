import { useState, useEffect } from 'react';
import { Users, Store, ShoppingBag, DollarSign, Clock, CheckCircle, XCircle, Trash2, Truck } from 'lucide-react';
import { adminAPI } from '../services/api';
import StatCard from '../components/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const [statsRes, usersRes, vendorsRes, productsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getVendors(),
        adminAPI.getProducts(),
      ]);
      setStats(statsRes.data.stats);
      setUsers(usersRes.data.users);
      setVendors(vendorsRes.data.vendors);
      setProducts(productsRes.data.products);
    } catch (error) {
      console.error('Failed to load admin dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleUserStatus = async (userId, status) => {
    try {
      await adminAPI.updateUser(userId, { status });
      loadDashboard();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleApproveVendor = async (vendorId) => {
    try {
      await adminAPI.approveVendor(vendorId);
      loadDashboard();
    } catch (error) {
      console.error('Failed to approve vendor:', error);
    }
  };

  const handleSuspendVendor = async (vendorId) => {
    try {
      await adminAPI.suspendVendor(vendorId);
      loadDashboard();
    } catch (error) {
      console.error('Failed to suspend vendor:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await adminAPI.deleteProduct(productId);
      loadDashboard();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="page" id="admin-dashboard">
      <div className="container">
        <div className="page-header">
          <h1>🛡️ Admin Dashboard</h1>
          <p>Manage your Condo Food Hub platform</p>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {['overview', 'users', 'vendors', 'products'].map((tab) => (
            <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && stats && (
          <div>
            <div className="stat-cards">
              <StatCard icon={<Users size={22} />} label="Residents" value={stats.totalUsers}
                color="var(--primary)" bgColor="var(--primary-light)" />
              <StatCard icon={<Store size={22} />} label="Vendors" value={stats.totalVendors}
                color="var(--info)" bgColor="var(--info-bg)" />
              <StatCard icon={<ShoppingBag size={22} />} label="Total Orders" value={stats.totalOrders}
                color="var(--warning)" bgColor="var(--warning-bg)" />
              <StatCard icon={<DollarSign size={22} />} label="Revenue" value={`฿${stats.totalRevenue.toFixed(0)}`}
                color="var(--success)" bgColor="var(--success-bg)" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {/* Order Status Breakdown */}
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>📊 Order Status</h3>
                  {[
                    { label: 'Pending', value: stats.pendingOrders, color: 'var(--warning)', icon: <Clock size={16} /> },
                    { label: 'Preparing', value: stats.preparingOrders, color: 'var(--info)', icon: <ShoppingBag size={16} /> },
                    { label: 'On The Way', value: stats.onTheWayOrders, color: 'var(--primary)', icon: <Truck size={16} /> },
                    { label: 'Delivered', value: stats.deliveredOrders, color: 'var(--success)', icon: <CheckCircle size={16} /> },
                    { label: 'Cancelled', value: stats.cancelledOrders, color: 'var(--error)', icon: <XCircle size={16} /> },
                  ].map((item) => (
                    <div key={item.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0', borderBottom: '1px solid var(--border-light)',
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px', color: item.color, fontSize: '14px' }}>
                        {item.icon} {item.label}
                      </span>
                      <strong style={{ fontSize: '18px' }}>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="card">
                <div className="card-body">
                  <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>📈 Quick Stats</h3>
                  {[
                    { label: 'Approved Vendors', value: stats.approvedVendors },
                    { label: 'Pending Vendors', value: stats.pendingVendors },
                    { label: 'Total Products', value: stats.totalProducts },
                    { label: 'Recent Orders (7d)', value: stats.recentOrders },
                  ].map((item) => (
                    <div key={item.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0', borderBottom: '1px solid var(--border-light)',
                      fontSize: '14px',
                    }}>
                      <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
                      <strong style={{ fontSize: '18px' }}>{item.value}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong>{u.name}</strong></td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{u.email}</td>
                    <td>
                      <span className={`badge ${u.role === 'admin' ? 'badge-preparing' : u.role === 'vendor' ? 'badge-pending' : 'badge-delivered'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>{u.room_number || '—'}</td>
                    <td>
                      <span className={`badge ${u.status === 'active' ? 'badge-open' : 'badge-closed'}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      {u.role !== 'admin' && (
                        u.status === 'active' ? (
                          <button className="btn btn-sm btn-outline" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                            onClick={() => handleUserStatus(u.id, 'suspended')}>
                            Suspend
                          </button>
                        ) : (
                          <button className="btn btn-sm btn-primary"
                            onClick={() => handleUserStatus(u.id, 'active')}>
                            Activate
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Shop Name</th>
                  <th>Owner</th>
                  <th>Category</th>
                  <th>Rating</th>
                  <th>Orders</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((v) => (
                  <tr key={v.id}>
                    <td><strong>{v.shop_name}</strong></td>
                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{v.user?.name}</td>
                    <td style={{ textTransform: 'capitalize' }}>{v.category}</td>
                    <td>⭐ {v.rating?.toFixed(1)}</td>
                    <td>{v.total_orders}</td>
                    <td>
                      <span className={`badge ${v.is_approved ? 'badge-open' : 'badge-pending'}`}>
                        {v.is_approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      {v.is_approved ? (
                        <button className="btn btn-sm btn-outline" style={{ color: 'var(--error)', borderColor: 'var(--error)' }}
                          onClick={() => handleSuspendVendor(v.id)}>
                          Suspend
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-primary"
                          onClick={() => handleApproveVendor(v.id)}>
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Popular</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px', height: '40px', borderRadius: 'var(--radius-sm)',
                          overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0,
                        }}>
                          <img src={p.image ? `/uploads/${p.image}` : `https://placehold.co/40x40/E6F9EF/00B14F?text=${p.name?.charAt(0)}`}
                            alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{p.vendor?.shop_name}</td>
                    <td>{p.category}</td>
                    <td className="price">฿{parseFloat(p.price).toFixed(0)}</td>
                    <td>{p.is_popular ? '🔥' : '—'}</td>
                    <td>
                      <button className="btn btn-sm" style={{ color: 'var(--error)' }}
                        onClick={() => handleDeleteProduct(p.id)}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          #admin-dashboard .stat-cards {
            grid-template-columns: 1fr 1fr;
          }
          #admin-dashboard > .container > div:last-child > div {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
