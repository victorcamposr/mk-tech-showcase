import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Lightbulb,
  Activity,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  UserX,
  BookOpen,
  Zap,
  ZapOff,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  Briefcase
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalContacts: number;
  totalPosts: number;
  totalSolutions: number;
  totalPortfolioProjects: number;
  inactiveUsers: number;
  unreadContacts: number;
  draftPosts: number;
  inactiveSolutions: number;
  inactivePortfolioProjects: number;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const ACTIVITIES_PER_PAGE = 10;

  // Use React Query for dashboard stats with automatic refetching
  const { data: stats = {
    totalUsers: 0,
    totalContacts: 0,
    totalPosts: 0,
    totalSolutions: 0,
    totalPortfolioProjects: 0,
    inactiveUsers: 0,
    unreadContacts: 0,
    draftPosts: 0,
    inactiveSolutions: 0,
    inactivePortfolioProjects: 0
  }, isLoading: statsLoading, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardStats> => {
      console.log('Fetching dashboard stats with React Query...');
      try {
        const [
          usersRes, 
          contactsRes, 
          postsRes, 
          solutionsRes, 
          portfolioProjectsRes,
          inactiveUsersRes, 
          unreadContactsRes, 
          draftPostsRes, 
          inactiveSolutionsRes,
          inactivePortfolioProjectsRes
        ] = await Promise.all([
          supabase.from('admin_profiles').select('id', { count: 'exact', head: true }),
          supabase.from('contacts').select('id', { count: 'exact', head: true }),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }),
          supabase.from('solutions').select('id', { count: 'exact', head: true }),
          supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }),
          supabase.from('admin_profiles').select('id', { count: 'exact', head: true }).eq('is_active', false),
          supabase.from('contacts').select('id', { count: 'exact', head: true }).eq('read', false),
          supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
          supabase.from('solutions').select('id', { count: 'exact', head: true }).eq('status', 'inactive'),
          supabase.from('portfolio_projects').select('id', { count: 'exact', head: true }).eq('status', 'inactive')
        ]);

        const dashboardStats = {
          totalUsers: usersRes.count || 0,
          totalContacts: contactsRes.count || 0,
          totalPosts: postsRes.count || 0,
          totalSolutions: solutionsRes.count || 0,
          totalPortfolioProjects: portfolioProjectsRes.count || 0,
          inactiveUsers: inactiveUsersRes.count || 0,
          unreadContacts: unreadContactsRes.count || 0,
          draftPosts: draftPostsRes.count || 0,
          inactiveSolutions: inactiveSolutionsRes.count || 0,
          inactivePortfolioProjects: inactivePortfolioProjectsRes.count || 0
        };

        console.log('Dashboard stats updated via React Query:', dashboardStats);
        return dashboardStats;
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        throw error;
      }
    },
    staleTime: 30000, // Consider data fresh for 30 seconds
    refetchOnWindowFocus: true, // Refetch when window gains focus
    refetchInterval: 60000 // Refetch every minute
  });

  // Activities query
  const { data: activitiesData, isLoading: activitiesLoading } = useQuery({
    queryKey: ['admin-activities', currentPage, dateFilter],
    queryFn: async () => {
      const from = (currentPage - 1) * ACTIVITIES_PER_PAGE;
      const to = from + ACTIVITIES_PER_PAGE - 1;

      let query = supabase
        .from('admin_activities')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (dateFilter) {
        const startDate = new Date(dateFilter);
        const endDate = new Date(dateFilter);
        endDate.setDate(endDate.getDate() + 1);
        
        query = query
          .gte('created_at', startDate.toISOString())
          .lt('created_at', endDate.toISOString());
      }

      const { data, error, count } = await query;
      if (error) throw error;

      return {
        activities: data || [],
        totalActivities: count || 0
      };
    },
    staleTime: 10000 // Consider activities fresh for 10 seconds
  });

  const activities = activitiesData?.activities || [];
  const totalActivities = activitiesData?.totalActivities || 0;

  // Listen for portfolio changes and invalidate dashboard stats
  useEffect(() => {
    console.log('Setting up real-time subscription for portfolio changes...');
    
    const channel = supabase
      .channel('portfolio-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'portfolio_projects' },
        () => {
          console.log('Portfolio projects changed, invalidating dashboard stats...');
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'portfolio_stats' },
        () => {
          console.log('Portfolio stats changed, invalidating dashboard stats...');
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'portfolio_testimonials' },
        () => {
          console.log('Portfolio testimonials changed, invalidating dashboard stats...');
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up portfolio changes subscription...');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

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

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create': return Plus;
      case 'update': return Edit;
      case 'delete': return Trash2;
      default: return Activity;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case 'users':
      case 'user':
      case 'usuário':
      case 'usuários':
      case 'admin_profiles':
        return Users;
      case 'contacts':
      case 'contact':
      case 'contato':
      case 'contatos':
        return MessageSquare;
      case 'blog_posts':
      case 'blog':
      case 'post':
      case 'posts':
        return FileText;
      case 'solutions':
      case 'solution':
      case 'solução':
      case 'soluções':
        return Lightbulb;
      case 'portfolio_projects':
      case 'portfolio_stats':
      case 'portfolio_testimonials':
      case 'portfolio':
        return Briefcase;
      default:
        return Activity;
    }
  };

  const getActionText = (action: string, entityType: string, entityTitle: string) => {
    // If entity_title already contains the action description (like "atualizou o usuário João")
    if (entityTitle && (entityTitle.includes('criou') || entityTitle.includes('atualizou') || entityTitle.includes('excluiu') || entityTitle.includes('ativou') || entityTitle.includes('desativou'))) {
      return entityTitle;
    }

    // Default behavior for simple entity titles
    const entity = getEntityTypeLabel(entityType);
    
    switch (action) {
      case 'create':
        return `criou ${entity.toLowerCase()} "${entityTitle}"`;
      case 'update':
        return `atualizou ${entity.toLowerCase()} "${entityTitle}"`;
      case 'delete':
        return `excluiu ${entity.toLowerCase()} "${entityTitle}"`;
      default:
        return `modificou ${entity.toLowerCase()} "${entityTitle}"`;
    }
  };

  const getEntityTypeLabel = (entityType: string) => {
    switch (entityType.toLowerCase()) {
      case 'admin_profiles':
        return 'usuário';
      case 'contacts':
        return 'contato';
      case 'blog_posts':
        return 'post do blog';
      case 'solutions':
        return 'solução';
      case 'portfolio_projects':
        return 'projeto do portfólio';
      case 'portfolio_stats':
        return 'estatística do portfólio';
      case 'portfolio_testimonials':
        return 'depoimento do portfólio';
      default:
        return entityType;
    }
  };

  const totalPages = Math.ceil(totalActivities / ACTIVITIES_PER_PAGE);

  const statsCards = [
    {
      title: 'Total de Usuários',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-green-500 to-green-600',
      badgeValue: stats.inactiveUsers,
      badgeLabel: 'Inativos',
      badgeIcon: UserX,
      showBadge: stats.inactiveUsers > 0
    },
    {
      title: 'Contatos Recebidos',
      value: stats.totalContacts,
      icon: MessageSquare,
      gradient: 'from-red-500 to-red-600',
      badgeValue: stats.unreadContacts,
      badgeLabel: 'Não Lidos',
      badgeIcon: MessageSquare,
      showBadge: stats.unreadContacts > 0
    },
    {
      title: 'Posts do Blog',
      value: stats.totalPosts,
      icon: FileText,
      gradient: 'from-blue-500 to-blue-600',
      badgeValue: stats.draftPosts,
      badgeLabel: 'Rascunhos',
      badgeIcon: BookOpen,
      showBadge: stats.draftPosts > 0
    },
    {
      title: 'Soluções Ativas',
      value: stats.totalSolutions,
      icon: Lightbulb,
      gradient: 'from-brand-gold to-brand-gold-dark',
      badgeValue: stats.inactiveSolutions,
      badgeLabel: 'Inativas',
      badgeIcon: ZapOff,
      showBadge: stats.inactiveSolutions > 0
    },
    {
      title: 'Projetos Portfólio',
      value: stats.totalPortfolioProjects,
      icon: Briefcase,
      gradient: 'from-purple-500 to-purple-600',
      badgeValue: stats.inactivePortfolioProjects,
      badgeLabel: 'Inativos',
      badgeIcon: ZapOff,
      showBadge: stats.inactivePortfolioProjects > 0
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-black flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-gold to-brand-gold-dark rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-white" />
              </div>
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">
              Visão geral do sistema e atividades recentes
            </p>
          </div>
          <Button 
            onClick={() => {
              console.log('Manual refresh triggered...');
              refetchStats();
            }}
            variant="outline" 
            size="sm"
            className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
          >
            <Activity className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Stats Cards com hierarquia visual melhorada */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const BadgeIcon = stat.badgeIcon;
            return (
              <Card key={index} className="relative overflow-hidden border-brand-gold/20 shadow-lg hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1">
                <CardContent className="p-6">
                  {/* Ícone e valor em destaque */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-brand-black leading-none">
                        {statsLoading ? '...' : stat.value}
                      </div>
                    </div>
                  </div>
                  
                  {/* Título abaixo */}
                  <div className="mb-3">
                    <h3 className="text-sm font-semibold text-gray-700 leading-tight">{stat.title}</h3>
                  </div>
                  
                  {/* Badge de alerta se houver */}
                  {stat.showBadge && (
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive" className="text-xs flex items-center gap-1">
                        <BadgeIcon className="w-3 h-3" />
                        {stat.badgeValue} {stat.badgeLabel}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activities */}
        <Card className="shadow-lg border-brand-gold/20">
          <CardHeader className="bg-gradient-to-r from-brand-gold/5 to-brand-gold/10 border-b border-brand-gold/20">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-brand-black">
                <div className="w-8 h-8 bg-brand-gold/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-4 h-4 text-brand-gold" />
                </div>
                Atividades Recentes
                <Badge variant="outline" className="ml-auto bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                  {totalActivities} total
                </Badge>
              </CardTitle>
            </div>
            
            {/* Date Filter */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-brand-gold" />
                <label className="text-sm font-medium text-brand-black">Filtrar por data:</label>
              </div>
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-auto border-brand-gold/30 focus:border-brand-gold focus:ring-brand-gold/20"
              />
              {dateFilter && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDateFilter('');
                    setCurrentPage(1);
                  }}
                  className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                >
                  Limpar
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {activitiesLoading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold mx-auto"></div>
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
                  {activities.map((activity, index) => {
                    const EntityIcon = getEntityIcon(activity.entity_type);
                    const ActionIcon = getActionIcon(activity.action_type);
                    return (
                      <div key={activity.id} className="p-4 hover:bg-brand-gold/5 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 bg-brand-gold/20 rounded-full flex items-center justify-center relative">
                              <EntityIcon className="w-6 h-6 text-brand-gold" />
                              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-brand-gold/20">
                                <ActionIcon className="w-3 h-3 text-brand-gold" />
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-brand-black font-medium mb-1">
                                <span className="font-semibold text-brand-gold">{activity.user_name}</span> {getActionText(activity.action_type, activity.entity_type, activity.entity_title)}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {formatDate(activity.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-brand-gold flex-shrink-0" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-brand-gold/20 bg-brand-gold/5">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-brand-black">
                        Página {currentPage} de {totalPages} ({totalActivities} atividades)
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                        >
                          <ChevronLeft className="w-4 h-4 mr-1" />
                          Anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
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
