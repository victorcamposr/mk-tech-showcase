
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { specificSolutions } from "@/data/solutions";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const isActivePath = (path: string) => location.pathname === path;

  const whatsappNumber = "5565999176532";
  const whatsappMessage = encodeURIComponent("Olá! Gostaria de conhecer as soluções da MK Tecnologia.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-white"
    )}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-brand-black font-bold text-lg">MK</span>
            </div>
            <div className="hidden sm:block">
              <div className="text-brand-black font-bold text-xl">MK Tecnologia</div>
              <div className="text-xs text-gray-600 -mt-1">Automação Comercial</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/" className={cn(isActivePath("/") && "text-brand-gold")}>
                    Início
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/sobre" className={cn(isActivePath("/sobre") && "text-brand-gold")}>
                    Sobre
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuItem>
                  <NavigationMenuTrigger className={cn(
                    location.pathname.startsWith("/solucoes") && "text-brand-gold"
                  )}>
                    Soluções
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 w-[500px] lg:w-[600px] lg:grid-cols-2">
                      {Object.entries(specificSolutions).map(([key, solution]) => {
                        const IconComponent = solution.icon;
                        return (
                          <NavigationMenuLink key={key} asChild>
                            <Link
                              to={`/solucoes/${key}`}
                              className="group select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <div className="p-1 bg-brand-gold/10 rounded">
                                  <IconComponent className="w-4 h-4 text-brand-gold" />
                                </div>
                                <div className="text-sm font-medium leading-none group-hover:text-brand-gold transition-colors">
                                  {solution.title}
                                </div>
                              </div>
                              <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                                {solution.description}
                              </p>
                            </Link>
                          </NavigationMenuLink>
                        );
                      })}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/servicos" className={cn(isActivePath("/servicos") && "text-brand-gold")}>
                    Serviços
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/blog" className={cn(isActivePath("/blog") && "text-brand-gold")}>
                    Blog
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/portfolio" className={cn(isActivePath("/portfolio") && "text-brand-gold")}>
                    Portfólio
                  </Link>
                </NavigationMenuLink>

                <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                  <Link to="/contato" className={cn(isActivePath("/contato") && "text-brand-gold")}>
                    Contato
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* CTA Button - Desktop */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button 
              asChild
              className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4 mr-2" />
                Falar Conosco
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-md text-brand-black hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-t shadow-lg">
            <div className="px-4 py-2 space-y-1">
              <Link
                to="/"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActivePath("/") 
                    ? "text-brand-gold bg-brand-gold/10" 
                    : "text-gray-700 hover:text-brand-gold hover:bg-gray-50"
                )}
              >
                Início
              </Link>
              
              <Link
                to="/sobre"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActivePath("/sobre") 
                    ? "text-brand-gold bg-brand-gold/10" 
                    : "text-gray-700 hover:text-brand-gold hover:bg-gray-50"
                )}
              >
                Sobre
              </Link>

              <div className="px-3 py-2">
                <div className="text-base font-medium text-gray-700 mb-2">Soluções</div>
                <div className="pl-4 space-y-1">
                  {Object.entries(specificSolutions).slice(0, 5).map(([key, solution]) => (
                    <Link
                      key={key}
                      to={`/solucoes/${key}`}
                      className="block px-2 py-1 text-sm text-gray-600 hover:text-brand-gold transition-colors"
                    >
                      {solution.title}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                to="/servicos"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActivePath("/servicos") 
                    ? "text-brand-gold bg-brand-gold/10" 
                    : "text-gray-700 hover:text-brand-gold hover:bg-gray-50"
                )}
              >
                Serviços
              </Link>

              <Link
                to="/blog"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActivePath("/blog") 
                    ? "text-brand-gold bg-brand-gold/10" 
                    : "text-gray-700 hover:text-brand-gold hover:bg-gray-50"
                )}
              >
                Blog
              </Link>

              <Link
                to="/portfolio"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActivePath("/portfolio") 
                    ? "text-brand-gold bg-brand-gold/10" 
                    : "text-gray-700 hover:text-brand-gold hover:bg-gray-50"
                )}
              >
                Portfólio
              </Link>

              <Link
                to="/contato"
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActivePath("/contato") 
                    ? "text-brand-gold bg-brand-gold/10" 
                    : "text-gray-700 hover:text-brand-gold hover:bg-gray-50"
                )}
              >
                Contato
              </Link>

              <div className="pt-4 pb-2">
                <Button 
                  asChild
                  className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold"
                >
                  <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Falar Conosco
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
