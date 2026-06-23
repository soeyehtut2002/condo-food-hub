import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { vendorAPI } from '../services/api';
import VendorCard from '../components/VendorCard';

export default function VendorDirectory() {
  const [searchParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');

  useEffect(() => {
    loadVendors();
  }, [category]);

  async function loadVendors() {
    try {
      setLoading(true);
      const res = await vendorAPI.getAll({ category, search });
      setVendors(res.data.vendors);
    } catch (error) {
      console.error('Failed to load vendors:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    loadVendors();
  };

  const filteredVendors = search
    ? vendors.filter(v =>
        v.shop_name.toLowerCase().includes(search.toLowerCase()) ||
        v.description?.toLowerCase().includes(search.toLowerCase())
      )
    : vendors;

  const categories = [
    { value: '', label: 'All' },
    { value: 'food', label: 'Food' },
    { value: 'drink', label: 'Drinks' },
    { value: 'service', label: 'Services' },
  ];

  return (
    <div className="page" id="vendor-directory">
      <div className="container">
        <div className="page-header">
          <h1>Vendor Directory</h1>
          <p>Discover vendors in your building</p>
        </div>

        {/* Search & Filter */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
          <form onSubmit={handleSearch} style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="text"
              className="form-input"
              placeholder="Search vendors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '44px' }}
              id="vendor-search"
            />
          </form>

          <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none', gap: '4px' }}>
            {categories.map((cat) => (
              <button
                key={cat.value}
                className={`tab ${category === cat.value ? 'active' : ''}`}
                onClick={() => setCategory(cat.value)}
                style={{
                  padding: '10px 16px',
                  border: '1.5px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  borderBottomColor: category === cat.value ? 'var(--primary)' : 'var(--border)',
                  background: category === cat.value ? 'var(--primary-light)' : 'transparent',
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="spinner" />
        ) : filteredVendors.length > 0 ? (
          <div className="grid-3">
            {filteredVendors.map((vendor) => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon"><Search size={48} style={{ color: 'var(--text-tertiary)', margin: '0 auto 16px' }} /></div>
            <h3>No vendors found</h3>
            <p>Try a different search or category</p>
          </div>
        )}
      </div>
    </div>
  );
}
