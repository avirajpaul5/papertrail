import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TrendingUp, Sparkles } from 'lucide-react';
import NewsletterCard from './NewsletterCard';
import { useRecommendations } from '../../context/RecommendationsContext';

function RecommendationSection() {
  const { getRecommendedNewsletters, getTrendingNewsletters } = useRecommendations();
  const sectionRef = useRef<HTMLDivElement>(null);

  const recommendedNewsletters = getRecommendedNewsletters();
  const trendingNewsletters = getTrendingNewsletters();

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current.children,
        { opacity: 0, y: 20 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        }
      );
    }
  }, [recommendedNewsletters, trendingNewsletters]);

  if (recommendedNewsletters.length === 0 && trendingNewsletters.length === 0) {
    return null;
  }

  return (
    <div ref={sectionRef} className="space-y-12">
      {recommendedNewsletters.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="text-primary-600" size={24} />
            <h2 className="text-2xl font-semibold text-gray-900">
              Recommended for you
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="newsletter-card">
                <NewsletterCard newsletter={newsletter} />
              </div>
            ))}
          </div>
        </div>
      )}

      {trendingNewsletters.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-primary-600" size={24} />
            <h2 className="text-2xl font-semibold text-gray-900">
              Trending newsletters
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingNewsletters.map((newsletter) => (
              <div key={newsletter.id} className="newsletter-card">
                <NewsletterCard newsletter={newsletter} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default RecommendationSection;