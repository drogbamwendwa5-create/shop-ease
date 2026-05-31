import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const WishlistContext = createContext();
export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  // Load wishlist from LocalStorage if it exists, otherwise start empty
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to LocalStorage whenever wishlist changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // Toggle function: Adds if not in list, Removes if already in list
  const toggleWishlist = (product) => {
    setWishlistItems(items => {
      const exists = items.find(i => i.id === product.id);
      if (exists) {
        toast.info('Removed from wishlist');
        return items.filter(i => i.id !== product.id);
      }
      toast.success('Added to wishlist');
      return [...items, product];
    });
  };

  // Explicitly remove an item
  const removeFromWishlist = (id) => {
    setWishlistItems(items => items.filter(i => i.id !== id));
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};