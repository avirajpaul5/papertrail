import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { useAuth } from '../../context/AuthContext';

function MainLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const mainRef = useRef<HTMLDivElement>(null);

  // Animation effect on route change
  useEffect(() => {
    if (mainRef.current) {
      gsap.fromTo(
        mainRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  }, [location.pathname]);

  // Authentication check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main ref={mainRef} className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;