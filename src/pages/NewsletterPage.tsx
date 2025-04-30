import { useEffect, useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Calendar, Globe, Users, Clock, ArrowRight, Bookmark, BookmarkCheck } from 'lucide-react';
import Button from '../components/common/Button';
import IssueCard from '../components/newsletters/IssueCard';
import { Newsletter, getNewsletterBySlug } from '../data/newsletters';
import { getIssuesByNewsletterId, Issue } from '../data/issues';
import { useLibrary } from '../context/LibraryContext';

function NewsletterPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [newsletter, setNewsletter] = useState<Newsletter | undefined>();
  const [issues, setIssues] = useState<Issue[]>([]);
  const { isSubscribed, subscribe, unsubscribe } = useLibrary();
  const [subscribed, setSubscribed] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    async function loadNewsletter() {
      if (slug) {
        const foundNewsletter = await getNewsletterBySlug(slug);
        if (!foundNewsletter) {
          navigate('/404');
          return;
        }
        
        setNewsletter(foundNewsletter);
        setSubscribed(isSubscribed(foundNewsletter.id));
        
        // Only fetch issues if we have a valid newsletter with UUID
        const fetchedIssues = await getIssuesByNewsletterId(foundNewsletter.id);
        setIssues(fetchedIssues);
        
        // Animation sequence
        if (pageRef.current) {
          const tl = gsap.timeline();
          
          tl.fromTo(
            pageRef.current.querySelector('.hero-section'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
          )
          .fromTo(
            pageRef.current.querySelector('.issues-section'),
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
            '-=0.2'
          );
        }
      }
    }
    
    loadNewsletter();
  }, [slug, isSubscribed, navigate]);

  const handleSubscribeToggle = () => {
    if (!newsletter) return;
    
    if (subscribed) {
      unsubscribe(newsletter.id);
    } else {
      subscribe(newsletter.id);
      
      // Animation for subscribe action
      if (buttonRef.current) {
        gsap.fromTo(
          buttonRef.current,
          { scale: 1 },
          { scale: 1.1, duration: 0.2, yoyo: true, repeat: 1 }
        );
      }
    }
    
    setSubscribed(!subscribed);
  };

  if (!newsletter) {
    return (
      <div className="container-wide py-12 text-center">
        <p>Newsletter not found.</p>
      </div>
    );
  }

  return (
    <div ref={pageRef} className="container-wide py-8 md:py-12">
      {/* Hero Section */}
      <div className="hero-section mb-12">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="aspect-[3/1] relative">
            <img 
              src={newsletter.imageUrl} 
              alt={newsletter.title} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <span className="px-2 py-1 text-xs font-medium bg-primary-600 rounded mb-3 inline-block">
                {newsletter.category}
              </span>
              <h1 className="text-3xl md:text-4xl font-semibold mb-2">{newsletter.title}</h1>
              <p className="text-lg text-white/90 mb-4">By {newsletter.author}</p>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap gap-6 mb-8">
              <div className="flex items-center text-gray-600">
                <Calendar size={18} className="mr-2" />
                <span>{newsletter.frequency}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Users size={18} className="mr-2" />
                <span>{newsletter.subscriberCount.toLocaleString()} subscribers</span>
              </div>
              {newsletter.website && (
                <div className="flex items-center text-gray-600">
                  <Globe size={18} className="mr-2" />
                  <a 
                    href={newsletter.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:underline"
                  >
                    Visit website
                  </a>
                </div>
              )}
            </div>
            
            <h2 className="text-xl font-medium mb-4">About this newsletter</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {newsletter.description}
            </p>
            
            <button
              ref={buttonRef}
              onClick={handleSubscribeToggle}
              className={`px-6 py-3 rounded-md font-medium flex items-center ${
                subscribed 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-primary-600 text-white hover:bg-primary-700'
              }`}
            >
              {subscribed ? (
                <>
                  <BookmarkCheck className="mr-2" />
                  Subscribed
                </>
              ) : (
                <>
                  <Bookmark className="mr-2" />
                  Subscribe
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Issues Section */}
      <div className="issues-section">
        <h2 className="text-2xl font-semibold mb-6">Latest Issues</h2>
        
        {issues.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map((issue, index) => (
              <IssueCard 
                key={issue.id} 
                issue={issue}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center">
            <p className="text-gray-500">No issues available yet.</p>
          </div>
        )}
        
        {issues.length > 0 && subscribed && (
          <div className="mt-8 text-center">
            <Link 
              to={`/read/${newsletter.id}/${issues[0].id}`}
              className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center"
            >
              Start reading the latest issue <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsletterPage;