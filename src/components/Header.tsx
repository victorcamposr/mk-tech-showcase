
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, FileText } from "lucide-react";
import SimpleIcon from "./SimpleIcon";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
              alt="MK Tecnologia Logo" 
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
            >
              Início
            </Link>
            <Link 
              to="/sobre" 
              className={`${isActive('/sobre') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
            >
              Sobre
            </Link>
            <Link 
              to="/servicos" 
              className={`${isActive('/servicos') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
            >
              Serviços
            </Link>
            <Link 
              to="/solucoes" 
              className={`${isActive('/solucoes') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
            >
              Soluções
            </Link>
            <Link 
              to="/portfolio" 
              className={`${isActive('/portfolio') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
            >
              Portfólio
            </Link>
            <Link 
              to="/blog" 
              className={`${isActive('/blog') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
            >
              Blog
            </Link>
            <Link 
              to="/contato" 
              className={`${isActive('/contato') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
            >
              Contato
            </Link>
          </nav>

          {/* Cadastro Fiscal Button */}
          <div className="hidden md:flex items-center">
            <Link 
              to="/cadastro-fiscal" 
              className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Cadastro Fiscal
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className={`${isActive('/') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Início
              </Link>
              <Link 
                to="/sobre" 
                className={`${isActive('/sobre') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              <Link 
                to="/servicos" 
                className={`${isActive('/servicos') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link 
                to="/solucoes" 
                className={`${isActive('/solucoes') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Soluções
              </Link>
              <Link 
                to="/portfolio" 
                className={`${isActive('/portfolio') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Portfólio
              </Link>
              <Link 
                to="/blog" 
                className={`${isActive('/blog') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link 
                to="/contato" 
                className={`${isActive('/contato') ? 'text-brand-gold' : 'text-gray-700'} hover:text-brand-gold transition-colors font-medium`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </Link>
              <Link 
                to="/cadastro-fiscal" 
                className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg flex items-center gap-2 w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="w-5 h-5" />
                Cadastro Fiscal
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
