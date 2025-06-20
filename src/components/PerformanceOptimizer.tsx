import { useEffect } from 'react';

const PerformanceOptimizer = () => {
  useEffect(() => {
    // Preload critical resources
    const preloadCriticalResources = () => {
      // Preload critical images
      const criticalImages = [
        '/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png',
        '/lovable-uploads/d6914ab3-880e-46c2-b690-6f9ff01daa65.png'
      ];
      
      criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
      });
    };

    // Optimize images loading
    const optimizeImages = () => {
      const images = document.querySelectorAll('img[loading="lazy"]');
      
      if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
              }
            }
          });
        });

        images.forEach((img) => imageObserver.observe(img));
      }
    };

    // Minimize layout shifts
    const minimizeLayoutShifts = () => {
      // Add CSS to prevent layout shifts
      const style = document.createElement('style');
      style.textContent = `
        img {
          max-width: 100%;
          height: auto;
        }
        
        .content-container {
          min-height: 1px;
        }
        
        /* Smooth animations for better performance */
        * {
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
      `;
      document.head.appendChild(style);
    };

    // Prefetch important pages
    const prefetchPages = () => {
      const importantPages = ['/servicos', '/contato', '/portfolio'];
      
      importantPages.forEach((page) => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = page;
        document.head.appendChild(link);
      });
    };

    // Service Worker registration for caching
    const registerServiceWorker = () => {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
              console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
              console.log('SW registration failed: ', registrationError);
            });
        });
      }
    };

    // Initialize optimizations
    optimizeImages();
    minimizeLayoutShifts();
    prefetchPages();
    
    // Delay non-critical optimizations
    setTimeout(() => {
      preloadCriticalResources();
    }, 100);

  }, []);

  return null;
};

export default PerformanceOptimizer;