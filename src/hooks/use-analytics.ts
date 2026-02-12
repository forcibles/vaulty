import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import analyticsService from '@/services/analytics-service';

// Custom hook for analytics
export const useAnalytics = () => {
  // Track page views automatically
  const location = useLocation();
  
  useEffect(() => {
    analyticsService.trackPageView({
      pathname: location.pathname,
      search: location.search,
      title: document.title,
    });
  }, [location]);

  return {
    trackEvent: analyticsService.trackEvent,
    trackPurchase: analyticsService.trackPurchase,
    trackFormSubmission: analyticsService.trackFormSubmission,
    trackVideoInteraction: analyticsService.trackVideoInteraction,
    trackEngagement: analyticsService.trackEngagement,
    trackOutboundClick: analyticsService.trackOutboundClick,
    trackError: analyticsService.trackError,
  };
};

// Hook to track specific component interactions
export const useTrackComponentView = (componentName: string, properties?: Record<string, any>) => {
  useEffect(() => {
    analyticsService.trackEvent({
      eventName: 'component_view',
      properties: {
        component_name: componentName,
        ...properties,
      },
    });
  }, [componentName, properties]);
};

// Hook to track button clicks
export const useTrackButtonClick = (buttonName: string, properties?: Record<string, any>) => {
  const handleClick = () => {
    analyticsService.trackEvent({
      eventName: 'button_click',
      properties: {
        button_name: buttonName,
        ...properties,
      },
    });
  };

  return handleClick;
};