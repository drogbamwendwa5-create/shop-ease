import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

const COUPONS = {
  'SAVE10': 0.10, // 10% off
  'WELCOME20': 0.20
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => JSON.parse(localStorage.getItem('cart')) || []);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    const exists = cartItems.find(item => item.id === product.id);
    if (exists) {
      setCartItems(cartItems.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
    }
    toast.success(`${product.title} added to cart!`);
  };

  const removeFromCart = (id) => setCartItems(cartItems.filter(item => item.id !== id));
  const updateQty = (id, qty) => {
    if(qty < 1) return removeFromCart(id);
    setCartItems(cartItems.map(item => item.id === id ? { ...item, qty } : item));
  };

  const applyCoupon = (code) => {
    if (COUPONS[code.toUpperCase()]) {
      setCoupon({ code: code.toUpperCase(), discount: COUPONS[code.toUpperCase()] });
      toast.success('Coupon applied!');
    } else {
      toast.error('Invalid coupon code');
    }
  };

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const discountAmount = coupon ? subtotal * coupon.discount : 0;
  const tax = (subtotal - discountAmount) * 0.1; // 10% tax
  const shipping = subtotal > 100 ? 0 : 15; // Free shipping over $100
  const total = subtotal - discountAmount + tax + shipping;

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, applyCoupon, coupon, subtotal, discountAmount, tax, shipping, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);