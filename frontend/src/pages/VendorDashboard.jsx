import { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Clock, Package, Plus, Pencil, Trash2, X, Truck, Store, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { vendorAPI, productAPI, orderAPI } from '../services/api';
import StatCard from '../components/StatCard';

export default function VendorDashboard() {
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', category: 'Thai Food', is_popular: false,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      const [profileRes, ordersRes] = await Promise.all([
        vendorAPI.getAll(),
        orderAPI.getAll(),
      ]);

      const myVendor = profileRes.data.vendors.find(v => v.user?.email === user?.email) ||
        profileRes.data.vendors.find(v => v.user_id === user?.id);

      if (myVendor) {
        setVendor(myVendor);
        const vendorDetailRes = await vendorAPI.getById(myVendor.id);
        setProducts(vendorDetailRes.data.vendor.products || []);
      }

      setOrders(ordersRes.data.orders);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const preparingOrders = orders.filter(o => o.status === 'preparing').length;
  const onTheWayOrders = orders.filter(o => o.status === 'on_the_way').length;
  const totalRevenue = orders.filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + parseFloat(o.total), 0);

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(productForm).forEach(([key, val]) => {
        if (key !== 'imageFile') formData.append(key, val);
      });
      if (productForm.imageFile) formData.append('image', productForm.imageFile);

      if (editingProduct) {
        await productAPI.update(editingProduct.id, formData);
      } else {
        await productAPI.create(formData);
      }

      setShowProductModal(false);
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', category: 'Thai Food', is_popular: false });
      loadDashboard();
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productAPI.delete(productId);
      loadDashboard();
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || 'Thai Food',
      is_popular: product.is_popular,
    });
    setShowProductModal(true);
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await orderAPI.updateStatus(orderId, { status });
      loadDashboard();
    } catch (error) {
      console.error('Failed to update order:', error);
    }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  if (!vendor) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: '500px' }}>
          <div className="empty-state">
            <div className="empty-state-icon"><Store size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px' }} /></div>
            <h3>Shop Not Set Up</h3>
            <p>Your vendor shop is pending approval or hasn't been created yet.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page" id="vendor-dashboard">
      <div className="container">
        <div className="page-header">
          <h1>{vendor.shop_name}</h1>
          <p>
            {vendor.is_approved ? (
              <span className="badge badge-open">✓ Approved</span>
            ) : (
              <span className="badge badge-pending">⏳ Pending Approval</span>
            )}
          </p>
        </div>

        {/* Stats */}
        <div className="stat-cards">
          <StatCard icon={<ShoppingBag size={22} />} label="Total Orders" value={orders.length}
            color="var(--primary)" bgColor="var(--primary-light)" />
          <StatCard icon={<Clock size={22} />} label="Pending" value={pendingOrders}
            color="var(--warning)" bgColor="var(--warning-bg)" />
          <StatCard icon={<Package size={22} />} label="Preparing" value={preparingOrders}
            color="var(--info)" bgColor="var(--info-bg)" />
          <StatCard icon={<Truck size={22} />} label="On The Way" value={onTheWayOrders}
            color="var(--primary)" bgColor="var(--primary-light)" />
          <StatCard icon={<DollarSign size={22} />} label="Revenue" value={`฿${totalRevenue.toFixed(0)}`}
            color="var(--success)" bgColor="var(--success-bg)" />
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}>
            Orders ({orders.length})
          </button>
          <button className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}>
            Products ({products.length})
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><ShoppingBag size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px' }} /></div>
                <h3>No orders yet</h3>
                <p>Orders will appear here when residents place them</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order</th>
                      <th>Customer</th>
                      <th>Room</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td><strong>#{order.id}</strong></td>
                        <td>{order.user?.name}</td>
                        <td>{order.room_number}</td>
                        <td>{order.items?.length} items</td>
                        <td className="price">฿{parseFloat(order.total).toFixed(0)}</td>
                        <td><span className={`badge badge-${order.status}`}>{order.status}</span></td>
                        <td>
                          {order.status === 'pending' && (
                            <button className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order.id, 'preparing')}>
                              Prepare
                            </button>
                          )}
                          {order.status === 'preparing' && (
                            <button className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order.id, 'on_the_way')}>
                              Ship
                            </button>
                          )}
                          {order.status === 'on_the_way' && (
                            <button className="btn btn-primary btn-sm"
                              onClick={() => handleStatusUpdate(order.id, 'delivered')}>
                              Deliver
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <button className="btn btn-primary" onClick={() => {
                setEditingProduct(null);
                setProductForm({ name: '', description: '', price: '', category: 'Thai Food', is_popular: false });
                setShowProductModal(true);
              }} id="add-product-btn">
                <Plus size={18} /> Add Product
              </button>
            </div>

            {products.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Utensils size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px' }} /></div>
                <h3>No products yet</h3>
                <p>Add your first product to start receiving orders</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Popular</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '44px', height: '44px', borderRadius: 'var(--radius-sm)',
                              overflow: 'hidden', background: 'var(--bg-secondary)', flexShrink: 0,
                            }}>
                              <img
                                src={product.image ? `/uploads/${product.image}` : `https://placehold.co/44x44/E6F9EF/00B14F?text=${product.name?.charAt(0)}`}
                                alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              />
                            </div>
                            <strong>{product.name}</strong>
                          </div>
                        </td>
                        <td>{product.category}</td>
                        <td className="price">฿{parseFloat(product.price).toFixed(0)}</td>
                        <td>{product.is_popular ? 'Yes' : '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn btn-outline btn-sm" onClick={() => openEditModal(product)}>
                              <Pencil size={14} />
                            </button>
                            <button className="btn btn-sm" style={{ color: 'var(--error)' }}
                              onClick={() => handleDeleteProduct(product.id)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Product Modal */}
        {showProductModal && (
          <div className="modal-overlay" onClick={() => setShowProductModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowProductModal(false)}><X size={20} /></button>
              </div>
              <form onSubmit={handleProductSubmit}>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Product Name</label>
                    <input type="text" className="form-input" value={productForm.name}
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea className="form-input" value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} rows={3} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label>Price (฿)</label>
                      <input type="number" className="form-input" value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        min="0" step="0.01" required />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select className="form-input" value={productForm.category}
                        onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                        <option>Thai Food</option>
                        <option>Korean Food</option>
                        <option>Home Cooking</option>
                        <option>Desserts</option>
                        <option>Coffee</option>
                        <option>Juices & Smoothies</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Product Image</label>
                    <input type="file" className="form-input" accept="image/*"
                      onChange={(e) => setProductForm({ ...productForm, imageFile: e.target.files[0] })} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                    <input type="checkbox" checked={productForm.is_popular}
                      onChange={(e) => setProductForm({ ...productForm, is_popular: e.target.checked })} />
                    Mark as Popular
                  </label>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline" onClick={() => setShowProductModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
