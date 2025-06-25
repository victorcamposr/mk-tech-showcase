
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  FileText, 
  Lightbulb, 
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  Mail,
  Filter,
  RefreshCw
} from 'lucide-react';
import { format, startOfDay, endOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);

  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<RecentActivity[]>([]);
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
  const [refreshing, setRefreshing] = useState(false);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    applyDateFilter();
  }, [dateFilter, recentActivities]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Buscar estatísticas em paralelo
      const [
        activitiesResult,
        usersResult,
        postsResult,
        solutionsResult,
        contactsResult
      ] = await Promise.all([
        supabase
          .from('admin_activities')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50),
        supabase
          .from('admin_profiles')
          .select('is_active'),
        supabase
          .from('blog_posts')
          .select('status'),
        supabase
          .from('solutions')
          .select('status'),
        supabase
          .from('contacts')
          .select('read')
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

      // Processar estatísticas de contatos
      const contacts = contactsResult.data || [];
      const unreadContacts = contacts.filter(contact => !contact.read).length;

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalPosts: posts.length,
        publishedPosts,
        totalSolutions: solutions.length,
        activeSolutions,
        totalContacts: contacts.length,
        unreadContacts,
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setRefreshing(false);
  };

  const applyDateFilter = () => {
    if (!dateFilter.startDate && !dateFilter.endDate) {
      setFilteredActivities(recentActivities);
      return;
    }

    const filtered = recentActivities.filter(activity => {
      const activityDate = new Date(activity.created_at);
      
      if (dateFilter.startDate && dateFilter.endDate) {
        const start = startOfDay(new Date(dateFilter.startDate));
        const end = endOfDay(new Date(dateFilter.endDate));
        return activityDate >= start && activityDate <= end;
      } else if (dateFilter.startDate) {
        const start = startOfDay(new Date(dateFilter.startDate));
        return activityDate >= start;
      } else if (dateFilter.endDate) {
        const end = endOfDay(new Date(dateFilter.endDate));
        return activityDate <= end;
      }
      
      return true;
    });

    setFilteredActivities(filtered);
  };

  const clearDateFilter = () => {
    setDateFilter({ startDate: '', endDate: '' });
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", {
      locale: ptBR
    });
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'update': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delete': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  const getEntityName = (entityType: string) => {
    switch (entityType) {
      case 'user': return 'Usuário';
      case 'blog_post': return 'Post do blog';
      case 'solution': return 'Solução';
      case 'contact': return 'Mensagem de contato';
      default: return entityType;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Visão geral do sistema e atividades recentes
            </p>
          </div>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
            className="border-brand-gold/20 text-brand-gold hover:bg-brand-gold/5"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Usuários Administrativos
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalUsers}</div>
              <p className="text-sm text-emerald-600 mt-1 font-medium">
                {stats.activeUsers} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Posts do Blog
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalPosts}</div>
              <p className="text-sm text-emerald-600 mt-1 font-medium">
                {stats.publishedPosts} publicados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Soluções Ativas
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalSolutions}</div>
              <p className="text-sm text-emerald-600 mt-1 font-medium">
                {stats.activeSolutions} ativas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:scale-105 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mensagens de Contato
              </CardTitle>
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{stats.totalContacts}</div>
              <p className="text-sm text-orange-600 mt-1 font-medium">
                {stats.unreadContacts} não lidas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                Atividades Recentes
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Label htmlFor="startDate" className="text-sm font-medium">De:</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={dateFilter.startDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-auto"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">Até:</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-auto"
                  />
                </div>
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <Button
                    onClick={clearDateFilter}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Filter className="w-4 h-4 mr-1" />
                    Limpar
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-gold mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando atividades...</p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {dateFilter.startDate || dateFilter.endDate 
                    ? 'Nenhuma atividade encontrada no período' 
                    : 'Nenhuma atividade recente'
                  }
                </h3>
                <p className="text-gray-600">
                  {dateFilter.startDate || dateFilter.endDate
                    ? 'Tente ajustar o filtro de data para ver mais atividades.'
                    : 'As atividades do sistema aparecerão aqui conforme forem realizadas.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {paginatedActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gray-50 rounded-xl">
                        {getEntityIcon(activity.entity_type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-semibold text-gray-900 text-lg">
                            {activity.entity_title}
                          </span>
                          <Badge className={`${getActionColor(activity.action_type)} border font-medium`}>
                            {getActionText(activity.action_type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {getEntityName(activity.entity_type)} • por {activity.user_name || 'Admin'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                      <Calendar className="w-4 h-4 mr-2" />
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
