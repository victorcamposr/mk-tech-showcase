import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, Sparkles, Zap } from "lucide-react";
import CriticalImage from "@/components/CriticalImage";

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
    <header className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? 'bg-gradient-to-r from-brand-black via-brand-black to-brand-black-light backdrop-blur-xl border-b border-brand-gold/40 shadow-2xl shadow-brand-gold/10' 
        : 'bg-gradient-to-r from-brand-black to-brand-black-light border-b border-brand-gold/30'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo with advanced hover effect */}
          <Link to="/" className="flex items-center space-x-3 group relative">
            <div className="relative">
              <CriticalImage 
                src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
                alt="MK Tecnologia" 
                className="h-12 w-auto transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                width={48}
                height={48}
              />
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-sm"></div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
              <span className="text-brand-gold text-sm font-semibold">Tech</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {menuItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                  isActive(item.path) 
                    ? "text-brand-black bg-gradient-to-r from-brand-gold to-brand-gold-light shadow-lg shadow-brand-gold/30" 
                    : "text-white hover:text-brand-gold hover:bg-gradient-to-r hover:from-white/10 hover:to-brand-gold/10 hover:backdrop-blur-sm"
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {item.label}
                  {isActive(item.path) && <Zap className="w-3 h-3 animate-pulse" />}
                </span>
                {/* Advanced hover effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                {/* Active indicator */}
                {isActive(item.path) && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                )}
              </Link>
            ))}
          </nav>

          {/* WhatsApp Button */}
          <div className="hidden md:block">
            <Button 
              asChild
              className="bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold hover:from-brand-gold-dark hover:via-brand-gold hover:to-brand-gold-light text-brand-black font-bold transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-3xl shadow-brand-gold/30 hover:shadow-brand-gold/50 border border-brand-gold/20 relative overflow-hidden group"
            >
              <a 
                href="https://wa.me/5565993535079" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 relative z-10"
              >
                <MessageCircle className="h-5 w-5 group-hover:animate-bounce" />
                <span className="font-bold">WhatsApp</span>
                <Sparkles className="h-3 w-3 group-hover:animate-spin" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
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