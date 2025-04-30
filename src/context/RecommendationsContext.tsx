import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useLibrary } from './LibraryContext';
import { useFavorites } from './FavoritesContext';
import { newsletters, Newsletter } from '../data/newsletters';

interface RecommendationsContextType {
  getRecommendedNewsletters: () => Newsletter[];
  getTrendingNewsletters: () => Newsletter[];
}

const RecommendationsContext = createContext<RecommendationsContextType | undefined>(undefined);

export function RecommendationsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { subscribedNewsletters } = useLibrary();
  const { favorites } = useFavorites();

  const getRecommendedNewsletters = () => {
    if (!user || subscribedNewsletters.length === 0) {
      return [];
    }

    // Get categories of subscribed newsletters
    const subscribedCategories = new Set(
      newsletters
        .filter(n => subscribedNewsletters.includes(n.id))
        .map(n => n.category)
    );

    // Find newsletters in the same categories that user hasn't subscribed to
    const recommendations = newsletters.filter(newsletter => 
      subscribedCategories.has(newsletter.category) && 
      !subscribedNewsletters.includes(newsletter.id)
    );

    // Sort by subscriber count as a basic relevance metric
    return recommendations
      .sort((a, b) => b.subscriberCount - a.subscriberCount)
      .slice(0, 4);
  };

  const getTrendingNewsletters = () => {
    // For now, we'll use subscriber count as a proxy for trending
    // In a real app, this would use actual engagement metrics
    return newsletters
      .filter(n => !subscribedNewsletters.includes(n.id))
      .sort((a, b) => b.subscriberCount - a.subscriberCount)
      .slice(0, 4);
  };

  return (
    <RecommendationsContext.Provider
      value={{
        getRecommendedNewsletters,
        getTrendingNewsletters,
      }}
    >
      {children}
    </RecommendationsContext.Provider>
  );
}

export function useRecommendations() {
  const context = useContext(RecommendationsContext);
  if (context === undefined) {
    throw new Error('useRecommendations must be used within a RecommendationsProvider');
  }
  return context;
}