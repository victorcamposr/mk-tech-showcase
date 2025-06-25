
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Lightbulb,
  TrendingUp,
  Activity,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalContacts: number;
  totalPosts: number;
  totalSolutions: number;
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
    totalContacts: 0,
    totalPosts: 0,
    totalSolutions: 0
  });
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalActivities, setTotalActivities] = useState(0);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const ACTIVITIES_PER_PAGE = 10;

  useEffect(() => {
    fetchDashboardData();
    fetchActivities();
  }, [currentPage]);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, contactsRes, postsRes, solutionsRes] = await Promise.all([
        supabase.from('admin_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('contacts').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
        supabase.from('solutions').select('id', { count: 'exact', head: true })
      ]);

      setStats({
        totalUsers: usersRes.count || 0,
        totalContacts: contactsRes.count || 0,
        totalPosts: postsRes.count || 0,
        totalSolutions: solutionsRes.count || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Erro ao carregar estatísticas",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive",
      });
    }
  };

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const from = (currentPage - 1) * ACTIVITIES_PER_PAGE;
      const to = from + ACTIVITIES_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('admin_activities')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      setActivities(data || []);
      setTotalActivities(count || 0);
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast({
        title: "Erro ao carregar atividades",
        description: "Não foi possível carregar as atividades recentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      case 'create': return 'Criou';
      case 'update': return 'Atualizou';
      case 'delete': return 'Excluiu';
      default: return action;
    }
  };

  const totalPages = Math.ceil(totalActivities / ACTIVITIES_PER_PAGE);

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Contatos Recebidos',
      value: stats.totalContacts,
      icon: MessageSquare,
      color: 'bg-green-500',
      change: '+18%',
      changeType: 'positive'
    },
    {
      title: 'Posts do Blog',
      value: stats.totalPosts,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Soluções Ativas',
      value: stats.totalSolutions,
      icon: Lightbulb,
      color: 'bg-orange-500',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Visão geral do sistema e atividades recentes
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium text-green-600">{stat.change}</span>
                        <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-3 text-gray-900">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-blue-600" />
              </div>
              Atividades Recentes
              <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
                {totalActivities} total
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando atividades...</p>
              </div>
            ) : activities.length === 0 ? (
              <div className="p-8 text-center">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma atividade encontrada</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`text-xs border ${getActionColor(activity.action_type)}`}>
                                {getActionText(activity.action_type)}
                              </Badge>
                              <span className="text-sm font-medium text-gray-900">
                                {activity.entity_type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">{activity.user_name}</span> {getActionText(activity.action_type).toLowerCase()} "{activity.entity_title}"
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(activity.created_at)}
                            </p>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-700">
                        Página {currentPage} de {totalPages} ({totalActivities} atividades)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="border-gray-300"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="border-gray-300"
                        >
                          Próxima
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
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
