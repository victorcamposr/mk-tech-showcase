import { useEffect } from 'react';

interface AccessibilityHelperProps {
  children: React.ReactNode;
}

const AccessibilityHelper = ({ children }: AccessibilityHelperProps) => {
  useEffect(() => {
    // Add skip navigation link
    const addSkipLink = () => {
      if (document.querySelector('#skip-navigation')) return;
      
      const skipLink = document.createElement('a');
      skipLink.id = 'skip-navigation';
      skipLink.href = '#main-content';
      skipLink.textContent = 'Pular para o conteúdo principal';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #F59E0B;
        color: #1F2937;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
        transition: top 0.3s;
        font-weight: bold;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    };

    // Improve focus management
    const improveFocus = () => {
      // Add focus styles for keyboard navigation
      const style = document.createElement('style');
      style.textContent = `
        .focus\\:outline-none:focus-visible {
          outline: 2px solid #F59E0B !important;
          outline-offset: 2px !important;
        }
        
        button:focus-visible,
        a:focus-visible,
        input:focus-visible,
        textarea:focus-visible,
        select:focus-visible {
          outline: 2px solid #F59E0B !important;
          outline-offset: 2px !important;
        }
      `;
      document.head.appendChild(style);
    };

    // Add language attribute improvements
    const improveLanguage = () => {
      if (!document.documentElement.lang) {
        document.documentElement.lang = 'pt-BR';
      }
    };

    // Add ARIA landmarks if missing
    const addLandmarks = () => {
      const main = document.querySelector('main');
      if (main && !main.getAttribute('role')) {
        main.setAttribute('role', 'main');
        main.id = 'main-content';
      }
    };

    addSkipLink();
    improveFocus();
    improveLanguage();
    
    // Delay landmarks to ensure DOM is ready
    setTimeout(addLandmarks, 100);

  }, []);

  return <>{children}</>;
};

export default AccessibilityHelper;