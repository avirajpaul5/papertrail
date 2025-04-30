import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { newsletters } from '../data/newsletters';

interface LibraryContextType {
  subscribedNewsletters: string[];
  isSubscribed: (newsletterId: string) => boolean;
  subscribe: (newsletterId: string) => void;
  unsubscribe: (newsletterId: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscribedNewsletters, setSubscribedNewsletters] = useState<string[]>([]);

  // Load user's subscriptions from localStorage when user changes
  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`subscriptions-${user.id}`);
      if (stored) {
        setSubscribedNewsletters(JSON.parse(stored));
      } else {
        // Start with empty subscriptions for new users
        setSubscribedNewsletters([]);
      }
    } else {
      // Reset when logged out
      setSubscribedNewsletters([]);
    }
  }, [user]);

  // Save subscriptions to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `subscriptions-${user.id}`,
        JSON.stringify(subscribedNewsletters)
      );
    }
  }, [user, subscribedNewsletters]);

  const isSubscribed = (newsletterId: string) => {
    return subscribedNewsletters.includes(newsletterId);
  };

  const subscribe = (newsletterId: string) => {
    if (!isSubscribed(newsletterId)) {
      setSubscribedNewsletters(prev => [...prev, newsletterId]);
    }
  };

  const unsubscribe = (newsletterId: string) => {
    setSubscribedNewsletters(prev => 
      prev.filter(id => id !== newsletterId)
    );
  };

  return (
    <LibraryContext.Provider
      value={{
        subscribedNewsletters,
        isSubscribed,
        subscribe,
        unsubscribe
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}