import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { FiHeart, FiShoppingCart, FiClock, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loading from '../components/UI/Loading';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hero Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Flash Sale Timer State (Starts at a random 4-6 hours)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 32, seconds: 15 });

  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

  // Carousel Data
  const slides = [
    { title: 'Summer Collection 2024', subtitle: 'Get up to 40% OFF on latest trends', btn: 'Shop Fashion', bg: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' },
    { title: 'Tech Week is Here!', subtitle: 'Latest gadgets at unbeatable prices', btn: 'Shop Electronics', bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)' },
    { title: 'Home & Living Essentials', subtitle: 'Refresh your space with top brands', btn: 'Explore Now', bg: 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)' }
  ];

  // Testimonials Data
  const testimonials = [
    { name: 'Sarah J.', text: 'Absolutely love the quality of the products! Shipping was incredibly fast.', rating: 5 },
    { name: 'David M.', text: 'Best online shopping experience I\'ve had in a while. The UI is so smooth.', rating: 5 },
    { name: 'Ashley K.', text: 'Great deals and the customer support team was very helpful with my return.', rating: 4 }
  ];

  // Fetch Data on Load
  useEffect(() => {
    const getData = async () => {
      try {
        const cats = await fetchCategories();
        const prods = await fetchProducts(8); // Fetch top 8 products for home page
        setCategories(cats);
        setFeaturedProducts(prods);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  // Auto-rotate Carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Flash Sale Countdown Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        if (seconds === 0) { seconds = 59; minutes--; }
        else { seconds--; }
        if (minutes === 0) { minutes = 59; hours--; }
        if (hours === 0 && minutes === 0 && seconds === 0) { clearInterval(timer); return { hours: 0, minutes: 0, seconds: 0 }; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNewsletter = (e) => {
    e.preventDefault();
    toast.success('Subscribed successfully! Check your email for a welcome coupon.');
    e.target.reset();
  };

  if (loading) return <Loading text="Loading amazing deals..." />;

  // Helper to render product cards
  const ProductCard = ({ product }) => (
    <div className="card" style={{ position: 'relative' }}>
      {product.discountPercentage > 5 && (
        <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--danger)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 2 }}>
          -{Math.round(product.discountPercentage)}%
        </span>
      )}
      <Link to={`/products/${product.id}`}>
        <img src={product.thumbnail} alt={product.title} className="card-img" />
      </Link>
      <div className="card-body">
        <Link to={`/products/${product.id}`}><h3 style={{ fontSize: '15px', marginBottom: '8px', height: '40px', overflow: 'hidden' }}>{product.title}</h3></Link>
        <div className="flex-center">
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>${product.price}</span>
          <span style={{ fontSize: '13px', color: 'var(--primary-color)' }}>★ {product.rating}</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
          <button onClick={() => addToCart(product)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
            <FiShoppingCart style={{ marginRight: '5px' }} /> Add
          </button>
          <button onClick={() => toggleWishlist(product)} className="btn btn-outline btn-sm">
            <FiHeart style={{ color: wishlistItems.find(i => i.id === product.id) ? 'var(--danger)' : 'inherit' }} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* 1. HERO CAROUSEL SECTION */}
      <section style={{ ...styles.heroContainer, background: slides[currentSlide].bg }}>
        <button onClick={() => setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)} style={styles.sliderBtnLeft}><FiChevronLeft /></button>
        <div className="container" style={{ textAlign: 'center', zIndex: 2 }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', marginBottom: '15px', textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>{slides[currentSlide].title}</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '30px', color: '#e0e0e0' }}>{slides[currentSlide].subtitle}</p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '15px 40px', fontSize: '18px', borderRadius: '30px' }}>{slides[currentSlide].btn}</Link>
        </div>
        <button onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)} style={styles.sliderBtnRight}><FiChevronRight /></button>
        {/* Dots Indicator */}
        <div style={{ position: 'absolute', bottom: '20px', display: 'flex', gap: '10px' }}>
          {slides.map((_, i) => (
            <div key={i} onClick={() => setCurrentSlide(i)} style={{ width: '12px', height: '12px', borderRadius: '50%', background: currentSlide === i ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: '0.3s' }}></div>
          ))}
        </div>
      </section>

      {/* 2. CATEGORIES SECTION */}
      <section className="container" style={{ padding: '60px 0' }}>
        <h2 className="text-center mb-20">Shop by Category</h2>
        <div className="product-grid">
          {categories.map(cat => (
            <Link to={`/products?category=${cat.slug}`} key={cat.slug}>
              <div className="card" style={{ padding: '30px', textAlign: 'center', cursor: 'pointer' }}>
                <h3 style={{ textTransform: 'capitalize' }}>{cat.name}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '5px' }}>{cat.slug}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. FLASH SALE SECTION */}
      <section style={{ background: 'var(--bg-primary)', padding: '50px 0' }}>
        <div className="container">
          <div className="flex-center mb-20" style={{ flexWrap: 'wrap', gap: '20px' }}>
            <h2 style={{ textTransform: 'uppercase', color: 'var(--danger)' }}>⚡ Flash Sale</h2>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <FiClock style={{ color: 'var(--text-secondary)' }} />
              <span style={{ background: 'var(--text-primary)', color: 'var(--bg-primary)', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold', fontFamily: 'monospace' }}>
                {String(timeLeft.hours).padStart(2, '0')} : {String(timeLeft.minutes).padStart(2, '0')} : {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          <div className="product-grid">
            {featuredProducts.slice(0, 4).map(product => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      {/* 4. FEATURED / BEST SELLERS SECTION */}
      <section className="container" style={{ padding: '60px 0' }}>
        <div className="flex-center mb-20">
          <h2>Featured Products</h2>
          <Link to="/products" className="btn btn-outline btn-sm">View All</Link>
        </div>
        <div className="product-grid">
          {featuredProducts.slice(4, 8).map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      {/* 5. TESTIMONIALS SECTION */}
      <section style={{ background: 'var(--bg-secondary)', padding: '60px 0' }}>
        <div className="container">
          <h2 className="text-center mb-20">What Our Customers Say</h2>
          <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ padding: '25px', textAlign: 'center' }}>
                <div style={{ color: '#f59e0b', fontSize: '20px', marginBottom: '15px' }}>
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '15px', lineHeight: '1.6' }}>"{t.text}"</p>
                <h4 style={{ color: 'var(--primary-color)' }}>{t.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. NEWSLETTER SECTION */}
      <section style={{ background: 'linear-gradient(to right, #0f172a, #1e293b)', color: 'white', padding: '60px 20px' }}>
        <div className="container text-center">
          <h2 style={{ marginBottom: '10px' }}>Stay in the Loop</h2>
          <p style={{ color: '#94a3b8', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
            Subscribe to our newsletter and get 10% off your first order plus exclusive deals.
          </p>
          <form onSubmit={handleNewsletter} style={{ display: 'flex', maxWidth: '500px', margin: '0 auto', gap: '10px' }} className="newsletter-form">
            <input 
              type="email" 
              required 
              placeholder="Enter your email address" 
              className="form-control" 
              style={{ flex: 1, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>

      {/* Responsive Styles specific to Home Page */}
      <style>{`
        .hero-section { position: relative; height: 500px; display: flex; align-items: center; justify-content: center; color: white; overflow: hidden; transition: background 1s ease-in-out; }
        .slider-btn { position: absolute; top: 50%; transform: translateY(-50%); background: rgba(255,255,255,0.2); color: white; font-size: 24px; padding: 15px; border-radius: 50%; backdrop-filter: blur(5px); z-index: 10; transition: 0.3s; border: none; }
        .slider-btn:hover { background: rgba(255,255,255,0.4); }
        .slider-btn-left { left: 20px; }
        .slider-btn-right { right: 20px; }
        
        @media (max-width: 768px) {
          .hero-section { height: 400px; padding: 0 20px; }
          .hero-section h1 { font-size: 2rem !important; }
          .slider-btn { display: none; } /* Hide arrows on mobile, rely on auto-slide and dots */
          .newsletter-form { flex-direction: column; }
        }
      `}</style>
    </div>
  );
}

// Inline styles for hero to keep JSX cleaner
const styles = {
  heroContainer: {
    position: 'relative',
    height: '500px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    overflow: 'hidden',
    transition: 'background 1s ease-in-out'
  },
  sliderBtnLeft: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '24px', padding: '15px', borderRadius: '50%', backdropFilter: 'blur(5px)', zIndex: 10, left: '20px' },
  sliderBtnRight: { position: 'absolute', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '24px', padding: '15px', borderRadius: '50%', backdropFilter: 'blur(5px)', zIndex: 10, right: '20px' }
};