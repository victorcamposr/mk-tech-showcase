import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
}

const SEO = ({ 
  title, 
  description, 
  keywords = "automação comercial, sistema PDV, controle estoque, emissão fiscal, Pontes e Lacerda, MT, tecnologia empresarial",
  image = "/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png",
  url = window.location.href,
  type = "website",
  noindex = false
}: SEOProps) => {
  useEffect(() => {
    // Update document title
    document.title = `${title} | MK Tecnologia`;
    
    // Update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', property);
        } else {
          element.setAttribute('name', property);
        }
        document.head.appendChild(element);
      }
      element.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Open Graph tags
    updateMetaTag('og:title', `${title} | MK Tecnologia`, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:type', type, true);
    updateMetaTag('og:site_name', 'MK Tecnologia', true);
    updateMetaTag('og:locale', 'pt_BR', true);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', `${title} | MK Tecnologia`);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    
    // Robots meta tag
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow');
    
    // Additional SEO tags
    updateMetaTag('author', 'MK Tecnologia');
    updateMetaTag('viewport', 'width=device-width, initial-scale=1');
    updateMetaTag('theme-color', '#F59E0B'); // brand-gold color
    
  }, [title, description, keywords, image, url, type, noindex]);

  return null;
};

export default SEO;