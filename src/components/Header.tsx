import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import SimpleIcon from './SimpleIcon';
import ContactModal from './ContactModal';
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const location = useLocation();
  const { isLoggedIn } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleContactClick = () => {
    setContactModalOpen(true);
  };

  const navItems = [
    { name: 'Início', href: '/' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Serviços', href: '/servicos' },
    { name: 'Soluções', href: '/solucoes' },
    { name: 'Portfólio', href: '/portfolio' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contato', href: '/contato' }
  ];

  return (
    <header className="bg-background shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center text-brand-black font-bold text-xl">
            <SimpleIcon type="logo-full" className="h-8 mr-2" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-brand-black focus:outline-none"
            aria-label="Menu"
          >
            <SimpleIcon type="menu" className="h-6 w-6" />
          </button>

          {/* Navigation Links */}
          <nav
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } lg:flex lg:items-center lg:space-x-6`}
          >
            <ul className="flex flex-col lg:flex-row lg:space-x-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`text-brand-black hover:text-brand-gold transition-colors duration-300 ${
                      location.pathname === item.href ? 'font-semibold' : ''
                    }`}
                    onClick={closeMenu}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <div className="mt-4 lg:mt-0">
              <button
                onClick={handleContactClick}
                className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold py-2 px-4 rounded-md transition-colors duration-300"
              >
                Solicitar Orçamento
              </button>
            </div>
             {/* Admin Link */}
             {isLoggedIn && (
                <Link
                  to="/admin/dashboard"
                  className="text-brand-black hover:text-brand-gold transition-colors duration-300 ml-4"
                  onClick={closeMenu}
                >
                  Admin
                </Link>
              )}
          </nav>
        </div>
      </div>
      <ContactModal isOpen={contactModalOpen} onClose={() => setContactModalOpen(false)} />
    </header>
  );
};

export default Header;
