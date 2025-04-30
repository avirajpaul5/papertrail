import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (newsletterId: string) => boolean;
  toggleFavorite: (newsletterId: string) => void;
  getFavoriteCount: (newsletterId: string) => number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [favoriteCounts, setFavoriteCounts] = useState<Record<string, number>>({});

  // Load user's favorites from localStorage when user changes
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`favorites-${user.id}`);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } else {
      setFavorites([]);
    }
  }, [user]);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `favorites-${user.id}`,
        JSON.stringify(favorites)
      );
    }
  }, [user, favorites]);

  const isFavorite = (newsletterId: string) => {
    return favorites.includes(newsletterId);
  };

  const toggleFavorite = (newsletterId: string) => {
    setFavorites(prev => {
      if (prev.includes(newsletterId)) {
        return prev.filter(id => id !== newsletterId);
      } else {
        return [...prev, newsletterId];
      }
    });

    // Update favorite count
    setFavoriteCounts(prev => ({
      ...prev,
      [newsletterId]: (prev[newsletterId] || 0) + (isFavorite(newsletterId) ? -1 : 1)
    }));
  };

  const getFavoriteCount = (newsletterId: string) => {
    return favoriteCounts[newsletterId] || 0;
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        getFavoriteCount
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}