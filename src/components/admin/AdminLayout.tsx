
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Lightbulb, 
  LogOut, 
  Menu, 
  X, 
  Home,
  Briefcase,
  Image
} from 'lucide-react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin/login');
  };

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/admin', exact: true },
    { icon: Users, label: 'Usuários', path: '/admin/users' },
    { icon: MessageSquare, label: 'Contatos', path: '/admin/contacts' },
    { icon: FileText, label: 'Blog', path: '/admin/blog' },
    { icon: Lightbulb, label: 'Soluções', path: '/admin/solutions' },
    { icon: Briefcase, label: 'Portfólio', path: '/admin/portfolio' },
    { icon: Image, label: 'Banners', path: '/admin/banners' },
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Close sidebar when route changes on mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-brand-black to-brand-black-light transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-brand-gold/20">
          <h1 className="text-xl font-bold text-brand-gold">MK Admin</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-brand-gold/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="mt-8 px-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-200 group
                  ${active 
                    ? 'bg-brand-gold text-brand-black shadow-lg' 
                    : 'text-gray-300 hover:bg-brand-gold/10 hover:text-brand-gold'
                  }
                `}
              >
                <Icon className={`
                  h-5 w-5 mr-3 transition-transform duration-200
                  ${active ? 'text-brand-black' : 'group-hover:scale-110'}
                `} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full border-brand-gold/30 text-gray-300 hover:bg-brand-gold/10 hover:text-brand-gold hover:border-brand-gold"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white shadow-sm border-b">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-brand-black">MK Tecnologia</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
