import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Bell, Menu, X, LogOut, Send, BookOpen, RefreshCw } from 'lucide-react';
import gsap from 'gsap';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';

function Header() {
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  // Animation for header on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        if (window.scrollY > 10) {
          gsap.to(headerRef.current, { 
            backgroundColor: 'rgba(255, 255, 255, 0.95)', 
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            backdropFilter: 'blur(8px)',
            duration: 0.3 
          });
        } else {
          gsap.to(headerRef.current, { 
            backgroundColor: 'rgba(255, 255, 255, 1)', 
            boxShadow: 'none',
            backdropFilter: 'blur(0px)',
            duration: 0.3 
          });
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
    if (notificationsOpen) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'hidden';
    }
  };

  const closeNotifications = () => {
    setNotificationsOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header 
      ref={headerRef}
      className="bg-white px-4 py-4 sticky top-0 z-50 transition-all duration-300"
    >
      <div className="container max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/explore" className="text-2xl font-semibold text-primary-600 flex items-center">
          <Send className="mr-2 rotate-45" />
          <span>Papertrail</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <NavLink 
            to="/explore" 
            className={({ isActive }) => 
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            Explore
          </NavLink>
          <NavLink 
            to="/library" 
            className={({ isActive }) => 
              isActive ? 'nav-link-active' : 'nav-link'
            }
          >
            Your Library
          </NavLink>
        </nav>

        {/* User Actions */}
        <div className="flex items-center">
          {/* Notifications */}
          <button 
            onClick={toggleNotifications}
            className="relative p-2 text-gray-700 hover:text-primary-600 transition-colors duration-150 mr-2"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">{user?.name}</span>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors duration-150"
              aria-label="Log out"
            >
              <LogOut size={20} />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="p-2 text-gray-700 hover:text-primary-600 transition-colors duration-150 md:hidden"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white fixed inset-0 z-50 pt-16">
          <div className="p-4 flex flex-col space-y-4">
            <NavLink 
              to="/explore" 
              className={({ isActive }) => 
                isActive 
                  ? 'py-3 px-4 bg-primary-50 text-primary-600 rounded-md font-medium' 
                  : 'py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-md'
              }
              onClick={toggleMobileMenu}
            >
              <div className="flex items-center">
                <RefreshCw size={20} className="mr-3" />
                Explore
              </div>
            </NavLink>
            
            <NavLink 
              to="/library" 
              className={({ isActive }) => 
                isActive 
                  ? 'py-3 px-4 bg-primary-50 text-primary-600 rounded-md font-medium' 
                  : 'py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-md'
              }
              onClick={toggleMobileMenu}
            >
              <div className="flex items-center">
                <BookOpen size={20} className="mr-3" />
                Your Library
              </div>
            </NavLink>
            
            <button 
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className="py-3 px-4 text-gray-700 hover:bg-gray-50 rounded-md text-left"
            >
              <div className="flex items-center">
                <LogOut size={20} className="mr-3" />
                Log Out
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Notifications Dropdown */}
      <NotificationDropdown 
        isOpen={notificationsOpen} 
        onClose={closeNotifications} 
      />
    </header>
  );
}

export default Header;