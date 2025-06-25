
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calculator, Users, BarChart3, Shield, Zap, Settings, FileText, Database, Globe, Smartphone, Lightbulb, CreditCard, Coffee, QrCode, Truck, Link2, Bot, Receipt, Monitor, TrendingUp, Banknote, Building2, Tablet, Fuel } from 'lucide-react';
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

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const location = useLocation();

  // Icon mapping using the static solution icons
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
    receipt: Receipt,
    monitor: Monitor,
    'trending-up': TrendingUp,
    banknote: Banknote,
    building2: Building2,
    tablet: Tablet,
    fuel: Fuel,
  };

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
        .select('id, title, key, description, icon_name, status')
        .eq('status', 'active')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('title', { ascending: true });

      if (error) {
        console.error('Error fetching solutions:', error);
        return;
      }

      // Type assertion to ensure status field matches our interface
      const typedSolutions = (data || []).map(solution => ({
        ...solution,
        status: solution.status as 'active' | 'inactive'
      }));

      setSolutions(typedSolutions);
    } catch (error) {
      console.error('Error fetching solutions:', error);
    }
  };

  const menuItems = [
    { name: 'Início', href: '/', current: location.pathname === '/' },
    { name: 'Sobre', href: '/about', current: location.pathname === '/about' },
    { name: 'Serviços', href: '/services', current: location.pathname === '/services' },
    { name: 'Portfólio', href: '/portfolio', current: location.pathname === '/portfolio' },
    { name: 'Blog', href: '/blog', current: location.pathname === '/blog' },
    { name: 'Contato', href: '/contact', current: location.pathname === '/contact' },
  ];

  const handleSolutionsToggle = () => {
    setIsSolutionsOpen(!isSolutionsOpen);
  };

  const whatsappUrl = "https://api.whatsapp.com/send?phone=5565999833097&text=Olá! Gostaria de saber mais sobre as soluções da MK Tecnologia.";

  return (
    <header className="bg-black shadow-2xl sticky top-0 z-50 border-b border-brand-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-16 w-auto"
                src="/lovable-uploads/37dd0949-c4e9-4ce4-82ef-a91cc9c4a887.png"
                alt="MK Tecnologia"
              />
            </Link>
          </div>

          {/* Desktop Navigation - Centralizada */}
          <nav className="hidden md:flex space-x-8 flex-1 justify-center">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.current
                    ? 'text-brand-gold border-b-2 border-brand-gold'
                    : 'text-white hover:text-brand-gold'
                } px-4 py-3 text-sm font-semibold transition-all duration-300`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={handleSolutionsToggle}
                className={`${
                  location.pathname.startsWith('/solucoes')
                    ? 'text-brand-gold border-b-2 border-brand-gold'
                    : 'text-white hover:text-brand-gold'
                } px-4 py-3 text-sm font-semibold transition-all duration-300 flex items-center gap-2`}
              >
                Soluções
                <svg
                  className={`w-4 h-4 transition-transform duration-300 ${
                    isSolutionsOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isSolutionsOpen && (
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
                            onClick={() => setIsSolutionsOpen(false)}
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
                        onClick={() => setIsSolutionsOpen(false)}
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
          </nav>

          {/* WhatsApp Button - Desktop */}
          <div className="hidden md:flex">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brand-gold hover:bg-brand-gold-light text-brand-black px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <WhatsAppIcon className="w-5 h-5" />
              Falar no WhatsApp
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-brand-gold focus:outline-none focus:text-brand-gold transition-colors duration-300 p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-brand-gold/20 bg-black/95 backdrop-blur-xl">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'text-brand-gold bg-brand-gold/10 border-l-4 border-brand-gold'
                      : 'text-white hover:text-brand-gold hover:bg-brand-gold/5'
                  } block px-4 py-3 text-base font-medium rounded-r-lg transition-all duration-300`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Solutions */}
              <div className="px-4 py-3">
                <button
                  onClick={handleSolutionsToggle}
                  className="flex items-center justify-between w-full text-left text-white hover:text-brand-gold text-base font-medium transition-colors duration-300"
                >
                  Soluções
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${
                      isSolutionsOpen ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isSolutionsOpen && (
                  <div className="mt-3 pl-4 space-y-2">
                    {solutions.map((solution) => {
                      const Icon = getIcon(solution);
                      return (
                        <Link
                          key={solution.id}
                          to={`/solucoes/${solution.key}`}
                          className="flex items-center gap-3 py-2 text-sm text-gray-300 hover:text-brand-gold transition-colors duration-300"
                          onClick={() => {
                            setIsMenuOpen(false);
                            setIsSolutionsOpen(false);
                          }}
                        >
                          <Icon className="w-4 h-4" />
                          {solution.title}
                        </Link>
                      );
                    })}
                    <Link
                      to="/solucoes"
                      className="block py-2 text-sm text-brand-gold hover:text-brand-gold-light font-semibold transition-colors duration-300"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsSolutionsOpen(false);
                      }}
                    >
                      Ver todas as soluções →
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile WhatsApp Button */}
              <div className="px-4 py-3">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-gold hover:bg-brand-gold-light text-brand-black px-6 py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
