import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '@/services/analytics-service';

// Component to track page views automatically
const AnalyticsWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    analyticsService.trackPageView({
      pathname: location.pathname,
      search: location.search,
      title: document.title,
    });
  }, [location]);

  return <>{children}</>;
};

export default AnalyticsWrapper;