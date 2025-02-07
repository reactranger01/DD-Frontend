import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Add smooth behavior
    });
  }, [location.pathname]);

  return null;
};

export default ScrollToTop;
