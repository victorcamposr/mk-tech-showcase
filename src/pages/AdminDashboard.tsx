
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
  Clock
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalPosts: number;
  totalSolutions: number;
  activeSolutions: number;
  publishedPosts: number;
  activeUsers: number;
}

interface RecentActivity {
  id: string;
  action_type: string;
  entity_type: string;
  entity_title: string;
  user_name: string;
  created_at: string;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalPosts: 0,
    totalSolutions: 0,
    activeSolutions: 0,
    publishedPosts: 0,
    activeUsers: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Buscar estatísticas
      const [usersResult, postsResult, solutionsResult, activitiesResult] = await Promise.all([
        supabase.from('admin_profiles').select('*'),
        supabase.from('blog_posts').select('*'),
        supabase.from('solutions').select('*'),
        supabase.from('admin_activities').select('*').order('created_at', { ascending: false }).limit(10)
      ]);

      console.log('Dashboard data:', { usersResult, postsResult, solutionsResult, activitiesResult });

      const users = usersResult.data || [];
      const posts = postsResult.data || [];
      const solutions = solutionsResult.data || [];
      const activities = activitiesResult.data || [];

      setStats({
        totalUsers: users.length,
        totalPosts: posts.length,
        totalSolutions: solutions.length,
        activeSolutions: solutions.filter(s => s.status === 'active').length,
        publishedPosts: posts.filter(p => p.status === 'published').length,
        activeUsers: users.filter(u => u.is_active).length,
      });

      setRecentActivities(activities);
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
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-lg border-0 hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Usuários
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
                Soluções
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
        </div>

        {/* Recent Activities */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand-gold" />
              Atividades Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivities.length === 0 ? (
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
                          {' • '}por {activity.user_name}
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
