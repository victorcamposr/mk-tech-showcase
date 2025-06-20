import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  // Scroll to top on route changes (only for different base paths)
  useEffect(() => {
    const currentBasePath = pathname.split('/')[1] || '';
    const previousBasePath = useRef('');
    
    // Only scroll to top if we're navigating to a different base path
    if (currentBasePath !== previousBasePath.current) {
      window.scrollTo(0, 0);
      previousBasePath.current = currentBasePath;
    }
  }, [pathname]);

  // Scroll to top on component mount (page refresh)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
};

export default ScrollToTop;