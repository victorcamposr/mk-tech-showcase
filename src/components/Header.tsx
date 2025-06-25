import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
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
import { supabase } from '@/integrations/supabase/client';

interface Solution {
  id: string;
  title: string;
  description: string;
  key: string;
  icon_name: string;
}

interface NavItem {
  name: string;
  href: string;
  current: boolean;
}

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSolutionsOpen, setIsSolutionsOpen] = useState(false);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const location = useLocation();
  const solutionsDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const { data, error } = await supabase
          .from('solutions')
          .select('id, title, description, key, icon_name')
          .order('sort_order', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching solutions:', error);
          return;
        }

        setSolutions(data || []);
      } catch (error) {
        console.error('Error fetching solutions:', error);
      }
    };

    fetchSolutions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (solutionsDropdownRef.current && !solutionsDropdownRef.current.contains(event.target as Node)) {
        setIsSolutionsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSolutionsDropdown = () => {
    setIsSolutionsOpen(!isSolutionsOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems: NavItem[] = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Serviços', href: '/servicos', current: location.pathname.startsWith('/servicos') },
    { name: 'Blog', href: '/blog', current: location.pathname.startsWith('/blog') },
    { name: 'Contato', href: '/contato', current: location.pathname === '/contato' },
  ];

  // Static solution icon mapping (same as used in AdminSolutions)
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

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-8 w-auto"
                src="/mk-logo.svg"
                alt="MK Tecnologia"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`font-medium ${
                  item.current
                    ? 'text-brand-black'
                    : 'text-gray-600 hover:text-brand-gold'
                } transition-colors duration-300`}
              >
                {item.name}
              </Link>
            ))}

            {/* Solutions Dropdown */}
            <div className="relative" ref={solutionsDropdownRef}>
              <button
                onClick={toggleSolutionsDropdown}
                className="flex items-center space-x-1 text-brand-black hover:text-brand-gold transition-colors duration-300 font-medium"
              >
                <span>Soluções</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isSolutionsOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isSolutionsOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 py-4 z-50">
                  <div className="px-4 pb-2">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Nossas Soluções</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {solutions.map((solution) => {
                      const IconComponent = getIcon(solution);
                      return (
                        <Link
                          key={solution.id}
                          to={`/solucoes/${solution.key}`}
                          className="flex items-center px-4 py-3 hover:bg-brand-gold/5 transition-colors duration-200 group"
                          onClick={() => setIsSolutionsOpen(false)}
                        >
                          <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center mr-3 group-hover:bg-brand-gold/20 transition-colors">
                            <IconComponent className="w-5 h-5 text-brand-gold" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 text-sm">{solution.title}</h4>
                            <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">{solution.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                    <Link
                      to="/solucoes"
                      className="block text-center text-sm font-medium text-brand-gold hover:text-brand-gold-dark transition-colors py-2"
                      onClick={() => setIsSolutionsOpen(false)}
                    >
                      Ver todas as soluções →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMobileMenu}
              type="button"
              className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-gold"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeMobileMenu}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                item.current
                  ? 'text-brand-black'
                  : 'text-gray-600 hover:text-brand-gold'
              } transition-colors duration-300`}
            >
              {item.name}
            </Link>
          ))}
           {/* Solutions Mobile */}
           <Link
              to="/solucoes"
              onClick={closeMobileMenu}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-brand-gold transition-colors duration-300"
            >
              Soluções
            </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
