import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import structuredDataService, { 
  useOrganizationSchema, 
  useWebsiteSchema 
} from '@/services/structured-data-service';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  breadcrumbs?: Array<{
    position: number;
    name: string;
    url?: string;
  }>;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'CheatVault - Premium Gaming Tools',
  description = 'Dominate with precision. Undetected, premium, and exclusive gaming tools from CheatVault.',
  keywords = ['gaming', 'cheats', 'premium tools', 'undetected'],
  canonicalUrl,
  ogImage = '/og-image.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  breadcrumbs
}) => {
  const location = useLocation();
  const fullCanonicalUrl = canonicalUrl || `${window.location.origin}${location.pathname}`;
  
  // Set organization schema
  useOrganizationSchema({
    name: 'CheatVault',
    legalName: 'CheatVault.io',
    url: 'https://cheatvault.io',
    logo: '/logo.png',
    description: 'Premium undetected gaming tools and cheats',
    foundingDate: '2023',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+1-555-CHEAT-VAULT',
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: 'English'
      }
    ],
    sameAs: [
      'https://twitter.com/cheatvault',
      'https://facebook.com/cheatvault',
      'https://instagram.com/cheatvault'
    ]
  });
  
  // Set website schema
  useWebsiteSchema({
    name: 'CheatVault',
    url: 'https://cheatvault.io',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://cheatvault.io/search?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  });

  // Update meta tags
  useEffect(() => {
    // Update title
    document.title = title;
    
    // Update or create description meta tag
    let descriptionMeta = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (!descriptionMeta) {
      descriptionMeta = document.createElement('meta');
      descriptionMeta.name = 'description';
      document.head.appendChild(descriptionMeta);
    }
    descriptionMeta.content = description;
    
    // Update or create keywords meta tag
    let keywordsMeta = document.querySelector('meta[name="keywords"]') as HTMLMetaElement;
    if (!keywordsMeta) {
      keywordsMeta = document.createElement('meta');
      keywordsMeta.name = 'keywords';
      document.head.appendChild(keywordsMeta);
    }
    keywordsMeta.content = keywords.join(', ');
    
    // Update or create canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = fullCanonicalUrl;
    
    // Open Graph tags
    const ogTags = [
      { property: 'og:title', content: title },
      { property: 'og:description', content: description },
      { property: 'og:url', content: fullCanonicalUrl },
      { property: 'og:image', content: ogImage },
      { property: 'og:type', content: ogType },
      { property: 'og:site_name', content: 'CheatVault' },
    ];
    
    ogTags.forEach(tag => {
      let ogMeta = document.querySelector(`meta[property="${tag.property}"]`) as HTMLMetaElement;
      if (!ogMeta) {
        ogMeta = document.createElement('meta');
        ogMeta.setAttribute('property', tag.property);
        document.head.appendChild(ogMeta);
      }
      ogMeta.content = tag.content;
    });
    
    // Twitter Card tags
    const twitterTags = [
      { name: 'twitter:card', content: twitterCard },
      { name: 'twitter:title', content: title },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: ogImage },
    ];
    
    twitterTags.forEach(tag => {
      let twitterMeta = document.querySelector(`meta[name="${tag.name}"]`) as HTMLMetaElement;
      if (!twitterMeta) {
        twitterMeta = document.createElement('meta');
        twitterMeta.name = tag.name;
        document.head.appendChild(twitterMeta);
      }
      twitterMeta.content = tag.content;
    });
    
    // Handle breadcrumbs if provided
    if (breadcrumbs && breadcrumbs.length > 0) {
      const breadcrumbSchema = breadcrumbs.map(breadcrumb => ({
        '@type': 'ListItem',
        position: breadcrumb.position,
        name: breadcrumb.name,
        ...(breadcrumb.url && { item: `${window.location.origin}${breadcrumb.url}` })
      }));
      
      structuredDataService.addBreadcrumbSchema(breadcrumbSchema);
    }
    
    // Cleanup function
    return () => {
      // Clean up breadcrumbs if they were added
      if (breadcrumbs && breadcrumbs.length > 0) {
        structuredDataService.removeSchema('breadcrumb-schema');
      }
    };
  }, [title, description, keywords, fullCanonicalUrl, ogImage, ogType, twitterCard, breadcrumbs]);
  
  return null; // This component doesn't render anything
};

export default SEOHead;