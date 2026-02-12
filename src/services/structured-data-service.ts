// Structured Data Service for SEO
// Adds schema.org markup to improve search engine visibility

import { useEffect } from 'react';

// Define schema types
export interface OrganizationSchema {
  '@type': 'Organization';
  name: string;
  legalName?: string;
  url: string;
  logo?: string;
  foundingDate?: string;
  address?: {
    '@type': 'PostalAddress';
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry: string;
  };
  contactPoint?: {
    '@type': 'ContactPoint';
    telephone: string;
    contactType: string;
    areaServed?: string;
    availableLanguage?: string;
  }[];
  sameAs?: string[];
}

export interface ProductSchema {
  '@type': 'Product';
  name: string;
  description: string;
  brand?: {
    '@type': 'Brand';
    name: string;
  };
  offers: {
    '@type': 'Offer';
    price: string;
    priceCurrency: string;
    availability: string;
    seller: {
      '@type': 'Organization';
      name: string;
    };
  };
  aggregateRating?: {
    '@type': 'AggregateRating';
    ratingValue: string;
    reviewCount: string;
  };
}

export interface WebSiteSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction: {
    '@type': 'SearchAction';
    target: string;
    'query-input': string;
  };
}

export interface BreadcrumbListSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

export interface FAQPageSchema {
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
}

// Service class for managing structured data
class StructuredDataService {
  // Add schema to document head
  public addSchema(schema: any, id?: string) {
    // Remove existing schema if it exists
    if (id) {
      this.removeSchema(id);
    }
    
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id || `schema-${Date.now()}`;
    script.textContent = JSON.stringify(schema);
    
    document.head.appendChild(script);
  }
  
  // Remove schema from document head
  public removeSchema(id: string) {
    const existingSchema = document.getElementById(id);
    if (existingSchema) {
      existingSchema.remove();
    }
  }
  
  // Add organization schema
  public addOrganizationSchema(orgData: Partial<OrganizationSchema>) {
    const schema: OrganizationSchema = {
      '@type': 'Organization',
      name: orgData.name || 'CheatVault',
      url: orgData.url || 'https://cheatvault.io',
      ...orgData
    };
    
    this.addSchema(schema, 'organization-schema');
  }
  
  // Add website schema
  public addWebsiteSchema(siteData: Partial<WebSiteSchema>) {
    const schema: WebSiteSchema = {
      '@type': 'WebSite',
      name: siteData.name || 'CheatVault',
      url: siteData.url || 'https://cheatvault.io',
      potentialAction: {
        '@type': 'SearchAction',
        target: siteData.potentialAction?.target || 'https://cheatvault.io/search?q={search_term_string}',
        'query-input': 'required name=search_term_string'
      },
      ...siteData
    };
    
    this.addSchema(schema, 'website-schema');
  }
  
  // Add breadcrumb schema
  public addBreadcrumbSchema(breadcrumbs: BreadcrumbListSchema['itemListElement']) {
    const schema: BreadcrumbListSchema = {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs
    };
    
    this.addSchema(schema, 'breadcrumb-schema');
  }
  
  // Add product schema
  public addProductSchema(productData: Partial<ProductSchema>[]) {
    productData.forEach((product, index) => {
      const schema: ProductSchema = {
        '@type': 'Product',
        name: product.name || 'Gaming Tool',
        description: product.description || 'Premium gaming tools and cheats',
        offers: {
          '@type': 'Offer',
          price: product.offers?.price || '0.00',
          priceCurrency: product.offers?.priceCurrency || 'USD',
          availability: product.offers?.availability || 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'CheatVault'
          }
        },
        ...product
      };
      
      this.addSchema(schema, `product-schema-${index}`);
    });
  }
  
  // Add FAQ schema
  public addFAQSchema(faqData: FAQPageSchema['mainEntity']) {
    const schema: FAQPageSchema = {
      '@type': 'FAQPage',
      mainEntity: faqData
    };
    
    this.addSchema(schema, 'faq-schema');
  }
  
  // Clear all schemas
  public clearAllSchemas() {
    const schemas = document.querySelectorAll('script[type="application/ld+json"]');
    schemas.forEach(schema => {
      if (schema.id && schema.id.startsWith('schema-')) {
        schema.remove();
      }
    });
  }
}

// Create singleton instance
const structuredDataService = new StructuredDataService();

// React hook to add structured data
export const useStructuredData = (schema: any, id?: string) => {
  useEffect(() => {
    if (schema) {
      structuredDataService.addSchema(schema, id);
      
      return () => {
        if (id) {
          structuredDataService.removeSchema(id);
        }
      };
    }
  }, [schema, id]);
};

// React hook to add organization schema
export const useOrganizationSchema = (orgData: Partial<OrganizationSchema>) => {
  useEffect(() => {
    structuredDataService.addOrganizationSchema(orgData);
    
    return () => {
      structuredDataService.removeSchema('organization-schema');
    };
  }, [orgData]);
};

// React hook to add website schema
export const useWebsiteSchema = (siteData: Partial<WebSiteSchema>) => {
  useEffect(() => {
    structuredDataService.addWebsiteSchema(siteData);
    
    return () => {
      structuredDataService.removeSchema('website-schema');
    };
  }, [siteData]);
};

// React hook to add breadcrumb schema
export const useBreadcrumbSchema = (breadcrumbs: BreadcrumbListSchema['itemListElement']) => {
  useEffect(() => {
    structuredDataService.addBreadcrumbSchema(breadcrumbs);
    
    return () => {
      structuredDataService.removeSchema('breadcrumb-schema');
    };
  }, [breadcrumbs]);
};

export default structuredDataService;