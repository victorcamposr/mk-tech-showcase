
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calculator, Users, BarChart3, Shield, Zap, Settings, FileText, Database, Globe, Smartphone, Lightbulb } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

  // Icon mapping
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
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Lightbulb;
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

      setSolutions(data || []);
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

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                className="h-12 w-auto"
                src="/lovable-uploads/37dd0949-c4e9-4ce4-82ef-a91cc9c4a887.png"
                alt="MK Tecnologia"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${
                  item.current
                    ? 'text-brand-gold border-b-2 border-brand-gold'
                    : 'text-gray-700 hover:text-brand-gold'
                } px-3 py-2 text-sm font-medium transition-colors duration-200`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Solutions Dropdown */}
            <div className="relative">
              <button
                onClick={handleSolutionsToggle}
                className={`${
                  location.pathname.startsWith('/solutions')
                    ? 'text-brand-gold border-b-2 border-brand-gold'
                    : 'text-gray-700 hover:text-brand-gold'
                } px-3 py-2 text-sm font-medium transition-colors duration-200 flex items-center gap-1`}
              >
                Soluções
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
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
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50 py-4">
                  <div className="px-4 py-2 border-b">
                    <h3 className="text-sm font-semibold text-gray-900">Nossas Soluções</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {solutions.map((solution) => {
                      const Icon = getIcon(solution.icon_name);
                      return (
                        <Link
                          key={solution.id}
                          to={`/solutions/${solution.key}`}
                          className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => setIsSolutionsOpen(false)}
                        >
                          <div className="flex-shrink-0 w-8 h-8 bg-brand-gold/10 rounded-lg flex items-center justify-center">
                            <Icon className="w-4 h-4 text-brand-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900">{solution.title}</div>
                            <div className="text-xs text-gray-500 line-clamp-2">{solution.description}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="px-4 py-2 border-t mt-2">
                    <Link
                      to="/solutions"
                      className="text-sm text-brand-gold hover:text-brand-gold-dark font-medium"
                      onClick={() => setIsSolutionsOpen(false)}
                    >
                      Ver todas as soluções →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-brand-gold focus:outline-none focus:text-brand-gold"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    item.current
                      ? 'text-brand-gold bg-brand-gold/10'
                      : 'text-gray-700 hover:text-brand-gold hover:bg-gray-50'
                  } block px-3 py-2 text-base font-medium rounded-md transition-colors duration-200`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Solutions */}
              <div className="px-3 py-2">
                <button
                  onClick={handleSolutionsToggle}
                  className="flex items-center justify-between w-full text-left text-gray-700 hover:text-brand-gold text-base font-medium"
                >
                  Soluções
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
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
                  <div className="mt-2 pl-4 space-y-2">
                    {solutions.map((solution) => {
                      const Icon = getIcon(solution.icon_name);
                      return (
                        <Link
                          key={solution.id}
                          to={`/solutions/${solution.key}`}
                          className="flex items-center gap-2 py-2 text-sm text-gray-600 hover:text-brand-gold"
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
                      to="/solutions"
                      className="block py-2 text-sm text-brand-gold hover:text-brand-gold-dark font-medium"
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
