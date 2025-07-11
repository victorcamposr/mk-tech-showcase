import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle, Sparkles, Zap, Home, User, Settings, Lightbulb, Grid3X3, Phone, ChevronDown, CreditCard, Coffee, QrCode, Smartphone, Truck, Link2, BarChart3, Bot, Receipt, Monitor, TrendingUp, Banknote, Building2, Tablet, Calculator, Fuel, BookOpen } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import CriticalImage from "@/components/CriticalImage";
import { supabase } from '@/integrations/supabase/client';
import WhatsAppIcon from './WhatsAppIcon';

interface Solution {
  id: string;
  title: string;
  key: string;
  description: string;
  icon_name: string;
  status: 'active' | 'inactive';
}

interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: 'active' | 'inactive';
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isMobileSolutionsOpen, setIsMobileSolutionsOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);

  // Static solution icon mapping based on solution keys (same as AdminSolutions)
  const staticSolutionIcons: Record<string, any> = {
    'pdv-frente-caixa': Calculator,
    'mesas-comandas': Coffee,
    'cardapio-digital': QrCode,
    'maquininhas-cartao': CreditCard,
    'controle-motoboys': Truck,
    'integracoes': Link2,
    'gestao-analise': BarChart3,
    'robo-whatsapp': Bot,
    'nota-fiscal': Receipt,
    'auto-atendimento': Monitor,
    'marketing-vendas': TrendingUp,
    'pagamento-tef': Banknote,
    'franquias-filiais': Building2,
    'autoatendimento-tablet': Tablet,
    'sistema-revendas-gas-agua': Fuel,
  };

  // Fallback icon mapping by icon_name (same as AdminSolutions)
  const iconMap: Record<string, any> = {
    calculator: Calculator,
    users: User,
    'bar-chart-3': BarChart3,
    shield: Settings,
    zap: Zap,
    settings: Settings,
    'file-text': Receipt,
    database: Grid3X3,
    globe: Grid3X3,
    smartphone: Smartphone,
    lightbulb: Lightbulb,
    'credit-card': CreditCard,
    coffee: Coffee,
    'qr-code': QrCode,
    truck: Truck,
    link2: Link2,
    bot: Bot,
    monitor: Monitor,
    'trending-up': TrendingUp,
    banknote: Banknote,
    building2: Building2,
    tablet: Tablet,
    fuel: Fuel,
    receipt: Receipt,
  };

  const getIcon = (solution: Solution) => {
    // First try to get icon from static mapping based on solution key
    if (staticSolutionIcons[solution.key]) {
      return staticSolutionIcons[solution.key];
    }
    // Fallback to icon mapping by icon_name
    return iconMap[solution.icon_name] || Lightbulb;
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (servicesDropdownRef.current && !servicesDropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    };

    if (isDropdownOpen || isServicesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen, isServicesDropdownOpen]);

  // Scroll para o topo ao navegar entre soluções
  useEffect(() => {
    if (location.pathname.startsWith('/solucoes/') || location.pathname.startsWith('/servicos/')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchSolutions();
    fetchServiceCategories();
  }, []);

  const fetchSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select('id, title, key, description, icon_name, status')
        .eq('status', 'active')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching solutions:', error);
        return;
      }

      const typedSolutions = (data || []).map(solution => ({
        ...solution,
        status: solution.status as 'active' | 'inactive'
      }));

      setSolutions(typedSolutions);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const fetchServiceCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select(`
          id,
          name,
          slug,
          description,
          status,
          service_cards!inner(id)
        `)
        .eq('status', 'active')
        .eq('service_cards.status', 'active')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching service categories:', error);
        return;
      }

      const typedCategories = (data || []).map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        status: category.status as 'active' | 'inactive'
      }));

      setServiceCategories(typedCategories);
    } catch (error) {
      console.error('Error fetching service categories:', error);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { label: "Home", path: "/", icon: Home },
    { label: "Portfólio", path: "/portfolio", icon: Grid3X3 },
    { label: "Blog", path: "/blog", icon: BookOpen },
    { label: "Sobre", path: "/sobre", icon: User },
    { label: "Contato", path: "/contato", icon: Phone },
  ];

  const whatsappUrl = "https://api.whatsapp.com/send?phone=5565999833097&text=Olá! Gostaria de saber mais sobre as soluções da MK Tecnologia.";

  const handleSolutionClick = () => {
    setIsDropdownOpen(false);
  };

  const handleServiceClick = () => {
    setIsServicesDropdownOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
      isScrolled 
        ? 'bg-gradient-to-r from-brand-black via-brand-black to-brand-black-light backdrop-blur-xl border-b border-brand-gold/40 shadow-2xl shadow-brand-gold/10' 
        : 'bg-gradient-to-r from-brand-black to-brand-black-light border-b border-brand-gold/30'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <CriticalImage 
              src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
              alt="MK Tecnologia" 
              className="h-12 w-auto"
              width={48}
              height={48}
            />
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
            
            {/* Soluções with Click Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                  location.pathname.startsWith('/solucoes')
                    ? "text-brand-black bg-gradient-to-r from-brand-gold to-brand-gold-light shadow-lg shadow-brand-gold/30" 
                    : "text-white hover:text-brand-gold hover:bg-gradient-to-r hover:from-white/10 hover:to-brand-gold/10 hover:backdrop-blur-sm"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Soluções
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                {location.pathname.startsWith('/solucoes') && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                )}
              </button>
              
              {/* Modern Dropdown Content */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-96 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-brand-gold/30 z-50 py-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="px-6 py-3 border-b border-brand-gold/20">
                      <h3 className="text-lg font-bold text-brand-gold">Nossas Soluções</h3>
                      <p className="text-sm text-gray-300 mt-1">Tecnologia de ponta para seu negócio</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {solutions.map((solution) => {
                        const Icon = getIcon(solution);
                        return (
                          <Link
                            key={solution.id}
                            to={`/solucoes/${solution.key}`}
                            className="flex items-start gap-4 px-6 py-4 hover:bg-brand-gold/10 transition-all duration-300 group"
                            onClick={handleSolutionClick}
                          >
                            <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-gold/20 to-brand-gold-light/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Icon className="w-5 h-5 text-brand-gold" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors duration-300">{solution.title}</div>
                              <div className="text-xs text-gray-400 line-clamp-2 mt-1">{solution.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                    <div className="px-6 py-4 border-t border-brand-gold/20">
                      <Link
                        to="/solucoes"
                        className="text-sm text-brand-gold hover:text-brand-gold-light font-semibold transition-colors duration-300 flex items-center gap-2"
                        onClick={handleSolutionClick}
                      >
                        Ver todas as soluções
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Serviços with Click Dropdown */}
            <div className="relative" ref={servicesDropdownRef}>
              <button
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                className={`relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 group overflow-hidden ${
                  location.pathname.startsWith('/servicos')
                    ? "text-brand-black bg-gradient-to-r from-brand-gold to-brand-gold-light shadow-lg shadow-brand-gold/30" 
                    : "text-white hover:text-brand-gold hover:bg-gradient-to-r hover:from-white/10 hover:to-brand-gold/10 hover:backdrop-blur-sm"
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Serviços
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
                {location.pathname.startsWith('/servicos') && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
                )}
              </button>
              
              {isServicesDropdownOpen && (
                <div className="absolute top-full left-0 mt-3 w-80 bg-black/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-brand-gold/30 z-50 py-6 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 to-transparent"></div>
                  <div className="relative z-10">
                    <div className="px-6 py-3 border-b border-brand-gold/20">
                      <h3 className="text-lg font-bold text-brand-gold">Nossos Serviços</h3>
                      <p className="text-sm text-gray-300 mt-1">Parceiros especializados por categoria</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {serviceCategories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/servicos/${category.slug}`}
                          className="flex items-start gap-4 px-6 py-4 hover:bg-brand-gold/10 transition-all duration-300 group"
                          onClick={handleServiceClick}
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-brand-gold/20 to-brand-gold-light/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Settings className="w-5 h-5 text-brand-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors duration-300">{category.name}</div>
                            {category.description && (
                              <div className="text-xs text-gray-400 line-clamp-2 mt-1">{category.description}</div>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="px-6 py-4 border-t border-brand-gold/20">
                      <Link
                        to="/servicos"
                        className="text-sm text-brand-gold hover:text-brand-gold-light font-semibold transition-colors duration-300 flex items-center gap-2"
                        onClick={handleServiceClick}
                      >
                        Ver todos os serviços
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
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
              <Link 
                to="/cadastro-fiscal"
                className="flex items-center gap-2 px-6 py-3 relative z-10"
              >
                <Receipt className="h-5 w-5 group-hover:animate-bounce" />
                <span className="font-bold">Cadastro Fiscal</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></div>
              </Link>
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
          isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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

              {/* Soluções com dropdown mobile */}
              <div>
                <button
                  onClick={() => setIsMobileSolutionsOpen(!isMobileSolutionsOpen)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname.startsWith('/solucoes')
                      ? "text-brand-gold bg-brand-gold/15" 
                      : "text-white hover:text-brand-gold hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      <span>Soluções</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {location.pathname.startsWith('/solucoes') && (
                        <div className="w-2 h-2 bg-brand-gold rounded-full" />
                      )}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileSolutionsOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>
                
                {/* Dropdown de soluções mobile */}
                <div className={`transition-all duration-300 ${
                  isMobileSolutionsOpen ? 'max-h-64 opacity-100 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-gold scrollbar-track-transparent' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <div className="pl-6 space-y-1 mt-2">
                    {/* Link para página principal de soluções */}
                    <Link
                      to="/solucoes"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-light hover:bg-brand-gold/10 transition-colors duration-200 rounded-lg border-b border-brand-gold/20 mb-2"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileSolutionsOpen(false);
                      }}
                    >
                      <Lightbulb className="w-4 h-4 text-brand-gold flex-shrink-0" />
                      <span className="text-xs">Ver todas as soluções</span>
                    </Link>
                    
                    {/* Lista de soluções individuais */}
                    {solutions.map((solution) => {
                      const SolutionIcon = getIcon(solution);
                      return (
                        <Link
                          key={solution.id}
                          to={`/solucoes/${solution.key}`}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:text-brand-gold hover:bg-brand-gold/10 transition-colors duration-200 rounded-lg"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsMobileSolutionsOpen(false);
                          }}
                        >
                          <SolutionIcon className="w-4 h-4 text-brand-gold flex-shrink-0" />
                          <span className="text-xs">{solution.title}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Serviços com dropdown mobile */}
              <div>
                <button
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    location.pathname.startsWith('/servicos')
                      ? "text-brand-gold bg-brand-gold/15" 
                      : "text-white hover:text-brand-gold hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="w-4 h-4" />
                      <span>Serviços</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {location.pathname.startsWith('/servicos') && (
                        <div className="w-2 h-2 bg-brand-gold rounded-full" />
                      )}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMobileServicesOpen ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </button>
                
                <div className={`transition-all duration-300 ${
                  isMobileServicesOpen ? 'max-h-64 opacity-100 overflow-y-auto scrollbar-thin scrollbar-thumb-brand-gold scrollbar-track-transparent' : 'max-h-0 opacity-0 overflow-hidden'
                }`}>
                  <div className="pl-6 space-y-1 mt-2">
                    <Link
                      to="/servicos"
                      className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-brand-gold hover:text-brand-gold-light hover:bg-brand-gold/10 transition-colors duration-200 rounded-lg border-b border-brand-gold/20 mb-2"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsMobileServicesOpen(false);
                      }}
                    >
                      <Settings className="w-4 h-4 text-brand-gold flex-shrink-0" />
                      <span className="text-xs">Ver todos os serviços</span>
                    </Link>
                    
                    {serviceCategories.map((category) => (
                      <Link
                        key={category.id}
                        to={`/servicos/${category.slug}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-white hover:text-brand-gold hover:bg-brand-gold/10 transition-colors duration-200 rounded-lg"
                        onClick={() => {
                          setIsMenuOpen(false);
                          setIsMobileServicesOpen(false);
                        }}
                      >
                        <Settings className="w-4 h-4 text-brand-gold flex-shrink-0" />
                        <span className="text-xs">{category.name}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

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
                  <Link 
                    to="/cadastro-fiscal"
                    className="flex items-center gap-2 justify-center py-2"
                  >
                    <Receipt className="h-4 w-4" />
                    Cadastro Fiscal
                  </Link>
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
