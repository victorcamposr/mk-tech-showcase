
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Layers, 
  Menu, 
  X, 
  LogOut,
  Settings,
  Home
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: Layers, label: 'Soluções', path: '/admin/solutions' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const isActivePath = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-lg flex items-center justify-center">
              <span className="text-brand-black font-bold text-sm">MK</span>
            </div>
            <span className="ml-2 text-lg font-bold text-brand-black">Admin</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="mt-6">
          <div className="px-3">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center px-3 py-2 mb-1 text-left rounded-lg transition-colors
                  ${isActivePath(item.path) 
                    ? 'bg-brand-gold/10 text-brand-gold border-r-2 border-brand-gold' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-brand-black'
                  }
                `}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-gray-200 px-3">
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center px-3 py-2 mb-1 text-gray-600 hover:bg-gray-100 hover:text-brand-black rounded-lg transition-colors"
            >
              <Home className="w-5 h-5 mr-3" />
              Ver Site
            </button>
            <button className="w-full flex items-center px-3 py-2 mb-1 text-gray-600 hover:bg-gray-100 hover:text-brand-black rounded-lg transition-colors">
              <Settings className="w-5 h-5 mr-3" />
              Configurações
            </button>
          </div>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-brand-gold/20 rounded-full flex items-center justify-center">
              <span className="text-brand-black font-medium text-sm">
                {profile?.full_name?.[0] || profile?.email?.[0] || 'A'}
              </span>
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-brand-black truncate">
                {profile?.full_name || 'Administrador'}
              </p>
              <p className="text-xs text-gray-500 truncate">{profile?.email}</p>
            </div>
          </div>
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="w-full border-brand-gold/20 text-brand-black hover:bg-brand-gold/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                MK Tecnologia - Painel Administrativo
              </span>
            </div>
          </div>
        </div>

        <main className="p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
