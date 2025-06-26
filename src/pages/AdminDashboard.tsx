
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Users, 
  Lightbulb, 
  Eye, 
  Calendar,
  Mail,
  Briefcase,
  Image,
  Settings
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';

interface DashboardStats {
  totalBlogPosts: number;
  publishedBlogPosts: number;
  totalSolutions: number;
  activeSolutions: number;
  totalUsers: number;
  activeUsers: number;
  totalContacts: number;
  unreadContacts: number;
  totalPortfolioProjects: number;
  activePortfolioProjects: number;
  totalHomeBanners: number;
  activeHomeBanners: number;
  totalServiceCards: number;
  activeServiceCards: number;
}

interface RecentActivity {
  id: string;
  action_type: string;
  entity_type: string;
  entity_title: string | null;
  user_name: string | null;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogPosts: 0,
    publishedBlogPosts: 0,
    totalSolutions: 0,
    activeSolutions: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalContacts: 0,
    unreadContacts: 0,
    totalPortfolioProjects: 0,
    activePortfolioProjects: 0,
    totalHomeBanners: 0,
    activeHomeBanners: 0,
    totalServiceCards: 0,
    activeServiceCards: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch blog posts stats
      const { data: blogPosts } = await supabase
        .from('blog_posts')
        .select('status');
      
      // Fetch solutions stats
      const { data: solutions } = await supabase
        .from('solutions')
        .select('status');
      
      // Fetch users stats
      const { data: users } = await supabase
        .from('admin_profiles')
        .select('is_active');
      
      // Fetch contacts stats
      const { data: contacts } = await supabase
        .from('contacts')
        .select('read');
      
      // Fetch portfolio projects stats
      const { data: portfolioProjects } = await supabase
        .from('portfolio_projects')
        .select('status');
      
      // Fetch home banners stats
      const { data: homeBanners } = await supabase
        .from('home_banners')
        .select('status');

      // Fetch service cards stats
      const { data: serviceCards } = await supabase
        .from('service_cards')
        .select('status');
      
      // Fetch recent activities
      const { data: activities } = await supabase
        .from('admin_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalBlogPosts: blogPosts?.length || 0,
        publishedBlogPosts: blogPosts?.filter(p => p.status === 'published').length || 0,
        totalSolutions: solutions?.length || 0,
        activeSolutions: solutions?.filter(s => s.status === 'active').length || 0,
        totalUsers: users?.length || 0,
        activeUsers: users?.filter(u => u.is_active).length || 0,
        totalContacts: contacts?.length || 0,
        unreadContacts: contacts?.filter(c => !c.read).length || 0,
        totalPortfolioProjects: portfolioProjects?.length || 0,
        activePortfolioProjects: portfolioProjects?.filter(p => p.status === 'active').length || 0,
        totalHomeBanners: homeBanners?.length || 0,
        activeHomeBanners: homeBanners?.filter(b => b.status === 'active').length || 0,
        totalServiceCards: serviceCards?.length || 0,
        activeServiceCards: serviceCards?.filter(c => c.status === 'active').length || 0,
      });

      setRecentActivities(activities || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatActivityType = (type: string) => {
    const types: Record<string, string> = {
      'create': 'Criou',
      'update': 'Atualizou',
      'delete': 'Excluiu',
      'publish': 'Publicou',
      'unpublish': 'Despublicou'
    };
    return types[type] || type;
  };

  const formatEntityType = (type: string) => {
    const types: Record<string, string> = {
      'blog_post': 'Post do Blog',
      'solution': 'Solução',
      'user': 'Usuário',
      'portfolio_project': 'Projeto do Portfólio',
      'portfolio_stat': 'Estatística',
      'portfolio_testimonial': 'Depoimento',
      'home_banner': 'Banner da Home',
      'service_card': 'Card de Serviço'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-black">Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema administrativo</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                Blog Posts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">{stats.totalBlogPosts}</div>
              <p className="text-xs text-gray-600">
                {stats.publishedBlogPosts} publicados
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-brand-gold">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Lightbulb className="w-4 h-4 mr-2" />
                Soluções
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">{stats.totalSolutions}</div>
              <p className="text-xs text-gray-600">
                {stats.activeSolutions} ativas
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Usuários
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">{stats.totalUsers}</div>
              <p className="text-xs text-gray-600">
                {stats.activeUsers} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Mail className="w-4 h-4 mr-2" />
                Contatos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">{stats.totalContacts}</div>
              <p className="text-xs text-gray-600">
                {stats.unreadContacts} não lidos
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Briefcase className="w-4 h-4 mr-2" />
                Portfólio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">{stats.totalPortfolioProjects}</div>
              <p className="text-xs text-gray-600">
                {stats.activePortfolioProjects} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-pink-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Image className="w-4 h-4 mr-2" />
                Banners Home
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">{stats.totalHomeBanners}</div>
              <p className="text-xs text-gray-600">
                {stats.activeHomeBanners} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center">
                <Settings className="w-4 h-4 mr-2" />
                Cards Serviços
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">{stats.totalServiceCards}</div>
              <p className="text-xs text-gray-600">
                {stats.activeServiceCards} ativos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
              <p className="text-gray-600 text-sm">Nenhuma atividade recente encontrada.</p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.user_name || 'Admin'} {formatActivityType(activity.action_type).toLowerCase()}{' '}
                          {formatEntityType(activity.entity_type).toLowerCase()}
                        </p>
                        {activity.entity_title && (
                          <p className="text-xs text-gray-600 mt-1">
                            {activity.entity_title}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(activity.created_at).toLocaleDateString('pt-BR')} às{' '}
                      {new Date(activity.created_at).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/admin/blog">
                  <FileText className="w-6 h-6" />
                  <span className="text-sm">Novo Post</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/admin/solutions">
                  <Lightbulb className="w-6 h-6" />
                  <span className="text-sm">Nova Solução</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/admin/service-cards">
                  <Settings className="w-6 h-6" />
                  <span className="text-sm">Novo Card</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link to="/admin/contacts">
                  <Mail className="w-6 h-6" />
                  <span className="text-sm">Ver Contatos</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
