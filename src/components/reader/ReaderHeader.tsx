import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Bookmark, BookmarkCheck, Share2 } from 'lucide-react';
import gsap from 'gsap';
import { useLibrary } from '../../context/LibraryContext';
import { newsletters } from '../../data/newsletters';
import { getIssueById } from '../../data/issues';

function ReaderHeader() {
  const { newsletterId, issueId } = useParams();
  const navigate = useNavigate();
  const { isSubscribed, subscribe, unsubscribe } = useLibrary();
  const [newsletter, setNewsletter] = useState(newsletters.find(n => n.id === newsletterId));
  const [issue, setIssue] = useState(issueId ? getIssueById(issueId) : undefined);
  const [subscribed, setSubscribed] = useState(newsletterId ? isSubscribed(newsletterId) : false);
  const headerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setNewsletter(newsletters.find(n => n.id === newsletterId));
    setIssue(issueId ? getIssueById(issueId) : undefined);
    setSubscribed(newsletterId ? isSubscribed(newsletterId) : false);
  }, [newsletterId, issueId, isSubscribed]);

  useEffect(() => {
    // Animation for header appearance
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
    }

    // Set up scroll animation
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 50) {
          gsap.to(headerRef.current, { 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            backdropFilter: 'blur(8px)',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            duration: 0.3 
          });
        } else {
          gsap.to(headerRef.current, { 
            backgroundColor: 'rgba(255, 255, 255, 1)', 
            backdropFilter: 'blur(0px)',
            boxShadow: 'none',
            duration: 0.3 
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubscribeToggle = () => {
    if (!newsletterId) return;
    
    if (subscribed) {
      unsubscribe(newsletterId);
    } else {
      subscribe(newsletterId);
      
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

  const handleShare = () => {
    // Copy current URL to clipboard
    navigator.clipboard.writeText(window.location.href);
    
    // Show a tooltip or notification (not implemented here)
    alert('Link copied to clipboard');
  };

  return (
    <div 
      ref={headerRef}
      className="sticky top-0 z-10 bg-white py-3 px-4 flex items-center justify-between"
    >
      <div className="flex items-center">
        <button 
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors mr-2"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div>
          <h2 className="text-sm font-medium text-gray-900">
            {newsletter?.title || 'Loading...'}
          </h2>
          <p className="text-xs text-gray-500">
            {issue ? new Date(issue.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short', 
              day: 'numeric'
            }) : ''}
          </p>
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <button
          ref={buttonRef}
          onClick={handleSubscribeToggle}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label={subscribed ? "Unsubscribe" : "Subscribe"}
        >
          {subscribed ? (
            <BookmarkCheck className="w-5 h-5 text-primary-600" />
          ) : (
            <Bookmark className="w-5 h-5 text-gray-600" />
          )}
        </button>
        
        <button
          onClick={handleShare}
          className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
          aria-label="Share"
        >
          <Share2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default ReaderHeader;