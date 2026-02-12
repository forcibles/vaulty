// Analytics Service for CheatVault Launcher
// Handles tracking user interactions and engagement metrics

import CONFIG from '@/config/app-config';

// Define event types
export type AnalyticsEvent = {
  eventName: string;
  properties?: Record<string, any>;
  timestamp?: Date;
};

// Define page view type
export type PageView = {
  pathname: string;
  search?: string;
  title?: string;
};

// Analytics service class
class AnalyticsService {
  private isEnabled: boolean;
  private gaMeasurementId?: string;
  
  constructor() {
    this.isEnabled = CONFIG.APP_CONFIG.ENABLE_ANALYTICS && !!CONFIG.SERVICE_CONFIG.GA_MEASUREMENT_ID;
    this.gaMeasurementId = CONFIG.SERVICE_CONFIG.GA_MEASUREMENT_ID;
    
    if (this.isEnabled && this.gaMeasurementId) {
      this.loadGoogleAnalytics();
    }
  }
  
  // Load Google Analytics script
  private loadGoogleAnalytics = () => {
    // Create and append GA script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.gaMeasurementId}`;
    document.head.appendChild(script);
    
    // Initialize gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    function gtag(...args: any[]) {
      (window as any).dataLayer.push(args);
    }
    (window as any).gtag = gtag;
    
    gtag('js', new Date());
    gtag('config', this.gaMeasurementId, {
      page_path: window.location.pathname,
    });
  };
  
  // Track custom events
  public trackEvent = (event: AnalyticsEvent) => {
    if (!this.isEnabled) {
      if (CONFIG.APP_CONFIG.ENABLE_DEBUG_LOGS) {
        console.log('[Analytics Debug]', event.eventName, event.properties);
      }
      return;
    }
    
    // Send to Google Analytics
    if (this.gaMeasurementId) {
      (window as any).gtag('event', event.eventName, {
        ...event.properties,
        event_category: 'engagement',
        event_label: event.eventName,
        value: event.properties?.value || undefined,
      });
    }
    
    // Log for debugging
    if (CONFIG.APP_CONFIG.ENABLE_DEBUG_LOGS) {
      console.log('[Analytics Event]', event.eventName, event.properties);
    }
  };
  
  // Track page views
  public trackPageView = (pageView: PageView) => {
    if (!this.isEnabled) {
      if (CONFIG.APP_CONFIG.ENABLE_DEBUG_LOGS) {
        console.log('[Analytics Debug Page View]', pageView);
      }
      return;
    }
    
    // Send to Google Analytics
    if (this.gaMeasurementId) {
      (window as any).gtag('config', this.gaMeasurementId, {
        page_title: pageView.title || document.title,
        page_location: window.location.href,
        page_path: pageView.pathname + (pageView.search || ''),
      });
    }
    
    // Log for debugging
    if (CONFIG.APP_CONFIG.ENABLE_DEBUG_LOGS) {
      console.log('[Analytics Page View]', pageView);
    }
  };
  
  // Track purchase events
  public trackPurchase = (transactionId: string, value: number, currency: string = 'USD', items: any[] = []) => {
    if (!this.isEnabled) {
      if (CONFIG.APP_CONFIG.ENABLE_DEBUG_LOGS) {
        console.log('[Analytics Debug Purchase]', { transactionId, value, currency, items });
      }
      return;
    }
    
    if (this.gaMeasurementId) {
      (window as any).gtag('event', 'purchase', {
        transaction_id: transactionId,
        value: value,
        currency: currency,
        items: items,
      });
    }
    
    if (CONFIG.APP_CONFIG.ENABLE_DEBUG_LOGS) {
      console.log('[Analytics Purchase]', { transactionId, value, currency, items });
    }
  };
  
  // Track form submissions
  public trackFormSubmission = (formName: string, success: boolean, properties?: Record<string, any>) => {
    this.trackEvent({
      eventName: success ? 'form_submit_success' : 'form_submit_failure',
      properties: {
        form_name: formName,
        ...properties,
      },
    });
  };
  
  // Track video interactions
  public trackVideoInteraction = (videoId: string, action: 'play' | 'pause' | 'complete', currentTime?: number) => {
    this.trackEvent({
      eventName: `video_${action}`,
      properties: {
        video_id: videoId,
        current_time: currentTime,
      },
    });
  };
  
  // Track user engagement
  public trackEngagement = (engagementType: string, properties?: Record<string, any>) => {
    this.trackEvent({
      eventName: 'engagement',
      properties: {
        engagement_type: engagementType,
        ...properties,
      },
    });
  };
  
  // Track outbound clicks
  public trackOutboundClick = (url: string, linkText?: string) => {
    this.trackEvent({
      eventName: 'outbound_click',
      properties: {
        link_url: url,
        link_text: linkText,
      },
    });
  };
  
  // Track error events
  public trackError = (error: Error, fatal: boolean = false) => {
    this.trackEvent({
      eventName: 'exception',
      properties: {
        description: error.message,
        fatal: fatal,
      },
    });
  };
}

// Create singleton instance
const analyticsService = new AnalyticsService();

export default analyticsService;