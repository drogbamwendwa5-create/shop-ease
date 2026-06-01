import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { FiUsers, FiShoppingBag, FiDollarSign, FiPlusCircle } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user } = useAuth();
  const stats = [
    { title: 'Total Sales', value: '$45,230', icon: <FiDollarSign /> },
    { title: 'Orders', value: '320', icon: <FiShoppingBag /> },
    { title: 'Customers', value: '1,205', icon: <FiUsers /> }
  ];

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <div className="flex-center" style={{ marginBottom: '30px' }}>
        <div>
          <h1>Admin Panel</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Welcome, {user.name}.</p>
        </div>
        <Link to="/admin/add-product" className="btn btn-primary">
          <FiPlusCircle style={{ marginRight: '5px' }} /> Add New Product
        </Link>
      </div>
      
      <div className="product-grid" style={{ marginBottom: '30px' }}>
        {stats.map((s, i) => (
          <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '40px', color: 'var(--primary-color)', background: 'var(--bg-secondary)', padding: '15px', borderRadius: '50%' }}>{s.icon}</div>
            <div><p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{s.title}</p><h2>{s.value}</h2></div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <h3>Recent Orders</h3>
        <table className="admin-table">
          <thead><tr><th>Order ID</th><th>Customer</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>#ORD-1234</td><td>John Doe</td><td>$120.00</td><td style={{ color: 'var(--success)' }}>Delivered</td></tr>
            <tr><td>#ORD-1235</td><td>Jane Smith</td><td>$85.50</td><td style={{ color: 'var(--warning)' }}>Pending</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
