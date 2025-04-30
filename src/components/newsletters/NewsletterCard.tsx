import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, BookmarkCheck, Star } from 'lucide-react';
import gsap from 'gsap';
import { Newsletter } from '../../data/newsletters';
import { useLibrary } from '../../context/LibraryContext';
import { useFavorites } from '../../context/FavoritesContext';

interface NewsletterCardProps {
  newsletter: Newsletter;
}

function NewsletterCard({ newsletter }: NewsletterCardProps) {
  const { isSubscribed, subscribe, unsubscribe } = useLibrary();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [subscribed, setSubscribed] = useState(isSubscribed(newsletter.id));
  const [favorite, setFavorite] = useState(isFavorite(newsletter.id));
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const favoriteButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSubscribed(isSubscribed(newsletter.id));
    setFavorite(isFavorite(newsletter.id));
  }, [isSubscribed, isFavorite, newsletter.id]);

  const handleSubscribeToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (subscribed) {
      unsubscribe(newsletter.id);
    } else {
      subscribe(newsletter.id);
      
      // Animation for subscribe action
      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { scale: 1 },
          { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
        );
      }
    }
    
    setSubscribed(!subscribed);
  };

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleFavorite(newsletter.id);
    setFavorite(!favorite);

    // Animation for favorite action
    if (favoriteButtonRef.current) {
      gsap.fromTo(
        favoriteButtonRef.current,
        { scale: 1 },
        { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 }
      );
    }
  };

  return (
    <div 
      ref={cardRef}
      className="card h-full flex flex-col bg-white transition-all duration-300"
    >
      <Link to={`/newsletters/${newsletter.id}`} className="block flex-grow">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={newsletter.imageUrl} 
            alt={newsletter.title} 
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-70"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <span className="px-2 py-1 text-xs font-medium bg-primary-600 rounded">
              {newsletter.category}
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg text-gray-900">{newsletter.title}</h3>
            <div className="flex space-x-2">
              <button
                ref={favoriteButtonRef}
                onClick={handleFavoriteToggle}
                className="text-gray-400 hover:text-yellow-500 transition-colors p-1"
                aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star 
                  className={`w-5 h-5 ${favorite ? 'text-yellow-500 fill-yellow-500' : ''}`} 
                />
              </button>
              <button
                ref={buttonRef}
                onClick={handleSubscribeToggle}
                className="text-gray-400 hover:text-primary-600 transition-colors p-1"
                aria-label={subscribed ? "Unsubscribe" : "Subscribe"}
              >
                {subscribed ? (
                  <BookmarkCheck className="w-5 h-5 text-primary-600" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500 mb-3">By {newsletter.author}</p>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {newsletter.description}
          </p>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{newsletter.subscriberCount.toLocaleString()} subscribers</span>
            <span>{newsletter.frequency}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default NewsletterCard;