
import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut, 
  Menu, 
  X,
  Lightbulb,
  Home
} from 'lucide-react';
import CriticalImage from '@/components/CriticalImage';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi desconectado do sistema.",
      });
      navigate('/admin');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Tente novamente.",
      });
    }
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Usuários', path: '/admin/users', icon: Users },
    { label: 'Blog', path: '/admin/blog', icon: FileText },
    { label: 'Soluções', path: '/admin/solutions', icon: Lightbulb },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-white shadow-lg hover:shadow-xl text-gray-900 border border-gray-200"
          size="sm"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-xl border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-brand-gold/5 to-brand-gold-light/5">
            <Link to="/" className="flex items-center space-x-3 group">
              <CriticalImage 
                src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
                alt="MK Tecnologia" 
                className="h-10 w-auto"
                width={40}
                height={40}
              />
              <div>
                <h2 className="text-gray-900 font-bold text-lg">Admin Panel</h2>
                <p className="text-brand-gold text-sm font-medium">MK Tecnologia</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-brand-gold to-brand-gold-light text-brand-black shadow-lg'
                      : 'text-gray-700 hover:text-brand-gold hover:bg-brand-gold/5'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <IconComponent className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-gray-200">
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:text-brand-gold hover:bg-brand-gold/5 transition-all duration-200"
                onClick={() => setSidebarOpen(false)}
              >
                <Home className="w-5 h-5" />
                Voltar ao Site
              </Link>
            </div>
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="mb-4 p-3 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-900 text-sm font-medium truncate">{user?.email}</p>
              <p className="text-brand-gold text-xs font-medium">Administrador</p>
            </div>
            <Button
              onClick={handleSignOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        <main className="p-6 lg:p-8 min-h-screen">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;
