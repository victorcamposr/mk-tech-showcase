
import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Lightbulb, 
  MessageSquare, 
  Briefcase,
  Image,
  Tags,
  CreditCard,
  LogOut,
  Receipt
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const { signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/admin');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Usuários',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Blog',
      href: '/admin/blog',
      icon: FileText,
    },
    {
      title: 'Soluções',
      href: '/admin/solutions',
      icon: Lightbulb,
    },
    {
      title: 'Contatos',
      href: '/admin/contacts',
      icon: MessageSquare,
    },
    {
      title: 'Cadastros Fiscais',
      href: '/admin/fiscal-data',
      icon: Receipt,
    },
    {
      title: 'Portfólio',
      href: '/admin/portfolio',
      icon: Briefcase,
    },
    {
      title: 'Banners Home',
      href: '/admin/home-banners',
      icon: Image,
    },
    {
      title: 'Categorias de Serviços',
      href: '/admin/service-categories',
      icon: Tags,
    },
    {
      title: 'Cards de Serviços',
      href: '/admin/service-cards',
      icon: CreditCard,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 bg-brand-black">
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
                alt="MK Tecnologia" 
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 py-4">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-brand-gold text-brand-black'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          </ScrollArea>

          {/* Sign Out */}
          <div className="p-4 border-t">
            <Button
              onClick={handleSignOut}
              variant="ghost"
              className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
