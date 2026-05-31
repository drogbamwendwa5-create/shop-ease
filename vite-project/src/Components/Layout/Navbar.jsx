import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiUser, FiShoppingCart } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>ShopVibe</Link>
        
        <div className="nav-links">
          <Link to="/products">Products</Link>
          
          <div className="cart-icon">
            <Link to="/cart"><FiShoppingCart /></Link>
            {cartItems.length > 0 && <span className="cart-badge">{cartItems.length}</span>}
          </div>

          <button onClick={toggleTheme} style={{ background: 'none', fontSize: '20px' }}>
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          {isAuthenticated ? (
            <>
              {user.role === 'admin' && <Link to="/admin">Admin</Link>}
              <Link to="/dashboard"><FiUser /></Link>
              <button onClick={logout} className="btn btn-danger" style={{padding: '5px 10px'}}><FiLogOut /></button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;