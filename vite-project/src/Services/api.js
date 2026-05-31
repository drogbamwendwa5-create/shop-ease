import axios from 'axios';

const API_URL = 'https://dummyjson.com';

export const fetchProducts = (limit = 0) => axios.get(`${API_URL}/products?limit=${limit}`).then(res => res.data.products);

export const fetchProductById = (id) => axios.get(`${API_URL}/products/${id}`).then(res => res.data);

export const fetchCategories = () => axios.get(`${API_URL}/products/categories`).then(res => res.data);

export const fetchProductsByCategory = (slug) => axios.get(`${API_URL}/products/category/${slug}`).then(res => res.data.products);

export const searchProducts = (q) => axios.get(`${API_URL}/products/search?q=${q}`).then(res => res.data.products);