import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistContextType {
  wishlistIds: string[];
  isWishlisted: (id: string) => boolean;
  toggleWishlist: (id: string) => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sukhyatri_wishlist');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return ['p3', 'p1']; // Pre-selected favourites
  });

  useEffect(() => {
    try {
      localStorage.setItem('sukhyatri_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  const isWishlisted = (id: string) => wishlistIds.includes(id);

  const toggleWishlist = (id: string) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isWishlisted,
        toggleWishlist,
        count: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
