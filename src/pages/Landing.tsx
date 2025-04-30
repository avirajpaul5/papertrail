import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Send, Bookmark, BookOpen, Bell } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/explore');
      return;
    }
    
    // Hero animations
    if (heroRef.current) {
      const tl = gsap.timeline();
      
      tl.fromTo(
        heroRef.current.querySelector('h1'),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      )
      .fromTo(
        heroRef.current.querySelector('p'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=0.6'
      )
      .fromTo(
        heroRef.current.querySelectorAll('a'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
        '-=0.6'
      );
    }
    
    // Features animations (on scroll)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && featuresRef.current) {
            gsap.fromTo(
              featuresRef.current.querySelectorAll('.feature-card'),
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
            );
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    
    return () => observer.disconnect();
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white py-4 border-b border-gray-100">
        <div className="container max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center">
            <Send className="text-primary-600 mr-2 rotate-45" size={24} />
            <span className="text-xl font-semibold text-gray-900">Papertrail</span>
          </div>
          
          <div className="space-x-2">
            <Link to="/login" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
              Log in
            </Link>
            <Link to="/signup" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </header>
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="py-16 md:py-24 px-4 bg-white flex-grow"
      >
        <div className="container max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 mb-6">
              Your newsletters, beautifully organized
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Subscribe to the best newsletters without filling your inbox. Read when you want, how you want.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup" className="btn btn-primary text-base px-8 py-3">
                Get started
              </Link>
              <Link to="/explore" className="btn btn-outline text-base px-8 py-3">
                Explore newsletters
              </Link>
            </div>
          </div>
          
          {/* Featured newsletters */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <img 
                src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=500" 
                alt="Tech newsletter" 
                className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Technology</h3>
              <p className="text-gray-600 text-sm">The latest in tech, AI, and the future of work</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <img 
                src="https://images.pexels.com/photos/5186869/pexels-photo-5186869.jpeg?auto=compress&cs=tinysrgb&w=500" 
                alt="Business newsletter" 
                className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Business</h3>
              <p className="text-gray-600 text-sm">Market trends, startups, and business strategy</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <img 
                src="https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=500" 
                alt="Productivity newsletter" 
                className="w-20 h-20 object-cover rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Productivity</h3>
              <p className="text-gray-600 text-sm">Tools and ideas to work smarter, not harder</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section 
        ref={featuresRef}
        className="py-16 md:py-24 px-4 bg-gray-50"
      >
        <div className="container max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-gray-900 mb-16">
            A better way to enjoy newsletters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="feature-card bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Send className="text-primary-600 rotate-45" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Discover newsletters</h3>
              <p className="text-gray-600">
                Explore a curated collection of the best newsletters across various topics.
              </p>
            </div>
            
            <div className="feature-card bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Bookmark className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Subscribe effortlessly</h3>
              <p className="text-gray-600">
                One-click subscription without giving your email or cluttering your inbox.
              </p>
            </div>
            
            <div className="feature-card bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Read on your terms</h3>
              <p className="text-gray-600">
                Beautiful reading experience optimized for focus and enjoyment.
              </p>
            </div>
            
            <div className="feature-card bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Bell className="text-primary-600" size={24} />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Get notified</h3>
              <p className="text-gray-600">
                Receive notifications for new issues from your favorite newsletters.
              </p>
            </div>
            
            <div className="feature-card bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-accent-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-600">
                  <path d="M15 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V18C20 18.5304 19.7893 19.0391 19.4142 19.4142C19.0391 19.7893 18.5304 20 18 20H6C5.46957 20 4.96086 19.7893 4.58579 19.4142C4.21071 19.0391 4 18.5304 4 18V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 16V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 11L12 8L15 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Save for later</h3>
              <p className="text-gray-600">
                Bookmark interesting issues to revisit when you have more time.
              </p>
            </div>
            
            <div className="feature-card bg-white p-6 rounded-lg shadow-sm">
              <div className="bg-accent-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent-600">
                  <path d="M18 8L22 12L18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M2 12L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Share insights</h3>
              <p className="text-gray-600">
                Easily share interesting newsletters and issues with friends and colleagues.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 px-4 bg-primary-600 text-white text-center">
        <div className="container max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to transform your newsletter experience?
          </h2>
          <p className="text-xl opacity-90 mb-8 leading-relaxed">
            Join thousands of readers who've upgraded how they discover and consume newsletters.
          </p>
          <Link to="/signup" className="inline-block bg-white text-primary-700 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
            Get started now
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center">
                <Send className="mr-2 rotate-45" />
                <span className="text-xl font-semibold">Papertrail</span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">
                Your newsletters, beautifully organized.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-medium mb-3">Product</h3>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">Features</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">Pricing</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">FAQ</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Company</h3>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">About</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">Blog</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">Careers</Link></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium mb-3">Legal</h3>
                <ul className="space-y-2">
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">Privacy</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">Terms</Link></li>
                  <li><Link to="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</Link></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800 text-center md:text-left text-sm text-gray-400">
            <p>© 2023 Papertrail. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;