
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, MapPin, Phone, Mail, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Calculator, 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Settings, 
  FileText, 
  Database, 
  Globe, 
  Smartphone, 
  Lightbulb,
  CreditCard,
  Coffee,
  QrCode,
  Truck,
  Link2,
  Bot,
  Monitor,
  TrendingUp,
  Banknote,
  Building2,
  Tablet,
  Fuel,
  Receipt
} from 'lucide-react';

interface Solution {
  id: string;
  title: string;
  key: string;
  icon_name: string;
  description: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const location = useLocation();

  // Static solution icon mapping based on solution keys
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

  // Fallback icon mapping
  const iconMap: Record<string, any> = {
    calculator: Calculator,
    users: Users,
    'bar-chart-3': BarChart3,
    shield: Shield,
    zap: Zap,
    settings: Settings,
    'file-text': FileText,
    database: Database,
    globe: Globe,
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
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select('id, title, key, icon_name, description')
        .eq('status', 'active')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('title');

      if (error) throw error;
      setSolutions(data || []);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isServicesOpen) setIsServicesOpen(false);
  };

  const toggleServices = () => setIsServicesOpen(!isServicesOpen);

  const closeMenus = () => {
    setIsMenuOpen(false);
    setIsServicesOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Sobre', path: '/about' },
    { name: 'Serviços', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contato', path: '/contact' },
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      {/* Top Bar */}
      <div className="bg-brand-black text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-brand-gold" />
                <span>Rua Exemplo, 123 - Centro</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-gold" />
                <span>(11) 9999-9999</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-gold" />
                <span>contato@mktecnologia.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <ExternalLink className="w-4 h-4 text-brand-gold" />
              <span>Horário: Segunda à Sexta, 8h às 18h</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 rounded-xl shadow-lg bg-black p-2 flex items-center justify-center border-2 border-brand-gold/20">
              <img 
                src="/lovable-uploads/37dd0949-c4e9-4ce4-82ef-a91cc9c4a887.png" 
                alt="MK Tecnologia Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-brand-black">MK Tecnologia</h1>
              <p className="text-xs text-brand-gold font-semibold uppercase tracking-wider">
                Soluções Digitais
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors hover:text-brand-gold ${
                  isActive(link.path) 
                    ? 'text-brand-gold border-b-2 border-brand-gold pb-1' 
                    : 'text-gray-700'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={toggleServices}
                className="flex items-center space-x-1 font-medium text-gray-700 hover:text-brand-gold transition-colors"
              >
                <span>Soluções</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-4 z-50">
                  <div className="px-4 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-brand-black">Nossas Soluções</h3>
                    <p className="text-sm text-gray-600 mt-1">Escolha a solução ideal para seu negócio</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {solutions.map((solution) => {
                      const Icon = getIcon(solution);
                      return (
                        <Link
                          key={solution.id}
                          to={`/solutions/${solution.key}`}
                          className="flex items-start space-x-3 px-4 py-3 hover:bg-brand-gold/10 transition-colors"
                          onClick={closeMenus}
                        >
                          <div className="w-10 h-10 bg-brand-gold/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <Icon className="w-5 h-5 text-brand-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-brand-black text-sm leading-tight">
                              {solution.title}
                            </h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                              {solution.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="px-4 pt-3 border-t border-gray-100 mt-2">
                    <Link
                      to="/solutions"
                      className="block w-full text-center py-2 px-4 bg-brand-gold text-white rounded-lg hover:bg-brand-gold-dark transition-colors text-sm font-medium"
                      onClick={closeMenus}
                    >
                      Ver Todas as Soluções
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 text-gray-700 hover:text-brand-gold transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block font-medium transition-colors hover:text-brand-gold ${
                    isActive(link.path) ? 'text-brand-gold' : 'text-gray-700'
                  }`}
                  onClick={closeMenus}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Solutions */}
              <div>
                <button
                  onClick={toggleServices}
                  className="flex items-center justify-between w-full font-medium text-gray-700 hover:text-brand-gold transition-colors"
                >
                  <span>Soluções</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isServicesOpen && (
                  <div className="mt-3 pl-4 space-y-3 border-l-2 border-brand-gold/20">
                    {solutions.map((solution) => {
                      const Icon = getIcon(solution);
                      return (
                        <Link
                          key={solution.id}
                          to={`/solutions/${solution.key}`}
                          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-brand-gold transition-colors"
                          onClick={closeMenus}
                        >
                          <Icon className="w-4 h-4 text-brand-gold flex-shrink-0" />
                          <span>{solution.title}</span>
                        </Link>
                      );
                    })}
                    <Link
                      to="/solutions"
                      className="block text-sm font-medium text-brand-gold hover:text-brand-gold-dark transition-colors"
                      onClick={closeMenus}
                    >
                      Ver Todas as Soluções →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
