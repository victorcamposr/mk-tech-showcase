import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Users,
  FileText,
  Lightbulb,
  MessageSquare,
  Briefcase,
  Star,
  TrendingUp,
  Calendar,
  Image,
  Tags,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Filter,
  LayoutDashboard,
  Receipt
} from 'lucide-react';

interface DashboardStats {
  users: number;
  blogPosts: { total: number; published: number; draft: number };
  solutions: { total: number; active: number; inactive: number };
  contacts: { total: number; unread: number };
  portfolioProjects: number;
  portfolioTestimonials: number;
  portfolioStats: number;
  homeBanners: { total: number; active: number; inactive: number };
  serviceCategories: { total: number; active: number; inactive: number };
  serviceCards: { total: number; active: number; inactive: number };
  fiscalData: number;
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
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    blogPosts: { total: 0, published: 0, draft: 0 },
    solutions: { total: 0, active: 0, inactive: 0 },
    contacts: { total: 0, unread: 0 },
    portfolioProjects: 0,
    portfolioTestimonials: 0,
    portfolioStats: 0,
    homeBanners: { total: 0, active: 0, inactive: 0 },
    serviceCategories: { total: 0, active: 0, inactive: 0 },
    serviceCards: { total: 0, active: 0, inactive: 0 },
    fiscalData: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Paginação e filtros para atividades
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const activitiesPerPage = 10;
  
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    filterActivities();
  }, [recentActivities, dateFilter, actionFilter, currentPage]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all stats in parallel
      const [
        usersResponse,
        blogPostsResponse,
        solutionsResponse,
        contactsResponse,
        portfolioProjectsResponse,
        portfolioTestimonialsResponse,
        portfolioStatsResponse,
        activitiesResponse,
        homeBannersResponse,
        serviceCategoriesResponse,
        serviceCardsResponse,
        fiscalDataResponse,
      ] = await Promise.all([
        supabase.from('admin_profiles').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('status', { count: 'exact' }),
        supabase.from('solutions').select('status', { count: 'exact' }),
        supabase.from('contacts').select('read', { count: 'exact' }),
        supabase.from('portfolio_projects').select('id', { count: 'exact' }),
        supabase.from('portfolio_testimonials').select('id', { count: 'exact' }),
        supabase.from('portfolio_stats').select('id', { count: 'exact' }),
        supabase.from('admin_activities').select('*').order('created_at', { ascending: false }).limit(100),
        supabase.from('home_banners').select('status', { count: 'exact' }),
        supabase.from('service_categories').select('status', { count: 'exact' }),
        supabase.from('service_cards').select('status', { count: 'exact' }),
        supabase.from('fiscal_data').select('id', { count: 'exact' }),
      ]);

      // Process blog posts stats
      const blogPosts = blogPostsResponse.data || [];
      const publishedPosts = blogPosts.filter(post => post.status === 'published').length;
      const draftPosts = blogPosts.filter(post => post.status === 'draft').length;

      // Process solutions stats
      const solutions = solutionsResponse.data || [];
      const activeSolutions = solutions.filter(solution => solution.status === 'active').length;
      const inactiveSolutions = solutions.filter(solution => solution.status === 'inactive').length;

      // Process contacts stats
      const contacts = contactsResponse.data || [];
      const unreadContacts = contacts.filter(contact => !contact.read).length;

      // Process home banners stats
      const homeBanners = homeBannersResponse.data || [];
      const activeHomeBanners = homeBanners.filter(banner => banner.status === 'active').length;
      const inactiveHomeBanners = homeBanners.filter(banner => banner.status === 'inactive').length;

      // Process service categories stats
      const serviceCategories = serviceCategoriesResponse.data || [];
      const activeServiceCategories = serviceCategories.filter(category => category.status === 'active').length;
      const inactiveServiceCategories = serviceCategories.filter(category => category.status === 'inactive').length;

      // Process service cards stats
      const serviceCards = serviceCardsResponse.data || [];
      const activeServiceCards = serviceCards.filter(card => card.status === 'active').length;
      const inactiveServiceCards = serviceCards.filter(card => card.status === 'inactive').length;

      // Process fiscal data stats
      const fiscalDataCount = fiscalDataResponse.count || 0;

      setStats({
        users: usersResponse.count || 0,
        blogPosts: {
          total: blogPosts.length,
          published: publishedPosts,
          draft: draftPosts
        },
        solutions: {
          total: solutions.length,
          active: activeSolutions,
          inactive: inactiveSolutions
        },
        contacts: {
          total: contacts.length,
          unread: unreadContacts
        },
        portfolioProjects: portfolioProjectsResponse.count || 0,
        portfolioTestimonials: portfolioTestimonialsResponse.count || 0,
        portfolioStats: portfolioStatsResponse.count || 0,
        homeBanners: {
          total: homeBanners.length,
          active: activeHomeBanners,
          inactive: inactiveHomeBanners
        },
        serviceCategories: {
          total: serviceCategories.length,
          active: activeServiceCategories,
          inactive: inactiveServiceCategories
        },
        serviceCards: {
          total: serviceCards.length,
          active: activeServiceCards,
          inactive: inactiveServiceCards
        },
        fiscalData: fiscalDataCount,
      });

      setRecentActivities(activitiesResponse.data || []);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do dashboard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterActivities = () => {
    let filtered = [...recentActivities];

    // Filtro por data
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filtered = filtered.filter(activity => 
        new Date(activity.created_at) >= filterDate
      );
    }

    // Filtro por ação
    if (actionFilter !== 'all') {
      filtered = filtered.filter(activity => activity.action_type === actionFilter);
    }

    setFilteredActivities(filtered);
  };

  const getCurrentPageActivities = () => {
    const startIndex = (currentPage - 1) * activitiesPerPage;
    const endIndex = startIndex + activitiesPerPage;
    return filteredActivities.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredActivities.length / activitiesPerPage);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return <Plus className="w-4 h-4 text-green-600" />;
      case 'update':
        return <Edit className="w-4 h-4 text-blue-600" />;
      case 'delete':
        return <Trash2 className="w-4 h-4 text-red-600" />;
      default:
        return <Calendar className="w-4 h-4 text-brand-gold" />;
    }
  };

  const getActionTypeLabel = (actionType: string) => {
    const labels: Record<string, string> = {
      'create': 'criou',
      'update': 'atualizou',
      'delete': 'excluiu'
    };
    return labels[actionType] || actionType;
  };

  const getEntityTypeLabel = (entityType: string) => {
    const labels: Record<string, string> = {
      'blog_posts': 'post do blog',
      'solutions': 'solução',
      'portfolio_projects': 'projeto do portfólio',
      'portfolio_testimonials': 'depoimento',
      'portfolio_stats': 'estatística',
      'home_banners': 'banner',
      'service_categories': 'categoria de serviço',
      'service_cards': 'card de serviço',
      'fiscal_data': 'dados fiscais',
      'usuário': 'usuário',
    };
    return labels[entityType] || entityType;
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
            <LayoutDashboard className="w-8 h-8 text-brand-gold" />
            Dashboard Administrativo
          </h1>
          <p className="text-gray-600 mt-2">
            Visão geral do sistema e atividades recentes
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Users Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/users')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Usuários Admins
              </CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
              <p className="text-xs text-gray-500 mt-1">
                Total de administradores
              </p>
            </CardContent>
          </Card>

          {/* Blog Posts Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/blog')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Posts do Blog
              </CardTitle>
              <FileText className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.blogPosts.total}</div>
              <div className="flex gap-4 mt-2">
                <div className="text-xs text-gray-500">
                  <span className="text-green-700 font-medium">{stats.blogPosts.published}</span> publicados
                </div>
                <div className="text-xs text-gray-500">
                  <span className="text-orange-600 font-medium">{stats.blogPosts.draft}</span> rascunhos
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Solutions Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/solutions')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Soluções
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-gold">{stats.solutions.total}</div>
              <div className="flex gap-4 mt-2">
                <div className="text-xs text-gray-500">
                  <span className="text-green-700 font-medium">{stats.solutions.active}</span> ativas
                </div>
                {stats.solutions.inactive > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="text-red-600 font-medium">{stats.solutions.inactive}</span> inativas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Contacts Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/contacts')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Contatos
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.contacts.total}</div>
              {stats.contacts.unread > 0 && (
                <p className="text-xs text-red-600 mt-1">
                  <span className="font-medium">{stats.contacts.unread}</span> não lidos
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Secondary Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Portfolio Projects Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/portfolio')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Projetos Portfólio
              </CardTitle>
              <Briefcase className="h-4 w-4 text-indigo-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-indigo-600">{stats.portfolioProjects}</div>
              <p className="text-xs text-gray-500 mt-1">
                Total de projetos
              </p>
            </CardContent>
          </Card>

          {/* Home Banners Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/home-banners')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Banners Home
              </CardTitle>
              <Image className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{stats.homeBanners.total}</div>
              <div className="flex gap-4 mt-2">
                <div className="text-xs text-gray-500">
                  <span className="text-green-700 font-medium">{stats.homeBanners.active}</span> ativos
                </div>
                {stats.homeBanners.inactive > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="text-red-600 font-medium">{stats.homeBanners.inactive}</span> inativos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Categories Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/service-categories')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Categorias Serviços
              </CardTitle>
              <Tags className="h-4 w-4 text-teal-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-teal-600">{stats.serviceCategories.total}</div>
              <div className="flex gap-4 mt-2">
                <div className="text-xs text-gray-500">
                  <span className="text-green-700 font-medium">{stats.serviceCategories.active}</span> ativas
                </div>
                {stats.serviceCategories.inactive > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="text-red-600 font-medium">{stats.serviceCategories.inactive}</span> inativas
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Service Cards Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/service-cards')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Cards Serviços
              </CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.serviceCards.total}</div>
              <div className="flex gap-4 mt-2">
                <div className="text-xs text-gray-500">
                  <span className="text-green-700 font-medium">{stats.serviceCards.active}</span> ativos
                </div>
                {stats.serviceCards.inactive > 0 && (
                  <div className="text-xs text-gray-500">
                    <span className="text-red-600 font-medium">{stats.serviceCards.inactive}</span> inativos
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Testimonials Card */}
          <Card className="shadow-lg border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Depoimentos
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.portfolioTestimonials}</div>
              <p className="text-xs text-gray-500 mt-1">
                Total de depoimentos
              </p>
            </CardContent>
          </Card>

          {/* Fiscal Data Card */}
          <Card 
            className="shadow-lg border-0 cursor-pointer hover:shadow-xl transition-all duration-200"
            onClick={() => navigate('/admin/fiscal-data')}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Dados Fiscais
              </CardTitle>
              <Receipt className="h-4 w-4 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyan-600">{stats.fiscalData}</div>
              <p className="text-xs text-gray-500 mt-1">
                Cadastros fiscais
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-brand-gold" />
                  Atividades Recentes
                </CardTitle>
                <CardDescription>
                  Últimas ações realizadas no sistema
                </CardDescription>
              </div>
              
              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-full sm:w-32 border-brand-gold/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="today">Hoje</SelectItem>
                    <SelectItem value="week">7 dias</SelectItem>
                    <SelectItem value="month">30 dias</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={actionFilter} onValueChange={setActionFilter}>
                  <SelectTrigger className="w-full sm:w-32 border-brand-gold/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="create">Criação</SelectItem>
                    <SelectItem value="update">Edição</SelectItem>
                    <SelectItem value="delete">Exclusão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {getCurrentPageActivities().length === 0 ? (
              <div className="text-center py-8">
                <LayoutDashboard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma atividade encontrada</p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {getCurrentPageActivities().map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          {getActionIcon(activity.action_type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.user_name} {getActionTypeLabel(activity.action_type)} {getEntityTypeLabel(activity.entity_type)}
                            {activity.entity_title && (
                              <span className="text-brand-gold font-semibold">
                                {' '}{activity.entity_title}
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-gray-500">
                            <Calendar className="w-3 h-3 inline mr-1" />
                            {formatDate(activity.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <div className="text-sm text-gray-600">
                      Mostrando {((currentPage - 1) * activitiesPerPage) + 1} a{' '}
                      {Math.min(currentPage * activitiesPerPage, filteredActivities.length)} de{' '}
                      {filteredActivities.length} atividades
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                      </Button>
                      <span className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Próxima
                        <ChevronRight className="w-4 h-4" />
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
