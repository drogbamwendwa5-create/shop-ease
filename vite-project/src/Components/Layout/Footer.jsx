import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ background: 'var(--bg-primary)', padding: '40px 0', marginTop: '50px', borderTop: '1px solid var(--border-color)' }}>
      <div className="container" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:'20px', textAlign:'center'}}>
        <div>
          <h3>ShopVibe</h3>
          <p style={{fontSize:'14px', color:'var(--text-secondary)', marginTop:'10px'}}>Your one-stop shop for everything.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <div className="footer-links">
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/products">Products</Link>
          </div>
        </div>
        <div>
          <h4>Follow Us</h4>
          <div style={{display:'flex', gap:'15px', justifyContent:'center', marginTop:'10px', fontSize:'20px'}}>
            <a href="https://www.facebook.com" aria-label="Facebook"><FaFacebook /></a>
            <a href="https://www.twitter.com" aria-label="Twitter"><FaTwitter /></a>
            <a href="https://www.instagram.com" aria-label="Instagram"><FaInstagram /></a>
          </div>
        </div>
      </div>
      <div style={{textAlign:'center', marginTop:'30px', fontSize:'14px', color:'var(--text-secondary)'}}>
        © {new Date().getFullYear()} ShopVibe. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
