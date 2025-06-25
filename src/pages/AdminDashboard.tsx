import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  FileText, 
  Lightbulb, 
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  Mail
} from 'lucide-react';

interface RecentActivity {
  id: string;
  action_type: string;
  entity_type: string;
  entity_title: string;
  user_name: string;
  created_at: string;
}

interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  publishedPosts: number;
  totalSolutions: number;
  activeSolutions: number;
  totalContacts: number;
  unreadContacts: number;
}

const AdminDashboard = () => {
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalSolutions: 0,
    activeSolutions: 0,
    totalContacts: 0,
    unreadContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas em paralelo
      const [
        activitiesResult,
        usersResult,
        postsResult,
        solutionsResult
      ] = await Promise.all([
        supabase
          .from('admin_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10),
        supabase
          .from('admin_profiles')
          .select('is_active'),
        supabase
          .from('blog_posts')
          .select('status'),
        supabase
          .from('solutions')
          .select('status')
      ]);

      // Processar atividades
      if (activitiesResult.data) {
        setRecentActivities(activitiesResult.data);
      }

      // Processar estatísticas de usuários
      const users = usersResult.data || [];
      const activeUsers = users.filter(user => user.is_active).length;

      // Processar estatísticas de posts
      const posts = postsResult.data || [];
      const publishedPosts = posts.filter(post => post.status === 'published').length;

      // Processar estatísticas de soluções
      const solutions = solutionsResult.data || [];
      const activeSolutions = solutions.filter(solution => solution.status === 'active').length;

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalPosts: posts.length,
        publishedPosts,
        totalSolutions: solutions.length,
        activeSolutions,
        totalContacts: 0, // Will implement contact system next
        unreadContacts: 0, // Will implement contact system next
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-green-100 text-green-800';
      case 'update': return 'bg-blue-100 text-blue-800';
      case 'delete': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'create': return 'Criado';
      case 'update': return 'Atualizado';
      case 'delete': return 'Excluído';
      default: return action;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'user': return <Users className="w-4 h-4" />;
      case 'blog_post': return <FileText className="w-4 h-4" />;
      case 'solution': return <Lightbulb className="w-4 h-4" />;
      case 'contact': return <Mail className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-brand-gold" />
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Visão geral do sistema e atividades recentes
          </p>
        </div>

        {/* Stats Cards - Agora com dados reais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Usuários Administrativos
              </CardTitle>
              <Users className="h-5 w-5 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <p className="text-xs text-green-600 mt-1">
                {stats.activeUsers} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Posts do Blog
              </CardTitle>
              <FileText className="h-5 w-5 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
              <p className="text-xs text-green-600 mt-1">
                {stats.publishedPosts} publicados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Soluções Ativas
              </CardTitle>
              <Lightbulb className="h-5 w-5 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalSolutions}</div>
              <p className="text-xs text-green-600 mt-1">
                {stats.activeSolutions} ativas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mensagens de Contato
              </CardTitle>
              <Mail className="h-5 w-5 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
              <p className="text-xs text-orange-600 mt-1">
                {stats.unreadContacts} não lidas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities - Dinâmicas */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-gold" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando atividades...</p>
              </div>
            ) : recentActivities.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma atividade recente
                </h3>
                <p className="text-gray-600">
                  As atividades do sistema aparecerão aqui conforme forem realizadas.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white rounded-full shadow-sm">
                        {getEntityIcon(activity.entity_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">
                            {activity.entity_title}
                          </span>
                          <Badge className={getActionColor(activity.action_type)}>
                            {getActionText(activity.action_type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {activity.entity_type === 'user' && 'Usuário'}
                          {activity.entity_type === 'blog_post' && 'Post do blog'}
                          {activity.entity_type === 'solution' && 'Solução'}
                          {activity.entity_type === 'contact' && 'Mensagem de contato'}
                          {' • '}por {activity.user_name || 'Admin'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(activity.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
