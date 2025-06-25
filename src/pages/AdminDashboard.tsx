
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
  RefreshCw,
  ChevronLeft,
  ChevronRight
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

const ITEMS_PER_PAGE = 10;

const AdminDashboard = () => {
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
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedActivities = filteredActivities.slice(startIndex, endIndex);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    applyDateFilter();
  }, [dateFilter, recentActivities]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredActivities]);

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

      if (activitiesResult.data) {
        setRecentActivities(activitiesResult.data);
      }

      const users = usersResult.data || [];
      const activeUsers = users.filter(user => user.is_active).length;

      const posts = postsResult.data || [];
      const publishedPosts = posts.filter(post => post.status === 'published').length;

      const solutions = solutionsResult.data || [];
      const activeSolutions = solutions.filter(solution => solution.status === 'active').length;

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
      case 'create': return 'bg-green-100 text-green-800 border-green-200';
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

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gray-600" />
              </div>
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Visão geral do sistema e atividades recentes
            </p>
          </div>
          <Button
            onClick={refreshData}
            disabled={refreshing}
            variant="outline"
            className="border-gray-300 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Usuários Administrativos
              </CardTitle>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalUsers}</div>
              <p className="text-sm text-green-600 mt-1 font-medium">
                {stats.activeUsers} ativos
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Posts do Blog
              </CardTitle>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
              <p className="text-sm text-green-600 mt-1 font-medium">
                {stats.publishedPosts} publicados
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Soluções Ativas
              </CardTitle>
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-yellow-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalSolutions}</div>
              <p className="text-sm text-green-600 mt-1 font-medium">
                {stats.activeSolutions} ativas
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Mensagens de Contato
              </CardTitle>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stats.totalContacts}</div>
              <p className="text-sm text-orange-600 mt-1 font-medium">
                {stats.unreadContacts} não lidas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-gray-600" />
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
                    className="w-auto border-gray-300"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="endDate" className="text-sm font-medium">Até:</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={dateFilter.endDate}
                    onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-auto border-gray-300"
                  />
                </div>
                {(dateFilter.startDate || dateFilter.endDate) && (
                  <Button
                    onClick={clearDateFilter}
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-gray-900 border-gray-300"
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
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
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
              <>
                <div className="space-y-4">
                  {paginatedActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          {getEntityIcon(activity.entity_type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="font-semibold text-gray-900">
                              {activity.entity_title}
                            </span>
                            <Badge className={`${getActionColor(activity.action_type)} border font-medium text-xs`}>
                              {getActionText(activity.action_type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {getEntityName(activity.entity_type)} • por {activity.user_name || 'Admin'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 bg-white px-3 py-2 rounded-lg border border-gray-200">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatDate(activity.created_at)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                    <div className="text-sm text-gray-600">
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredActivities.length)} de {filteredActivities.length} atividades
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        <ChevronLeft className="w-4 h-4 mr-1" />
                        Anterior
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNumber;
                          if (totalPages <= 5) {
                            pageNumber = i + 1;
                          } else if (currentPage <= 3) {
                            pageNumber = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNumber = totalPages - 4 + i;
                          } else {
                            pageNumber = currentPage - 2 + i;
                          }
                          
                          return (
                            <Button
                              key={pageNumber}
                              variant={currentPage === pageNumber ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(pageNumber)}
                              className={`w-8 h-8 p-0 ${
                                currentPage === pageNumber 
                                  ? 'bg-gray-900 text-white' 
                                  : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {pageNumber}
                            </Button>
                          );
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      >
                        Próxima
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
