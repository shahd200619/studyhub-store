import { createContext, useState, useContext, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const WishlistContext = createContext();
const STORAGE_KEY = 'studyhub-wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => loadFromStorage(STORAGE_KEY));

  useEffect(() => {
    saveToStorage(STORAGE_KEY, wishlist);
  }, [wishlist]);

  const toggleWishlist = (book) => {
    setWishlist((prev) =>
      prev.some((item) => item.id === book.id)
        ? prev.filter((item) => item.id !== book.id)
        : [...prev, book]
    );
  };

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);
  const removeFromWishlist = (id) => setWishlist((prev) => prev.filter((item) => item.id !== id));
  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, isInWishlist, removeFromWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
