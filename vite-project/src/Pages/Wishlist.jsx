import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { FiTrash2, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';

export default function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Handle moving item to cart and removing from wishlist simultaneously
  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product.id);
    toast.success(`${product.title.substring(0, 20)} moved to cart`);
  };

  // Empty State
  if (wishlistItems.length === 0) {
    return (
      <div className="container text-center" style={{ padding: '80px 20px' }}>
        <h2>Your Wishlist is Empty</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '10px', marginBottom: '30px' }}>
          Looks like you haven't saved any items yet.
        </p>
        <Link to="/products" className="btn btn-primary">Explore Products</Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <h1>My Wishlist ({wishlistItems.length})</h1>
      
      <div className="product-grid" style={{ marginTop: '20px' }}>
        {wishlistItems.map(item => (
          <div key={item.id} className="card">
            <Link to={`/products/${item.id}`}>
              <img src={item.thumbnail} alt={item.title} className="card-img" />
            </Link>
            <div className="card-body">
              <Link to={`/products/${item.id}`}>
                <h3 style={{ fontSize: '15px', marginBottom: '10px', height: '40px', overflow: 'hidden' }}>
                  {item.title}
                </h3>
              </Link>
              
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '5px' }}>
                {item.category}
              </p>
              
              <p style={{ fontWeight: 'bold', fontSize: '18px', margin: '10px 0' }}>
                ${item.price}
              </p>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handleMoveToCart(item)} 
                  className="btn btn-primary btn-sm" 
                  style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px' }}
                >
                  <FiShoppingCart /> Move to Cart
                </button>
                <button 
                  onClick={() => removeFromWishlist(item.id)} 
                  className="btn btn-danger btn-sm"
                >
                  <FiTrash2 />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  
}

export function WishlistCount() {
  const { wishlistItems } = useWishlist();
  return (
    <span className="badge badge-secondary" style={{ marginLeft: '5px' }}>
      {wishlistItems.length}
    </span>
  );
}