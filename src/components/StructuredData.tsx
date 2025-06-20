import { useEffect } from 'react';

interface BusinessSchema {
  name: string;
  description: string;
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  telephone: string;
  email: string;
  url: string;
  image?: string;
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
  priceRange?: string;
  areaServed?: string[];
}

interface StructuredDataProps {
  type: 'business' | 'organization' | 'localBusiness' | 'article' | 'breadcrumb' | 'website' | 'service';
  data?: any;
}

const StructuredData = ({ type, data }: StructuredDataProps) => {
  useEffect(() => {
    const createSchema = () => {
      let schema: any = {};

      switch (type) {
        case 'business':
        case 'localBusiness':
          schema = {
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "name": "MK Tecnologia",
            "description": "Especialistas em automação comercial, sistemas PDV, controle de estoque e emissão fiscal em Pontes e Lacerda, Mato Grosso. Soluções tecnológicas completas para empresas de todos os segmentos.",
            "image": "/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png",
            "telephone": "+5565993535079",
            "email": "mktecnologiaoficial@gmail.com",
            "url": window.location.origin,
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Av Marechal Rondon, 1512",
              "addressLocality": "Pontes e Lacerda",
              "addressRegion": "MT",
              "postalCode": "78250-000",
              "addressCountry": "BR"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": -15.2261,
              "longitude": -59.3358
            },
            "openingHours": [
              "Mo-Fr 08:00-18:00",
              "Sa 08:00-12:00"
            ],
            "priceRange": "$$",
            "areaServed": [
              "Pontes e Lacerda",
              "Vila Bela da Santíssima Trindade", 
              "Comodoro",
              "Mato Grosso"
            ],
            "serviceType": [
              "Automação Comercial",
              "Sistema PDV",
              "Controle de Estoque",
              "Emissão Fiscal",
              "Suporte Técnico"
            ],
            "sameAs": [
              "https://wa.me/5565993535079",
              "https://instagram.com/mktecnologiaoficial"
            ]
          };
          break;

        case 'organization':
          schema = {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "MK Tecnologia",
            "url": window.location.origin,
            "logo": "/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png",
            "description": "Especialistas em automação comercial e soluções tecnológicas empresariais",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+5565993535079",
              "contactType": "customer service",
              "availableLanguage": "Portuguese",
              "areaServed": "BR"
            },
            "sameAs": [
              "https://wa.me/5565993535079",
              "https://instagram.com/mktecnologiaoficial"
            ]
          };
          break;

        case 'breadcrumb':
          if (data && data.items) {
            schema = {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": data.items.map((item: any, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "name": item.name,
                "item": item.url
              }))
            };
          }
          break;

        case 'website':
          schema = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "MK Tecnologia",
            "url": window.location.origin,
            "description": "Site oficial da MK Tecnologia - Especialistas em automação comercial em Pontes e Lacerda, MT",
            "publisher": {
              "@type": "Organization",
              "name": "MK Tecnologia"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${window.location.origin}/search?q={search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          };
          break;

        case 'service':
          schema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Automação Comercial",
            "description": "Serviços completos de automação comercial, sistemas PDV, controle de estoque e emissão fiscal para empresas",
            "provider": {
              "@type": "Organization",
              "name": "MK Tecnologia",
              "url": window.location.origin
            },
            "areaServed": {
              "@type": "State",
              "name": "Mato Grosso"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Serviços de Tecnologia",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Sistema PDV",
                    "description": "Ponto de venda completo para sua empresa"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Controle de Estoque",
                    "description": "Gestão inteligente de estoque com alertas automáticos"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Emissão Fiscal",
                    "description": "NFe, NFCe e cupons fiscais automatizados"
                  }
                }
              ]
            }
          };
          break;

        default:
          return;
      }

      // Remove existing schema of the same type
      const existingScript = document.querySelector(`script[data-schema-type="${type}"]`);
      if (existingScript) {
        existingScript.remove();
      }

      // Add new schema
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema-type', type);
      script.textContent = JSON.stringify(schema);
      document.head.appendChild(script);
    };

    createSchema();

    // Cleanup on unmount
    return () => {
      const script = document.querySelector(`script[data-schema-type="${type}"]`);
      if (script) {
        script.remove();
      }
    };
  }, [type, data]);

  return null;
};

export default StructuredData;