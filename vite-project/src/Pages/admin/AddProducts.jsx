import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../Services/api';
import { toast } from 'react-toastify';

export default function AddProduct() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    discountPercentage: '',
    stock: '',
    brand: '',
    category: '',
    thumbnail: '' // Using a single image URL for simplicity
  });

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic Validation
    if (!formData.title || !formData.price || !formData.category) {
      return toast.error('Title, Price, and Category are required!');
    }

    // Create the new product object
    const newProduct = {
      id: Date.now(), // Generate a unique ID based on timestamp
      title: formData.title,
      description: formData.description,
      price: parseFloat(formData.price),
      discountPercentage: parseFloat(formData.discountPercentage) || 0,
      stock: parseInt(formData.stock) || 10,
      brand: formData.brand || 'Generic',
      category: formData.category,
      thumbnail: formData.thumbnail || 'https://via.placeholder.com/150', // Fallback image
      images: [formData.thumbnail || 'https://via.placeholder.com/150'],
      rating: 4.5 // Default rating for new products
    };

    // Save to LocalStorage
    const existingProducts = JSON.parse(localStorage.getItem('custom_products')) || [];
    existingProducts.push(newProduct);
    localStorage.setItem('custom_products', JSON.stringify(existingProducts));

    toast.success('Product added successfully!');
    navigate('/admin'); // Go back to admin dashboard
  };

  return (<div className="add-product-container">
    <h2>Add New Product</h2>
    <form onSubmit={handleSubmit} className="add-product-form"> 
        <input type="text" name="title" placeholder="Title" value={formData.title} onChange={handleChange} required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input type="number" name="discountPercentage" placeholder="Discount Percentage" value={formData.discountPercentage} onChange={handleChange} />
        <input type="number" name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} />
        <input type="text" name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input type="text" name="thumbnail" placeholder="Image URL" value={formData.thumbnail} onChange={handleChange} />
        <button type="submit">Add Product</button>
    </form>
  </div>);
}
