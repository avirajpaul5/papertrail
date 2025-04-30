import { Link } from 'react-router-dom';
import { Send, Github, Twitter, Linkedin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Logo & Tagline */}
          <div className="mb-6 md:mb-0 flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center text-xl font-semibold text-primary-600 mb-2">
              <Send className="mr-2 rotate-45" />
              <span>Papertrail</span>
            </Link>
            <p className="text-gray-600 text-sm">Curated newsletters, no inbox clutter.</p>
          </div>
          
          {/* Links */}
          <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-12">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Platform</h4>
              <ul className="space-y-2">
                <li><Link to="/explore" className="text-gray-600 hover:text-primary-600 text-sm">Explore</Link></li>
                <li><Link to="/library" className="text-gray-600 hover:text-primary-600 text-sm">Library</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">About</Link></li>
                <li><Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">Privacy</Link></li>
                <li><Link to="/" className="text-gray-600 hover:text-primary-600 text-sm">Terms</Link></li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">© 2023 Papertrail. All rights reserved.</p>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-gray-600" aria-label="GitHub">
              <Github size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-600" aria-label="LinkedIn">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;