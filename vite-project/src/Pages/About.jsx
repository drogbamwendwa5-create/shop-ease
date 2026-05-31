import { Link } from 'react-router-dom';
import { FiTruck, FiHeadphones, FiShield, FiHeart } from 'react-icons/fi';

export default function About() {
  // Core values data
  const values = [
    { icon: <FiTruck size={30} />, title: 'Fast & Free Shipping', desc: 'Get your products delivered to your doorstep quickly and safely on orders over $100.' },
    { icon: <FiHeadphones size={30} />, title: '24/7 Support', desc: 'Our dedicated team is always available to help you with any questions or issues.' },
    { icon: <FiShield size={30} />, title: 'Secure Payments', desc: 'Shop with peace of mind knowing your financial data is protected with top-tier encryption.' },
    { icon: <FiHeart size={30} />, title: 'Customer Satisfaction', desc: 'We go above and beyond to ensure you love every purchase you make with us.' }
  ];

  return (
    <div style={{ padding: '60px 0' }}>
      
      {/* About Header */}
      <section className="container text-center" style={{ marginBottom: '60px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>About ShopVibe</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8', fontSize: '18px' }}>
          Founded in 2023, ShopVibe is a modern e-commerce platform dedicated to bringing you the best products from around the world. 
          We believe that online shopping should be easy, affordable, and enjoyable.
        </p>
      </section>

      {/* Mission Statement */}
      <section style={{ background: 'var(--bg-primary)', padding: '40px 0', marginBottom: '60px' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '15px' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', lineHeight: '1.7' }}>
            To democratize access to high-quality goods by connecting consumers directly with global manufacturers, 
            cutting out the middleman to pass real savings on to you.
          </p>
        </div>
      </section>

      {/* Core Values Grid */}
      <section className="container" style={{ marginBottom: '60px' }}>
        <h2 className="text-center mb-20">Why Choose Us?</h2>
        <div className="product-grid">
          {values.map((val, index) => (
            <div key={index} className="card" style={{ padding: '30px', textAlign: 'center' }}>
              <div style={{ 
                color: 'var(--primary-color)', background: 'var(--bg-secondary)', 
                width: '70px', height: '70px', borderRadius: '50%', 
                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                margin: '0 auto 20px' 
              }}>
                {val.icon}
              </div>
              <h3 style={{ marginBottom: '10px' }}>{val.title}</h3>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="container text-center" style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white', padding: '60px 20px', borderRadius: '12px' }}>
        <h2 style={{ marginBottom: '15px' }}>Ready to Start Shopping?</h2>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Explore thousands of products and find your next favorite thing.</p>
        <Link to="/products" className="btn btn-primary" style={{ padding: '15px 30px', fontSize: '18px' }}>
          Browse Products
        </Link>
      </section>
    </div>
  );
}