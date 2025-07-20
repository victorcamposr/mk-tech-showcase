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
  Receipt,
  Building2
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
      <div className="flex-1 h-0 pt-8 pb-4 overflow-y-auto">
        <div className="mx-4 mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 flex items-center justify-center transform hover:scale-105 transition-all duration-300">
              <img 
                src="/lovable-uploads/37dd0949-c4e9-4ce4-82ef-a91cc9c4a887.png" 
                alt="MK Tecnologia Logo" 
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
            </div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-foreground via-brand-gold to-brand-gold-light bg-clip-text mb-2">
              MK Admin
            </h1>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
              <p className="text-xs font-bold text-transparent bg-gradient-to-r from-muted-foreground via-brand-gold to-brand-gold-light bg-clip-text uppercase tracking-wider">
                Painel Administrativo
              </p>
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse" />
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent"></div>
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
                className={`group relative flex items-center px-4 py-4 text-sm font-medium rounded-2xl transition-all duration-500 transform hover:scale-105 interactive-hover ${
                  active
                    ? 'glass-card neon-glow text-foreground border border-brand-gold/40 shadow-2xl'
                    : 'text-foreground hover:glass-card hover:text-brand-gold hover:shadow-xl backdrop-blur-sm'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                {/* Active indicator line */}
                {active && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-brand-gold to-brand-gold-dark rounded-r-full shadow-lg"></div>
                )}
                
                <div className={`mr-4 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 transform group-hover:rotate-3 ${
                  active 
                    ? `bg-gradient-to-br ${item.color} shadow-2xl neon-glow` 
                    : 'bg-white/10 backdrop-blur-sm border border-white/20 group-hover:bg-gradient-to-br group-hover:from-brand-gold group-hover:to-brand-gold-dark group-hover:shadow-xl group-hover:border-brand-gold/30'
                }`}>
                  <Icon className={`h-6 w-6 transition-all duration-300 ${
                    active 
                      ? 'text-white filter drop-shadow-lg' 
                      : 'text-muted-foreground group-hover:text-white group-hover:filter group-hover:drop-shadow-lg'
                  }`} />
                </div>
                
                <span className={`flex-1 font-semibold transition-all duration-300 ${
                  active ? 'text-foreground' : 'group-hover:text-brand-gold'
                }`}>{item.name}</span>
                
                {active && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse"></div>
                  </div>
                )}
                
                {/* Hover effect overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-gold/0 via-brand-gold/5 to-brand-gold/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-shrink-0 border-t border-white/10 p-6 space-y-4">
        <div className="glass-card p-4 rounded-2xl border border-brand-gold/30 neon-glow">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-gold to-brand-gold-dark rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all duration-300">
                <User className="h-7 w-7 text-white filter drop-shadow-lg" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-foreground truncate">
                  {adminProfile?.name || 'Administrador'}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-brand-gold rounded-full animate-pulse shadow-sm"></div>
                  <p className="text-xs text-brand-gold uppercase tracking-wider font-bold">
                    {adminProfile?.role === 'super_admin' ? 'Super Admin' : 'Administrador'}
                  </p>
                </div>
              </div>
            </div>
        </div>
        
        <div className="space-y-3">
          <Button
            variant="ghost"
            onClick={handleGoToSite}
            className="w-full justify-start text-foreground hover:text-brand-gold hover:glass-card hover:border hover:border-brand-gold/30 transition-all duration-300 rounded-xl font-medium py-3 interactive-hover"
          >
            <Home className="mr-3 h-5 w-5" />
            Ir para o Site
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full justify-start text-foreground hover:text-red-400 hover:glass-card hover:border hover:border-red-400/30 transition-all duration-300 rounded-xl font-medium py-3 interactive-hover"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sair
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div 
          className={`fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`relative flex-1 flex flex-col max-w-xs w-full glass-sidebar transform transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-12 w-12 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-gold/50 shadow-lg neon-glow"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>

      <div className="hidden md:flex md:w-80 md:flex-col md:fixed md:inset-y-0 z-30">
        <div className="flex-1 flex flex-col min-h-0 glass-sidebar">
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
