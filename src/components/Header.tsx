import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, Sparkles, Zap, Home, User, Settings, Lightbulb, Grid3X3, Phone, ChevronDown, Coffee, QrCode, Smartphone, Truck, Link2, BarChart3, Bot, Receipt, Monitor, TrendingUp, Banknote, Building2, Tablet, Calculator } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
    { label: "Home", path: "/", icon: Home },
    { label: "Serviços", path: "/servicos", icon: Settings },
    { label: "Portfólio", path: "/portfolio", icon: Grid3X3 },
    { label: "Sobre", path: "/sobre", icon: User },
    { label: "Contato", path: "/contato", icon: Phone },
  ];

  const solutionItems = [
    { label: "PDV/Frente de caixa premium", path: "/solucoes/pdv-frente-caixa", icon: Calculator },
    { label: "Mesas/Comandas - Garçons", path: "/solucoes/mesas-comandas", icon: Coffee },
    { label: "Cardápio Digital", path: "/solucoes/cardapio-digital", icon: QrCode },
    { label: "Maquininhas de cartão", path: "/solucoes/maquininhas-cartao", icon: Smartphone },
    { label: "Controle e aplicativo p/ motoboys", path: "/solucoes/controle-motoboys", icon: Truck },
    { label: "Integrações", path: "/solucoes/integracoes", icon: Link2 },
    { label: "Gestão e análise p/ Food Service", path: "/solucoes/gestao-analise", icon: BarChart3 },
    { label: "Robô de whatsapp", path: "/solucoes/robo-whatsapp", icon: Bot },
    { label: "Nota fiscal, cupom fiscal", path: "/solucoes/nota-fiscal", icon: Receipt },
    { label: "Auto atendimento", path: "/solucoes/auto-atendimento", icon: Monitor },
    { label: "Marketing e aumento de vendas", path: "/solucoes/marketing-vendas", icon: TrendingUp },
    { label: "Soluções em pagamento - TEF", path: "/solucoes/pagamento-tef", icon: Banknote },
    { label: "Franquias e Filiais", path: "/solucoes/franquias-filiais", icon: Building2 },
    { label: "Autoatendimento tablet mesa", path: "/solucoes/autoatendimento-tablet", icon: Tablet },
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
            {/* Home */}
            <Link
              to="/"
              className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                isActive("/") 
                  ? "text-brand-black bg-gradient-to-r from-brand-gold to-brand-gold-light shadow-lg shadow-brand-gold/30" 
                  : "text-white hover:text-brand-gold hover:bg-gradient-to-r hover:from-white/10 hover:to-brand-gold/10 hover:backdrop-blur-sm"
              }`}
            >
              <span className="relative z-10 flex items-center gap-2">
                <Home className="w-4 h-4" />
                Home
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              {isActive("/") && (
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
              )}
            </Link>

            {/* Soluções com Dropdown */}
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Link
                    to="/solucoes"
                    className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                      location.pathname.startsWith('/solucoes')
                        ? "text-brand-black bg-gradient-to-r from-brand-gold to-brand-gold-light shadow-lg shadow-brand-gold/30" 
                        : "text-white hover:text-brand-gold hover:bg-gradient-to-r hover:from-white/10 hover:to-brand-gold/10 hover:backdrop-blur-sm"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      Soluções
                      <ChevronDown className="w-4 h-4 transition-transform group-data-[state=open]:rotate-180" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                    {location.pathname.startsWith('/solucoes') && (
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                    )}
                  </Link>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80 bg-brand-black border border-brand-gold/20 shadow-2xl shadow-brand-gold/10">
                  {solutionItems.map((solution) => {
                    const SolutionIcon = solution.icon;
                    return (
                      <DropdownMenuItem key={solution.path} asChild>
                        <Link
                          to={solution.path}
                          className="flex items-center gap-3 px-4 py-3 text-white hover:text-brand-gold hover:bg-brand-gold/10 transition-colors duration-200 cursor-pointer"
                        >
                          <SolutionIcon className="w-5 h-5 text-brand-gold" />
                          <span className="text-sm font-medium">{solution.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Outros itens do menu */}
            {menuItems.slice(1).map((item, index) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                    isActive(item.path) 
                      ? "text-brand-black bg-gradient-to-r from-brand-gold to-brand-gold-light shadow-lg shadow-brand-gold/30" 
                      : "text-white hover:text-brand-gold hover:bg-gradient-to-r hover:from-white/10 hover:to-brand-gold/10 hover:backdrop-blur-sm"
                  }`}
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <IconComponent className="w-4 h-4" />
                    {item.label}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                  )}
                </Link>
              );
            })}
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
              {/* Home */}
              <Link
                to="/"
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  isActive("/") 
                    ? "text-brand-gold bg-brand-gold/15" 
                    : "text-white hover:text-brand-gold hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>Home</span>
                  </div>
                  {isActive("/") && (
                    <div className="w-2 h-2 bg-brand-gold rounded-full" />
                  )}
                </div>
              </Link>

              {/* Soluções */}
              <Link
                to="/solucoes"
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/solucoes') 
                    ? "text-brand-gold bg-brand-gold/15" 
                    : "text-white hover:text-brand-gold hover:bg-white/10"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>Soluções</span>
                  </div>
                  {location.pathname.startsWith('/solucoes') && (
                    <div className="w-2 h-2 bg-brand-gold rounded-full" />
                  )}
                </div>
              </Link>

              {/* Outros itens do menu */}
              {menuItems.slice(1).map((item) => {
                const IconComponent = item.icon;
                return (
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
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {isActive(item.path) && (
                        <div className="w-2 h-2 bg-brand-gold rounded-full" />
                      )}
                    </div>
                  </Link>
                );
              })}
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