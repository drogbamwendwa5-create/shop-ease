import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishlistContext';
import { useTheme } from '../../Context/ThemeContext';
import { FiSun, FiMoon, FiLogOut, FiUser, FiShoppingCart, FiHeart, FiMenu, FiX } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close mobile menu when a link is clicked
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }} onClick={closeMenu}>
          ShopVibe
        </Link>
        
        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
          {/* Main Navigation Links */}
          <NavLink to="/" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/products" onClick={closeMenu}>Products</NavLink>
          <NavLink to="/about" onClick={closeMenu}>About</NavLink>
          <NavLink to="/contact" onClick={closeMenu}>Contact</NavLink>
          
          {/* Icon Actions */}
          <Link to="/wishlist" className="icon-btn" onClick={closeMenu} aria-label="Wishlist">
            <FiHeart /> 
            <span className="badge-counter">{wishlistItems.length}</span>
          </Link>

          <Link to="/cart" className="icon-btn" onClick={closeMenu} aria-label="Cart">
            <FiShoppingCart /> 
            <span className="badge-counter">{cartItems.length}</span>
          </Link>

          <button onClick={toggleTheme} className="icon-btn" aria-label="Toggle theme">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>

          {/* Auth Links */}
          {isAuthenticated ? (
            <>
              {user.role === 'admin' && <Link to="/admin" onClick={closeMenu}>Admin</Link>}
              <Link to="/dashboard" onClick={closeMenu} className="icon-btn" title="Dashboard"><FiUser /></Link>
              <button onClick={() => { logout(); closeMenu(); }} className="btn btn-danger btn-sm"><FiLogOut /></button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu}>Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}
