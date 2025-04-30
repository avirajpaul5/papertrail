import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { Search, BookmarkX, Star } from 'lucide-react';
import NewsletterCard from '../components/newsletters/NewsletterCard';
import { newsletters, Newsletter } from '../data/newsletters';
import { useLibrary } from '../context/LibraryContext';
import { useFavorites } from '../context/FavoritesContext';

type ViewMode = 'subscribed' | 'favorites';

function Library() {
  const { subscribedNewsletters } = useLibrary();
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('subscribed');
  const [filteredNewsletters, setFilteredNewsletters] = useState<Newsletter[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);
  
  // Get user's newsletters based on view mode
  useEffect(() => {
    const userNewsletters = newsletters.filter(newsletter => 
      viewMode === 'subscribed' 
        ? subscribedNewsletters.includes(newsletter.id)
        : favorites.includes(newsletter.id)
    );
    setFilteredNewsletters(userNewsletters);
  }, [subscribedNewsletters, favorites, viewMode]);
  
  // Filter newsletters based on search query
  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const userNewsletters = newsletters.filter(newsletter => 
        (viewMode === 'subscribed' 
          ? subscribedNewsletters.includes(newsletter.id)
          : favorites.includes(newsletter.id)) &&
        (newsletter.title.toLowerCase().includes(query) || 
         newsletter.description.toLowerCase().includes(query) ||
         newsletter.author.toLowerCase().includes(query))
      );
      setFilteredNewsletters(userNewsletters);
    } else {
      const userNewsletters = newsletters.filter(newsletter => 
        viewMode === 'subscribed'
          ? subscribedNewsletters.includes(newsletter.id)
          : favorites.includes(newsletter.id)
      );
      setFilteredNewsletters(userNewsletters);
    }
  }, [searchQuery, subscribedNewsletters, favorites, viewMode]);
  
  // Animation effect on mount
  useEffect(() => {
    if (pageRef.current) {
      gsap.fromTo(
        pageRef.current.querySelector('h1'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
      
      gsap.fromTo(
        pageRef.current.querySelector('.controls-section'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, delay: 0.1, ease: 'power2.out' }
      );
      
      const newsletterCards = pageRef.current.querySelectorAll('.newsletter-card');
      if (newsletterCards.length > 0) {
        gsap.fromTo(
          newsletterCards,
          { opacity: 0, y: 20 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.4,
            stagger: 0.05,
            delay: 0.2,
            ease: 'power2.out'
          }
        );
      }
    }
  }, []);

  return (
    <div ref={pageRef} className="container-wide py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-semibold mb-8">Your Library</h1>
      
      {/* Controls */}
      <div className="controls-section flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={20} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search your newsletters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        
        <div className="flex rounded-md shadow-sm" role="group">
          <button
            className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
              viewMode === 'subscribed'
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setViewMode('subscribed')}
          >
            Subscribed
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-b border-r ${
              viewMode === 'favorites'
                ? 'bg-primary-50 text-primary-700 border-primary-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setViewMode('favorites')}
          >
            Favorites
          </button>
        </div>
      </div>
      
      {/* Newsletter grid */}
      {filteredNewsletters.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredNewsletters.map((newsletter) => (
            <div key={newsletter.id} className="newsletter-card h-full">
              <NewsletterCard newsletter={newsletter} />
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          {viewMode === 'subscribed' ? (
            <>
              <BookmarkX size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No subscribed newsletters yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't subscribed to any newsletters yet. Explore to find great newsletters to follow.
              </p>
            </>
          ) : (
            <>
              <Star size={48} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No favorite newsletters yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't added any newsletters to your favorites yet. Star newsletters you're interested in to save them for later.
              </p>
            </>
          )}
          <a href="/explore" className="btn btn-primary">
            Explore newsletters
          </a>
        </div>
      )}
    </div>
  );
}

export default Library;