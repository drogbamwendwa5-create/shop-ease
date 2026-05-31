import { Link } from 'react-router-dom';
import { FiHome, FiSearch } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '70vh', 
      padding: '40px 20px',
      textAlign: 'center' 
    }}>
      <div>
        {/* Animated 404 Text */}
        <h1 style={{ 
          fontSize: '8rem', 
          fontWeight: '800', 
          color: 'var(--primary-color)', 
          lineHeight: 1, 
          marginBottom: '10px',
          textShadow: '4px 4px 0px var(--border-color)',
          animation: 'float 3s ease-in-out infinite'
        }}>
          404
        </h1>

        <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: 'var(--text-primary)' }}>
          Oops! Page Not Found
        </h2>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          maxWidth: '500px', 
          margin: '0 auto 30px', 
          lineHeight: '1.6', 
          fontSize: '16px' 
        }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px' }}>
            <FiHome /> Back to Home
          </Link>
          <Link to="/products" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 25px' }}>
            <FiSearch /> Browse Products
          </Link>
        </div>
      </div>

      {/* Simple floating animation for the 404 number */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}