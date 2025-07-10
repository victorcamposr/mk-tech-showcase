
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Users, FileText, Briefcase, Image, CreditCard, Tags, Receipt, Clock, ChevronLeft, Filter, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { supabase } from '@/integrations/supabase/client';

const AdminDashboard = () => {
  const [usersCount, setUsersCount] = useState(0);
  const [blogPostsCount, setBlogPostsCount] = useState(0);
  const [portfolioProjectsCount, setPortfolioProjectsCount] = useState(0);
  const [inactivePortfolioProjects, setInactivePortfolioProjects] = useState(0);
  const [homeBannersCount, setHomeBannersCount] = useState(0);
  const [inactiveHomeBanners, setInactiveHomeBanners] = useState(0);
  const [serviceCardsCount, setServiceCardsCount] = useState(0);
  const [inactiveServiceCards, setInactiveServiceCards] = useState(0);
  const [serviceCategoriesCount, setServiceCategoriesCount] = useState(0);
  const [inactiveServiceCategories, setInactiveServiceCategories] = useState(0);
  const [contactsCount, setContactsCount] = useState(0);
  const [fiscalDataCount, setFiscalDataCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(0);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [dateFilter, setDateFilter] = useState('1');
  const [actionFilter, setActionFilter] = useState('all');
  const [totalActivities, setTotalActivities] = useState(0);
  const navigate = useNavigate();
  const activitiesPerPage = 5;

  useEffect(() => {
    fetchUsersCount();
    fetchBlogPostsCount();
    fetchPortfolioProjectsCount();
    fetchHomeBannersCount();
    fetchServiceCardsCount();
    fetchServiceCategoriesCount();
    fetchContactsCount();
    fetchFiscalDataCount();
    fetchCustomersCount();
    fetchRecentActivities();
  }, []);

  useEffect(() => {
    fetchRecentActivities();
  }, [currentPage, dateFilter, actionFilter]);

  const fetchUsersCount = async () => {
    try {
      const { count, error } = await supabase
        .from('admin_profiles')
        .select('*', { count: 'exact' });

      if (error) {
        throw error;
      }

      setUsersCount(count || 0);
    } catch (error) {
      console.error('Error fetching users count:', error);
    }
  };

  const fetchBlogPostsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact' });

      if (error) {
        throw error;
      }

      setBlogPostsCount(count || 0);
    } catch (error) {
      console.error('Error fetching blog posts count:', error);
    }
  };

  const fetchPortfolioProjectsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('portfolio_projects')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      if (error) {
        throw error;
      }

      setPortfolioProjectsCount(count || 0);

      const { count: inactiveCount, error: inactiveError } = await supabase
        .from('portfolio_projects')
        .select('*', { count: 'exact' })
        .eq('status', 'inactive');

      if (inactiveError) {
        throw inactiveError;
      }

      setInactivePortfolioProjects(inactiveCount || 0);

    } catch (error) {
      console.error('Error fetching portfolio projects count:', error);
    }
  };

  const fetchHomeBannersCount = async () => {
    try {
      const { count, error } = await supabase
        .from('home_banners')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      if (error) {
        throw error;
      }

      setHomeBannersCount(count || 0);

      const { count: inactiveCount, error: inactiveError } = await supabase
        .from('home_banners')
        .select('*', { count: 'exact' })
        .eq('status', 'inactive');

      if (inactiveError) {
        throw inactiveError;
      }

      setInactiveHomeBanners(inactiveCount || 0);

    } catch (error) {
      console.error('Error fetching home banners count:', error);
    }
  };

  const fetchServiceCardsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('service_cards')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      if (error) {
        throw error;
      }

      setServiceCardsCount(count || 0);

      const { count: inactiveCount, error: inactiveError } = await supabase
        .from('service_cards')
        .select('*', { count: 'exact' })
        .eq('status', 'inactive');

      if (inactiveError) {
        throw inactiveError;
      }

      setInactiveServiceCards(inactiveCount || 0);

    } catch (error) {
      console.error('Error fetching service cards count:', error);
    }
  };

  const fetchServiceCategoriesCount = async () => {
    try {
      const { count, error } = await supabase
        .from('service_categories')
        .select('*', { count: 'exact' })
        .eq('status', 'active');

      if (error) {
        throw error;
      }

      setServiceCategoriesCount(count || 0);

       const { count: inactiveCount, error: inactiveError } = await supabase
       .from('service_categories')
       .select('*', { count: 'exact' })
       .eq('status', 'inactive');

     if (inactiveError) {
       throw inactiveError;
     }

     setInactiveServiceCategories(inactiveCount || 0);

    } catch (error) {
      console.error('Error fetching service categories count:', error);
    }
  };

  const fetchContactsCount = async () => {
    try {
      const { count, error } = await supabase
        .from('contacts')
        .select('*', { count: 'exact' });

      if (error) {
        throw error;
      }

      setContactsCount(count || 0);
    } catch (error) {
      console.error('Error fetching contacts count:', error);
    }
  };

  const fetchFiscalDataCount = async () => {
    try {
      const { count, error } = await supabase
        .from('fiscal_data')
        .select('*', { count: 'exact' });

      if (error) {
        throw error;
      }

      setFiscalDataCount(count || 0);
    } catch (error) {
      console.error('Error fetching fiscal data count:', error);
    }
  };

  const fetchCustomersCount = async () => {
    try {
      const { count, error } = await supabase
        .from('customers')
        .select('*', { count: 'exact' });

      if (error) {
        throw error;
      }

      setCustomersCount(count || 0);
    } catch (error) {
      console.error('Error fetching customers count:', error);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      let query = supabase
        .from('admin_activities')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      // Apply date filter if not "all"
      if (dateFilter !== 'all') {
        const now = new Date();
        const daysAgo = new Date(now.getTime() - (parseInt(dateFilter) * 24 * 60 * 60 * 1000));
        query = query.gte('created_at', daysAgo.toISOString());
      }

      if (actionFilter !== 'all') {
        query = query.eq('action_type', actionFilter);
      }

      // Get total count first
      const { count } = await query;
      setTotalActivities(count || 0);

      // Then get paginated results
      const { data, error } = await query
        .range(currentPage * activitiesPerPage, (currentPage + 1) * activitiesPerPage - 1);

      if (error) {
        throw error;
      }

      setRecentActivities(data || []);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    }
  };

  const getActionColor = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'text-green-600 bg-green-100';
      case 'update':
        return 'text-blue-600 bg-blue-100';
      case 'delete':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getActionText = (actionType: string) => {
    switch (actionType) {
      case 'create':
        return 'Criado';
      case 'update':
        return 'Atualizado';
      case 'delete':
        return 'Excluído';
      default:
        return actionType;
    }
  };

  const getEntityDisplayName = (entityType: string) => {
    const entityMap: { [key: string]: string } = {
      'admin_profiles': 'Usuário',
      'usuário': 'Usuário',
      'blog_posts': 'Post do Blog',
      'portfolio_projects': 'Projeto do Portfólio',
      'home_banners': 'Banner da Home',
      'service_cards': 'Card de Serviço',
      'service_categories': 'Categoria de Serviço',
      'contacts': 'Contato',
      'fiscal_data': 'Cadastro Fiscal',
      'solutions': 'Solução',
      'customers': 'Cliente'
    };
    
    return entityMap[entityType] || entityType;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) {
      return 'Agora mesmo';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''} atrás`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} dia${days > 1 ? 's' : ''} atrás`;
    }
  };

  const totalPages = Math.ceil(totalActivities / activitiesPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDateFilterChange = (value: string) => {
    setDateFilter(value);
    setCurrentPage(0);
  };

  const handleActionFilterChange = (value: string) => {
    setActionFilter(value);
    setCurrentPage(0);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Visão geral da sua plataforma</p>
          </div>
        </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
        {/* Usuários */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/users')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Usuários</p>
                  <p className="text-2xl font-bold text-gray-900">{usersCount}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Blog Posts */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/blog')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <FileText className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Blog Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{blogPostsCount}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Soluções */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/solutions')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Soluções</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioProjectsCount}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Contatos */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/contacts')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Contatos</p>
                  <p className="text-2xl font-bold text-gray-900">{contactsCount}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Cadastros Fiscais */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/cadastros-fiscais')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Receipt className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cadastros Fiscais</p>
                  <p className="text-2xl font-bold text-gray-900">{fiscalDataCount}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Clientes */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/customers')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Building2 className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Clientes</p>
                  <p className="text-2xl font-bold text-gray-900">{customersCount}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Projetos Portfolio */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/portfolio')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Briefcase className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Projetos</p>
                  <p className="text-2xl font-bold text-gray-900">{portfolioProjectsCount}</p>
                  {inactivePortfolioProjects > 0 && (
                    <p className="text-xs text-orange-600">{inactivePortfolioProjects} inativo{inactivePortfolioProjects > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Banners Home */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/home-banners')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Image className="h-6 w-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Banners Home</p>
                  <p className="text-2xl font-bold text-gray-900">{homeBannersCount}</p>
                  {inactiveHomeBanners > 0 && (
                    <p className="text-xs text-orange-600">{inactiveHomeBanners} inativo{inactiveHomeBanners > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Cards Serviços */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/service-cards')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <CreditCard className="h-6 w-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Cards Serviços</p>
                  <p className="text-2xl font-bold text-gray-900">{serviceCardsCount}</p>
                  {inactiveServiceCards > 0 && (
                    <p className="text-xs text-orange-600">{inactiveServiceCards} inativo{inactiveServiceCards > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        {/* Categorias Serviços */}
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/service-categories')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg">
                  <Tags className="h-6 w-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Categorias</p>
                  <p className="text-2xl font-bold text-gray-900">{serviceCategoriesCount}</p>
                  {inactiveServiceCategories > 0 && (
                    <p className="text-xs text-orange-600">{inactiveServiceCategories} inativo{inactiveServiceCategories > 1 ? 's' : ''}</p>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades Recentes */}
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-gold/10 rounded-lg">
                <Clock className="h-5 w-5 text-brand-gold" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Atividades Recentes</h2>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={dateFilter} onValueChange={handleDateFilterChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Hoje</SelectItem>
                    <SelectItem value="7">7 dias</SelectItem>
                    <SelectItem value="14">14 dias</SelectItem>
                    <SelectItem value="30">30 dias</SelectItem>
                    <SelectItem value="all">Todo período</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Select value={actionFilter} onValueChange={handleActionFilterChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="create">Criação</SelectItem>
                  <SelectItem value="update">Atualização</SelectItem>
                  <SelectItem value="delete">Exclusão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, index) => (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50/50 rounded-lg border border-gray-100">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${getActionColor(activity.action_type)}`}>
                    {getActionText(activity.action_type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium">
                      <span>{getEntityDisplayName(activity.entity_type)}</span>
                      {activity.entity_title && (
                        <span className="text-brand-gold font-semibold"> "{activity.entity_title}"</span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-xs text-gray-500">
                        por {activity.user_name || 'Sistema'}
                      </p>
                      <span className="text-xs text-gray-400">•</span>
                      <p className="text-xs text-gray-500">
                        {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Nenhuma atividade recente encontrada</p>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalActivities > activitiesPerPage && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Mostrando {currentPage * activitiesPerPage + 1} a {Math.min((currentPage + 1) * activitiesPerPage, totalActivities)} de {totalActivities} atividades
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  Próxima
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
