
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
  Mail
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
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

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Blog', href: '/admin/blog', icon: FileText },
    { name: 'Soluções', href: '/admin/solutions', icon: Lightbulb },
    { name: 'Usuários', href: '/admin/users', icon: Users },
    { name: 'Contatos', href: '/admin/contacts', icon: Mail },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
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
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4 mb-8">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/f8914b9c-f621-4ddb-8f33-cb631782bb48.png" 
                  alt="MK Sistemas Logo" 
                  className="w-10 h-10 rounded-lg shadow-md mr-3"
                />
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-brand-gold to-amber-600 bg-clip-text text-transparent">
                    MK Admin
                  </h1>
                  <p className="text-xs text-gray-500">Painel Administrativo</p>
                </div>
              </div>
            </div>
            <nav className="px-3 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-brand-gold/15 to-amber-500/15 text-brand-gold border border-brand-gold/20 shadow-md'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-brand-gold hover:scale-[1.02]'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-colors ${active ? 'text-brand-gold' : 'text-gray-500 group-hover:text-brand-gold'}`} />
                    {item.name}
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-100 p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Static sidebar for desktop */}
      <div className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-xl">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-6 mb-8">
              <div className="flex items-center">
                <img 
                  src="/lovable-uploads/f8914b9c-f621-4ddb-8f33-cb631782bb48.png" 
                  alt="MK Sistemas Logo" 
                  className="w-12 h-12 rounded-xl shadow-lg mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-gold to-amber-600 bg-clip-text text-transparent">
                    MK Admin
                  </h1>
                  <p className="text-sm text-gray-500 font-medium">Painel Administrativo</p>
                </div>
              </div>
            </div>
            <nav className="flex-1 px-4 space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-brand-gold/15 to-amber-500/15 text-brand-gold border border-brand-gold/20 shadow-lg scale-[1.02]'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-brand-gold hover:scale-[1.02] hover:shadow-sm'
                    }`}
                  >
                    <Icon className={`mr-3 h-5 w-5 transition-colors ${active ? 'text-brand-gold' : 'text-gray-500 group-hover:text-brand-gold'}`} />
                    {item.name}
                    {active && (
                      <div className="ml-auto w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 border-t border-gray-100 p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-xl"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-72 flex flex-col flex-1">
        <div className="sticky top-0 z-20 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white/90 backdrop-blur-xl border-b border-gray-200/50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 transition-colors"
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
