import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { FiUser, FiPackage, FiHeart, FiMapPin } from 'react-icons/fi';

export default function UserDashboard() {
  const { user } = useAuth();
  
  // Simulate fetching recently viewed products from LocalStorage
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  // Mock Order History Data
  const mockOrders = [
    { id: 'ORD-8834', date: 'Oct 24, 2023', total: '$125.00', status: 'Delivered', color: 'var(--success)' },
    { id: 'ORD-8810', date: 'Oct 15, 2023', total: '$45.50', status: 'Shipped', color: 'var(--primary-color)' },
    { id: 'ORD-8790', date: 'Oct 02, 2023', total: '$210.00', status: 'Processing', color: 'var(--warning)' }
  ];

  useEffect(() => {
    // Check if user has recently viewed items saved in local storage
    const saved = localStorage.getItem('recentlyViewed');
    if (saved) {
      setRecentlyViewed(JSON.parse(saved));
    }
  }, []);

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      
      {/* Welcome Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1>Welcome back, {user?.name || 'User'}!</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>
          Manage your account, track orders, and view your activity.
        </p>
      </div>

      {/* Quick Actions Grid */}
      <div className="product-grid" style={{ marginBottom: '40px' }}>
        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <FiUser style={{ fontSize: '40px', color: 'var(--primary-color)', marginBottom: '15px' }} />
          <h3>My Profile</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '10px 0' }}>Update your personal info</p>
          <Link to="/profile" className="btn btn-outline btn-sm">Edit Profile</Link>
        </div>

        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <FiPackage style={{ fontSize: '40px', color: 'var(--success)', marginBottom: '15px' }} />
          <h3>Orders</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '10px 0' }}>Track your recent purchases</p>
          <button className="btn btn-outline btn-sm" style={{ opacity: 0.7, cursor: 'not-allowed' }}>View All</button>
        </div>

        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <FiHeart style={{ fontSize: '40px', color: 'var(--danger)', marginBottom: '15px' }} />
          <h3>Wishlist</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '10px 0' }}>Products you saved</p>
          <Link to="/wishlist" className="btn btn-outline btn-sm">View Wishlist</Link>
        </div>

        <div className="card" style={{ padding: '30px', textAlign: 'center' }}>
          <FiMapPin style={{ fontSize: '40px', color: 'var(--warning)', marginBottom: '15px' }} />
          <h3>Addresses</h3>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '10px 0' }}>Manage shipping addresses</p>
          <button className="btn btn-outline btn-sm" style={{ opacity: 0.7, cursor: 'not-allowed' }}>Manage</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }} className="dashboard-bottom-grid">
        
        {/* Recent Orders Table */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Recent Orders</h3>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 'bold' }}>{order.id}</td>
                  <td>{order.date}</td>
                  <td>{order.total}</td>
                  <td style={{ color: order.color, fontWeight: '600' }}>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recently Viewed Products */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '15px' }}>Recently Viewed</h3>
          {recentlyViewed.length === 0 ? (
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              No recently viewed products yet. Start browsing!
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {recentlyViewed.slice(0, 3).map(item => (
                <Link to={`/products/${item.id}`} key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={item.thumbnail} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'contain', borderRadius: '4px' }} />
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: '500' }}>{item.title.substring(0, 15)}...</p>
                    <p style={{ fontSize: '12px', color: 'var(--primary-color)' }}>${item.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Responsive fix for the bottom grid */}
      <style>{`
        @media (max-width: 768px) {
          .dashboard-bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
