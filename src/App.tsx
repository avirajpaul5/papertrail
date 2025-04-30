import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import gsap from 'gsap';

// Pages
import Landing from './pages/Landing';
import Explore from './pages/Explore';
import NewsletterPage from './pages/NewsletterPage';
import Library from './pages/Library';
import ReaderPage from './pages/ReaderPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

// Layouts
import MainLayout from './components/layout/MainLayout';
import ReaderLayout from './components/layout/ReaderLayout';

// Context
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Set up global GSAP animations
    gsap.config({
      nullTargetWarn: false
    });
    
    // Optional: Add any global animations here
  }, []);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Protected routes with main layout */}
      <Route element={<MainLayout />}>
        <Route path="/explore" element={<Explore />} />
        <Route path="/newsletters/:id" element={<NewsletterPage />} />
        <Route path="/library" element={<Library />} />
        <Route path="/admin" element={<Admin />} />
      </Route>
      
      {/* Reader layout */}
      <Route element={<ReaderLayout />}>
        <Route path="/read/:newsletterId/:issueId" element={<ReaderPage />} />
      </Route>

      {/* 404 catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;