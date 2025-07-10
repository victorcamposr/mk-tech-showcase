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
  User,
  Sparkles,
  Briefcase,
  Image,
  Layers,
  Tags,
  Receipt
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
      color: 'from-purple-500 to-purple-600'
    },
    { 
      name: 'Blog', 
      href: '/admin/blog', 
      icon: FileText,
      color: 'from-blue-500 to-blue-600'
    },
    { 
      name: 'Soluções', 
      href: '/admin/solutions', 
      icon: Lightbulb,
      color: 'from-brand-gold to-brand-gold-dark'
    },
    { 
      name: 'Categorias', 
      href: '/admin/service-categories', 
      icon: Tags,
      color: 'from-indigo-500 to-indigo-600'
    },
    { 
      name: 'Cards Serviços', 
      href: '/admin/service-cards', 
      icon: Layers,
      color: 'from-teal-500 to-teal-600'
    },
    { 
      name: 'Portfólio', 
      href: '/admin/portfolio', 
      icon: Briefcase,
      color: 'from-orange-500 to-orange-600'
    },
    { 
      name: 'Banners', 
      href: '/admin/home-banners', 
      icon: Image,
      color: 'from-pink-500 to-pink-600'
    },
    { 
      name: 'Usuários', 
      href: '/admin/users', 
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    { 
      name: 'Contatos', 
      href: '/admin/contacts', 
      icon: Mail,
      color: 'from-red-500 to-red-600'
    },
    { 
      name: 'Cadastros Fiscais', 
      href: '/admin/cadastros-fiscais', 
      icon: Receipt,
      color: 'from-violet-500 to-violet-600'
    },
    { 
      name: 'Clientes', 
      href: '/admin/customers', 
      icon: Building2,
      color: 'from-emerald-500 to-emerald-600'
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  const SidebarContent = () => (
    <>
      <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
        <div className="mx-4 mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-xl shadow-2xl bg-black p-2 flex items-center justify-center border-2 border-brand-gold/20">
              <img 
                src="/lovable-uploads/37dd0949-c4e9-4ce4-82ef-a91cc9c4a887.png" 
                alt="MK Tecnologia Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-brand-black mb-1">
              MK Admin
            </h1>
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              <p className="text-xs text-brand-gold font-semibold uppercase tracking-wider">
                Painel Administrativo
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`group flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-brand-gold/20 to-brand-gold/30 text-brand-black border border-brand-gold/30 shadow-lg'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-brand-gold/5 hover:to-brand-gold/10 hover:text-brand-black hover:shadow-md'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <div className={`mr-4 w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  active 
                    ? `bg-gradient-to-br ${item.color} shadow-lg` 
                    : 'bg-gray-100 group-hover:bg-gradient-to-br group-hover:from-brand-gold group-hover:to-brand-gold-dark group-hover:shadow-md'
                }`}>
                  <Icon className={`h-5 w-5 ${
                    active 
                      ? 'text-white' 
                      : 'text-gray-600 group-hover:text-white'
                  }`} />
                </div>
                <span className="flex-1">{item.name}</span>
                {active && (
                  <div className="w-3 h-3 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-full animate-pulse shadow-sm"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 border-t border-gray-100 p-4 space-y-4">
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-brand-gold/5 to-brand-gold/10 rounded-xl border border-brand-gold/20">
          <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-full flex items-center justify-center shadow-lg">
            <User className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-brand-black truncate">
              {adminProfile?.name || 'Administrador'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
              <p className="text-xs text-brand-gold uppercase tracking-wide font-bold">
                {adminProfile?.role === 'super_admin' ? 'Super Admin' : 'Administrador'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button
            variant="ghost"
            onClick={handleGoToSite}
            className="w-full justify-start text-gray-600 hover:text-brand-gold hover:bg-brand-gold/10 transition-all duration-300 rounded-xl font-medium"
          >
            <Home className="mr-3 h-5 w-5" />
            Ir para o Site
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-300 rounded-xl font-medium"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full bg-white shadow-2xl transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 shadow-lg"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-xl">
          <SidebarContent />
        </div>
      </div>

      <div className="md:pl-80 flex flex-col flex-1">
        <div className="sticky top-0 z-20 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white/95 backdrop-blur-sm border-b border-gray-200">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-xl text-gray-500 hover:text-brand-gold hover:bg-brand-gold/10 focus:outline-none focus:ring-2 focus:ring-brand-gold/30 transition-all duration-300 shadow-sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-8">
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
