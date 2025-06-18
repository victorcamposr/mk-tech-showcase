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
    <header className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? 'bg-brand-black/80 backdrop-blur-xl border-b border-brand-gold/30 shadow-2xl shadow-brand-gold/10' 
        : 'bg-brand-black/95 backdrop-blur-sm border-b border-brand-gold/20'
    }`}>
      {/* Gradient overlay for modern glass effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/50 via-transparent to-brand-black/50 pointer-events-none" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo with enhanced hover effect */}
          <Link to="/" className="flex items-center space-x-3 group relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300 blur-sm" />
            <CriticalImage 
              src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
              alt="MK Tecnologia" 
              className="h-10 w-auto relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-lg group-hover:drop-shadow-brand-gold/50"
              width={40}
              height={40}
            />
          </Link>

          {/* Desktop Navigation with modern effects */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList className="space-x-2">
              {menuItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  <Link
                    to={item.path}
                    className={`group relative px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                      isActive(item.path) 
                        ? "text-brand-gold bg-gradient-to-r from-brand-gold/20 to-brand-gold/10 shadow-lg shadow-brand-gold/20" 
                        : "text-white hover:text-brand-gold"
                    }`}
                  >
                    {/* Background hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 via-brand-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-xl" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-700" />
                    </div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      {item.label}
                      {/* Active indicator */}
                      {isActive(item.path) && (
                        <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
                      )}
                    </span>
                    
                    {/* Bottom border animation */}
                    <div className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-brand-gold to-brand-gold-light transition-all duration-300 ${
                      isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} />
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Enhanced WhatsApp Button */}
          <div className="hidden md:block">
            <Button 
              asChild
              className="relative overflow-hidden bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold hover:from-brand-gold-dark hover:via-brand-gold hover:to-brand-gold-light text-brand-black font-semibold transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 shadow-xl hover:shadow-2xl hover:shadow-brand-gold/30"
            >
              <a 
                href="https://wa.me/5565993535079" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-2 group"
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <MessageCircle className="h-4 w-4 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
                <span className="relative z-10">WhatsApp</span>
                
                {/* Pulse effect */}
                <div className="absolute inset-0 bg-brand-gold rounded-lg opacity-75 animate-ping scale-110" />
              </a>
            </Button>
          </div>

          {/* Enhanced Mobile menu button */}
          <button
            className="md:hidden relative p-3 rounded-xl text-white hover:text-brand-gold transition-all duration-300 hover:bg-white/10 hover:scale-110 group"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 rounded-xl transition-all duration-300" />
            <div className="relative z-10">
              {isMenuOpen ? (
                <X className="h-6 w-6 transition-transform duration-300 rotate-90" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </div>
          </button>
        </div>

        {/* Enhanced Mobile Navigation */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-6 border-t border-brand-gold/30 bg-gradient-to-b from-brand-black/50 to-brand-black-light/30 backdrop-blur-sm rounded-b-2xl mt-2">
            <div className="flex flex-col space-y-3">
              {menuItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`mx-4 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 hover:translate-x-2 ${
                    isActive(item.path) 
                      ? "text-brand-gold bg-gradient-to-r from-brand-gold/20 to-transparent shadow-lg shadow-brand-gold/20" 
                      : "text-white hover:text-brand-gold hover:bg-white/10"
                  }`}
                  style={{ 
                    animationDelay: `${index * 100}ms`,
                    animation: isMenuOpen ? 'fadeUp 0.6s ease-out forwards' : 'none'
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                    )}
                  </div>
                </Link>
              ))}
              <div className="px-4 pt-4">
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{ 
                    animationDelay: `${menuItems.length * 100}ms`,
                    animation: isMenuOpen ? 'fadeUp 0.6s ease-out forwards' : 'none'
                  }}
                >
                  <a 
                    href="https://wa.me/5565993535079" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 justify-center py-3"
                  >
                    <MessageCircle className="h-5 w-5" />
                    <span>Falar no WhatsApp</span>
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