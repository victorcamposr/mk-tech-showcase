
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Lightbulb, 
  LogOut, 
  Menu, 
  X,
  Mail,
  Home,
  User
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, adminProfile } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/admin');
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
      toast({
        title: "Erro no logout",
        description: "Ocorreu um erro ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const handleGoToSite = () => {
    window.open('/', '_blank');
  };

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: LayoutDashboard,
    },
    { 
      name: 'Blog', 
      href: '/admin/blog', 
      icon: FileText,
    },
    { 
      name: 'Soluções', 
      href: '/admin/solutions', 
      icon: Lightbulb,
    },
    { 
      name: 'Usuários', 
      href: '/admin/users', 
      icon: Users,
    },
    { 
      name: 'Contatos', 
      href: '/admin/contacts', 
      icon: Mail,
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <>
      <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
        {/* Logo section with new MK Tecnologia logo */}
        <div className="bg-black mx-4 mb-8 rounded-lg p-4">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-xl shadow-lg mr-4 bg-black p-1 flex-shrink-0 flex items-center justify-center">
              <img 
                src="/lovable-uploads/806a2e50-9ae7-49ba-856a-b1933b0a8dd9.png" 
                alt="MK Tecnologia Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                MK Admin
              </h1>
              <p className="text-xs text-gray-300 font-medium">Painel Administrativo</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`mr-3 w-7 h-7 rounded-md flex items-center justify-center ${
                  active ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                {item.name}
                {active && (
                  <div className="ml-auto w-2 h-2 bg-blue-500 rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="flex-shrink-0 border-t border-gray-100 p-4 space-y-3">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {adminProfile?.name || 'Administrador'}
            </p>
            <p className="text-xs text-blue-600 uppercase tracking-wide font-medium">
              {adminProfile?.role === 'super_admin' ? 'Super Admin' : 'Administrador'}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={handleGoToSite}
            className="w-full justify-start text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
          >
            <Home className="mr-3 h-4 w-4" />
            Ir para o Site
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sair
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-sm">
          <SidebarContent />
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-80 flex flex-col flex-1">
        <div className="sticky top-0 z-20 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-gray-200">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
