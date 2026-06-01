import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts, fetchCategories, fetchProductsByCategory } from '../Services/api';
import { useCart } from '../Context/CartContext';
import { useWishlist } from '../Context/WishlistContext';
import { FiGrid, FiList, FiHeart, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import Loading from '../Components/UI/Loading';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter & Sort States
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('default');
  const [view, setView] = useState('grid');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [minRating, setMinRating] = useState(0);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [loading, setLoading] = useState(true);
  const activeCategory = searchParams.get('category') || 'all';
  
  const { addToCart } = useCart();
  const { wishlistItems, toggleWishlist } = useWishlist();

    useEffect(() => {
    setLoading(true);
    setCurrentPage(1); 
    
    // Fetch admin-added products from LocalStorage
    const customProducts = JSON.parse(localStorage.getItem('custom_products')) || [];

    if (activeCategory === 'all') {
      fetchProducts(100).then(data => { 
        setProducts([...customProducts, ...data]); // Add custom products to the beginning
        setLoading(false); 
      });
    } else {
      fetchProductsByCategory(activeCategory).then(data => { 
        setProducts([...customProducts, ...data]); 
        setLoading(false); 
      });
    }
    fetchCategories().then(setCategories);
  }, [activeCategory]);

  // Filtering & Sorting Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter(p => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
      const matchRating = p.rating >= minRating;
      return matchSearch && matchPrice && matchRating;
    });

    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);
    if (sort === 'newest') result.sort((a, b) => b.id - a.id); // DummyJSON higher ID = newer

    return result;
  }, [products, search, sort, priceRange, minRating]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading) return <Loading text="Fetching products..." />;

  return (
    <div className="container" style={{ padding: '20px 0' }}>
      <h1>{activeCategory === 'all' ? 'All Products' : activeCategory.replace('-', ' ').toUpperCase()}</h1>
      
      {/* TOOLBAR */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', margin: '20px 0', alignItems: 'center' }}>
        <input type="text" placeholder="Search products..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} className="form-control" style={{ maxWidth: '250px' }} />
        
        <select value={activeCategory} onChange={e => setSearchParams(e.target.value === 'all' ? {} : { category: e.target.value })} className="form-control" style={{ maxWidth: '180px' }}>
          <option value="all">All Categories</option>
          {categories.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>

        <select value={sort} onChange={e => setSort(e.target.value)} className="form-control" style={{ maxWidth: '180px' }}>
          <option value="default">Sort By</option>
          <option value="price-asc">Price: Low-High</option>
          <option value="price-desc">Price: High-Low</option>
          <option value="rating">Top Rating</option>
          <option value="newest">Newest First</option>
        </select>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
          <label>Min Rating:</label>
          <select value={minRating} onChange={e => { setMinRating(Number(e.target.value)); setCurrentPage(1); }} className="form-control" style={{ maxWidth: '80px', padding: '5px' }}>
            <option value={0}>Any</option>
            <option value={3}>3★+</option>
            <option value={4}>4★+</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '14px' }}>
          <label>Price:</label>
          <input type="number" placeholder="Min" value={priceRange[0] === 0 ? '' : priceRange[0]} onChange={e => { setPriceRange([Number(e.target.value) || 0, priceRange[1]]); setCurrentPage(1); }} className="form-control" style={{ width: '70px', padding: '5px' }} />
          <span>-</span>
          <input type="number" placeholder="Max" value={priceRange[1] === 5000 ? '' : priceRange[1]} onChange={e => { setPriceRange([priceRange[0], Number(e.target.value) || 9999]); setCurrentPage(1); }} className="form-control" style={{ width: '70px', padding: '5px' }} />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '5px' }}>
          <button onClick={() => setView('grid')} className="btn btn-sm" style={{ background: view === 'grid' ? 'var(--primary-color)' : 'transparent', color: view === 'grid' ? 'white' : 'var(--text-primary)' }}><FiGrid /></button>
          <button onClick={() => setView('list')} className="btn btn-sm" style={{ background: view === 'list' ? 'var(--primary-color)' : 'transparent', color: view === 'list' ? 'white' : 'var(--text-primary)' }}><FiList /></button>
        </div>
      </div>

      {/* PRODUCT GRID / LIST */}
      {paginatedProducts.length === 0 ? (
        <div className="text-center" style={{ padding: '50px' }}><h2>No products found matching your criteria.</h2></div>
      ) : (
        <div className={view === 'grid' ? 'product-grid' : ''} style={view === 'list' ? { display: 'flex', flexDirection: 'column', gap: '15px' } : {}}>
          {paginatedProducts.map(p => (
            <div key={p.id} className="card" style={view === 'list' ? { display: 'flex', flexDirection: 'row' } : { position: 'relative' }}>
              {p.discountPercentage > 5 && (
                <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'var(--danger)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', zIndex: 2 }}>
                  -{Math.round(p.discountPercentage)}%
                </span>
              )}
              <Link to={`/products/${p.id}`} style={{ width: view === 'list' ? '180px' : '100%' }}>
                <img src={p.thumbnail} alt={p.title} className="card-img" style={view === 'list' ? { height: '100%', objectFit: 'cover' } : {}} />
              </Link>
              <div className="card-body" style={{ width: '100%' }}>
                <div className="flex-center">
                  <Link to={`/products/${p.id}`}><h3 style={{ fontSize: '16px', marginRight: '10px' }}>{p.title}</h3></Link>
                  <button onClick={() => toggleWishlist(p)} style={{ background: 'none', color: wishlistItems.find(i => i.id === p.id) ? 'var(--danger)' : 'var(--text-secondary)', fontSize: '20px' }}><FiHeart /></button>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '5px 0' }}>{p.category} {p.brand ? `• ${p.brand}` : ''}</p>
                <div className="flex-center" style={{ marginTop: '10px' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '18px' }}>${p.price}</span>
                  <span style={{ fontSize: '14px', color: 'var(--primary-color)' }}>★ {p.rating}</span>
                  <span style={{ fontSize: '12px', color: p.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>{p.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
                <button onClick={() => addToCart(p)} className="btn btn-primary btn-sm" style={{ marginTop: '10px' }} disabled={p.stock === 0}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', marginTop: '40px' }}>
          <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="btn btn-outline btn-sm"><FiChevronLeft /></button>
          <span style={{ fontWeight: 'bold' }}>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="btn btn-outline btn-sm"><FiChevronRight /></button>
        </div>
      )}
    </div>
  );
}
