
import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Lightbulb, 
  MessageSquare, 
  Briefcase,
  Image,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const menuItems = [
    {
      icon: LayoutDashboard,
      label: 'Dashboard',
      path: '/admin/dashboard',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'Usuários',
      path: '/admin/users',
      color: 'text-green-600'
    },
    {
      icon: MessageSquare,
      label: 'Contatos',
      path: '/admin/contacts',
      color: 'text-red-600'
    },
    {
      icon: FileText,
      label: 'Blog',
      path: '/admin/blog',
      color: 'text-blue-600'
    },
    {
      icon: Lightbulb,
      label: 'Soluções',
      path: '/admin/solutions',
      color: 'text-yellow-600'
    },
    {
      icon: Briefcase,
      label: 'Portfólio',
      path: '/admin/portfolio',
      color: 'text-orange-600'
    },
    {
      icon: Image,
      label: 'Banners Home',
      path: '/admin/home-banners',
      color: 'text-pink-600'
    },
    {
      icon: Settings,
      label: 'Cards Serviços',
      path: '/admin/service-cards',
      color: 'text-purple-600'
    }
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition duration-200 ease-in-out lg:static lg:inset-0 z-50`}>
        <div className="flex flex-col w-64 bg-white shadow-lg h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-6 bg-brand-black">
            <h1 className="text-xl font-bold text-brand-gold">Admin Panel</h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-brand-black-light"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = isActivePath(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-brand-gold/10 text-brand-gold border border-brand-gold/20'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-brand-black'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-brand-gold' : item.color}`} />
                  {item.label}
                  {isActive && (
                    <Badge variant="secondary" className="ml-auto bg-brand-gold/20 text-brand-gold">
                      Ativo
                    </Badge>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top bar */}
        <div className="h-16 bg-white shadow-sm flex items-center justify-between px-6 lg:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-brand-black">Admin Panel</h1>
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Page content */}
        <div className="flex-1 p-6 lg:p-8">
          <Card className="min-h-full border-brand-gold/20 shadow-lg">
            <CardContent className="p-6 lg:p-8">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
