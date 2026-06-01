import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductById, fetchProductsByCategory } from '../Services/api';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { useAuth } from '../Context/AuthContext';
import { FiHeart, FiShoppingCart, FiMinus, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { toast } from 'react-toastify';
import Loading from '../Components/UI/Loading';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);

  // Review System State
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [editingReview, setEditingReview] = useState(null);

  // Fetch Product & Related Products
  useEffect(() => {
    fetchProductById(id).then(data => {
      setProduct(data);
      setSelectedImg(0);
      setQty(1);
      // Fetch Related Products
      fetchProductsByCategory(data.category).then(res => setRelatedProducts(res.filter(p => p.id !== data.id).slice(0, 4)));
      
      // FIX: Save to Recently Viewed ONLY after product data is loaded
      const recent = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      const exists = recent.find(p => p.id === data.id);
      if (!exists) {
        recent.unshift({ id: data.id, title: data.title, thumbnail: data.thumbnail, price: data.price });
        localStorage.setItem('recentlyViewed', JSON.stringify(recent.slice(0, 5)));
      }
    });
    
    // Load reviews from LocalStorage
    setReviews(JSON.parse(localStorage.getItem(`reviews_${id}`)) || []);
  }, [id]);

  // Save reviews when they change
  useEffect(() => {
    if (reviews.length >= 0) {
      localStorage.setItem(`reviews_${id}`, JSON.stringify(reviews));
    }
  }, [reviews, id]);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${qty} item(s) added to cart!`);
  };

  // Review Handlers
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.error('Please login to leave a review');
    if (!reviewText) return toast.error('Review cannot be empty');

    if (editingReview) {
      setReviews(reviews.map(r => r.id === editingReview ? { ...r, text: reviewText, rating: reviewRating } : r));
      toast.success('Review updated!');
      setEditingReview(null);
    } else {
      const newReview = { id: Date.now(), user: 'Current User', text: reviewText, rating: reviewRating, date: new Date().toLocaleDateString() };
      setReviews([...reviews, newReview]);
      toast.success('Review added!');
    }
    setReviewText('');
    setReviewRating(5);
  };

  const handleDeleteReview = (revId) => {
    setReviews(reviews.filter(r => r.id !== revId));
    toast.info('Review deleted');
  };

  const handleEditReview = (rev) => {
    setReviewText(rev.text);
    setReviewRating(rev.rating);
    setEditingReview(rev.id);
    window.scrollTo({ top: document.getElementById('reviews-section').offsetTop - 100, behavior: 'smooth' });
  };

  if (!product) return <Loading text="Loading Product Details..." />;

  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <Link to="/products" style={{ color: 'var(--primary-color)', marginBottom: '20px', display: 'inline-block' }}>← Back to Products</Link>

      <div className="detail-grid">
        <div>
          <img src={product.images[selectedImg]} alt={product.title} className="gallery-img" />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
            {product.images.map((img, i) => (
              <img key={i} src={img} alt="" className={`thumbnail ${selectedImg === i ? 'active' : ''}`} onClick={() => setSelectedImg(i)} />
            ))}
          </div>
        </div>

        <div>
          <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>{product.title}</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>{product.category} {product.brand ? `• Brand: ${product.brand}` : ''}</p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--primary-color)' }}>${product.price}</span>
            {product.discountPercentage > 5 && (
              <span style={{ background: 'var(--danger)', color: 'white', padding: '5px 10px', borderRadius: '20px', fontSize: '14px' }}>-{Math.round(product.discountPercentage)}% OFF</span>
            )}
            <span style={{ color: '#f59e0b' }}>★ {product.rating}</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>{product.description}</p>
          <p style={{ fontWeight: 'bold', color: product.stock > 0 ? 'var(--success)' : 'var(--danger)', marginBottom: '20px' }}>
            {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
          </p>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="btn btn-outline" style={{ padding: '10px 15px', borderRadius: 0 }}><FiMinus /></button>
              <span style={{ padding: '10px 20px', fontWeight: 'bold' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="btn btn-outline" style={{ padding: '10px 15px', borderRadius: 0 }}><FiPlus /></button>
            </div>
            <button onClick={handleAddToCart} className="btn btn-primary" style={{ flex: 1, minWidth: '150px' }} disabled={product.stock === 0}>
              <FiShoppingCart style={{ marginRight: '5px' }} /> Add to Cart
            </button>
            <button onClick={() => toggleWishlist(product)} className="btn btn-outline" style={{ padding: '10px 15px' }}>
              <FiHeart style={{ color: wishlistItems.find(i => i.id === product.id) ? 'var(--danger)' : 'inherit', fontSize: '20px' }} />
            </button>
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px', marginTop: '40px' }}>
        <h2 style={{ marginBottom: '15px' }}>Specifications</h2>
        <table className="admin-table">
          <tbody>
            {Object.entries(product.dimensions || {}).map(([key, val]) => (
              <tr key={key}><td style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{key}</td><td>{val}</td></tr>
            ))}
            <tr><td style={{ fontWeight: 'bold' }}>Warranty</td><td>{product.warrantyInformation}</td></tr>
            <tr><td style={{ fontWeight: 'bold' }}>Shipping Policy</td><td>{product.shippingInformation}</td></tr>
          </tbody>
        </table>
      </div>

      <div id="reviews-section" className="card" style={{ padding: '20px', marginTop: '30px' }}>
        <h2 style={{ marginBottom: '20px' }}>Customer Reviews ({reviews.length})</h2>
        <form onSubmit={handleReviewSubmit} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
          <h4>{editingReview ? 'Edit Review' : 'Write a Review'}</h4>
          <div style={{ margin: '15px 0', display: 'flex', gap: '5px' }}>
            {[1, 2, 3, 4, 5].map(star => (
              <span key={star} onClick={() => setReviewRating(star)} style={{ cursor: 'pointer', fontSize: '24px', color: star <= reviewRating ? '#f59e0b' : 'var(--border-color)' }}>★</span>
            ))}
          </div>
          <textarea className="form-control" rows="3" placeholder="What did you like or dislike?" value={reviewText} onChange={e => setReviewText(e.target.value)}></textarea>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit" className="btn btn-primary btn-sm">{editingReview ? 'Update Review' : 'Submit Review'}</button>
            {editingReview && <button type="button" onClick={() => { setEditingReview(null); setReviewText(''); }} className="btn btn-outline btn-sm">Cancel</button>}
          </div>
        </form>
        {reviews.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first!</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {reviews.map(rev => (
              <div key={rev.id} style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                <div className="flex-center">
                  <strong>{rev.user}</strong>
                  <span style={{ color: '#f59e0b' }}>{'★'.repeat(rev.rating)}</span>
                  <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{rev.date}</span>
                </div>
                <p style={{ margin: '10px 0', color: 'var(--text-secondary)' }}>{rev.text}</p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleEditReview(rev)} className="btn btn-outline btn-sm" style={{ fontSize: '12px' }}><FiEdit2 /> Edit</button>
                  <button onClick={() => handleDeleteReview(rev.id)} className="btn btn-danger btn-sm" style={{ fontSize: '12px' }}><FiTrash2 /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div style={{ marginTop: '50px' }}>
          <h2 style={{ marginBottom: '20px' }}>Related Products</h2>
          <div className="product-grid">
            {relatedProducts.map(p => (
              <div key={p.id} className="card">
                <Link to={`/products/${p.id}`}><img src={p.thumbnail} alt={p.title} className="card-img" /></Link>
                <div className="card-body">
                  <Link to={`/products/${p.id}`}><h3 style={{ fontSize: '15px', marginBottom: '8px', height: '40px', overflow: 'hidden' }}>{p.title}</h3></Link>
                  <div className="flex-center"><span style={{ fontWeight: 'bold' }}>${p.price}</span><span style={{ fontSize: '13px', color: 'var(--primary-color)' }}>★ {p.rating}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
