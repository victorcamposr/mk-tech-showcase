import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, ChevronDown } from "lucide-react";
import CriticalImage from "@/components/CriticalImage";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Sobre", path: "/sobre" },
    { label: "Serviços", path: "/servicos" },
    { label: "Soluções", path: "/solucoes" },
    { label: "Portfólio", path: "/portfolio" },
    { label: "Contato", path: "/contato" },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ease-out ${
      isScrolled 
        ? 'bg-brand-black/90 backdrop-blur-lg border-b border-brand-gold/30 shadow-2xl shadow-brand-gold/5' 
        : 'bg-brand-black/95 backdrop-blur-sm border-b border-brand-gold/20'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo with simple hover effect */}
          <Link to="/" className="flex items-center space-x-2 group">
            <CriticalImage 
              src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
              alt="MK Tecnologia" 
              className="h-10 w-auto transition-all duration-300 group-hover:scale-105"
              width={40}
              height={40}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive(item.path) 
                    ? "text-brand-gold bg-brand-gold/15" 
                    : "text-white hover:text-brand-gold hover:bg-white/10"
                }`}
              >
                {item.label}
                {/* Simple active indicator */}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-brand-gold rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* WhatsApp Button */}
          <div className="hidden md:block">
            <Button 
              asChild
              className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <a 
                href="https://wa.me/5565993535079" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-white hover:text-brand-gold transition-all duration-200 hover:bg-white/10"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 border-t border-brand-gold/20 bg-gradient-to-b from-transparent to-brand-black-light/20">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path) 
                      ? "text-brand-gold bg-brand-gold/15" 
                      : "text-white hover:text-brand-gold hover:bg-white/10"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <div className="w-2 h-2 bg-brand-gold rounded-full" />
                    )}
                  </div>
                </Link>
              ))}
              <div className="px-4 pt-2">
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold transition-all duration-200"
                >
                  <a 
                    href="https://wa.me/5565993535079" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 justify-center py-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;