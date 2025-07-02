import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Users, FileText, Briefcase, Image, CreditCard, Tags, Receipt, Clock } from 'lucide-react';
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
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsersCount();
    fetchBlogPostsCount();
    fetchPortfolioProjectsCount();
    fetchHomeBannersCount();
    fetchServiceCardsCount();
    fetchServiceCategoriesCount();
    fetchContactsCount();
    fetchFiscalDataCount();
    fetchRecentActivities();
  }, []);

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

      // Contar projetos inativos
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

      // Contar banners inativos
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

      // Contar cards inativos
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

       // Contar categorias inativas
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

  const fetchRecentActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-brand-gold/10 rounded-lg">
                  <Clock className="h-5 w-5 text-brand-gold" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Atividades Recentes</h2>
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
                          <span className="capitalize">{activity.entity_type}</span>
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
            </CardContent>
          </Card>
        </div>

        {/* Estatísticas Rápidas */}
        <div className="space-y-6">
          <Card className="bg-gradient-to-br from-brand-gold/5 to-brand-gold/10 border-brand-gold/20">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-brand-gold/20 rounded-lg">
                  <Users className="h-5 w-5 text-brand-gold" />
                </div>
                <h3 className="font-bold text-gray-900">Status da Plataforma</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total de Usuários</span>
                  <span className="font-bold text-brand-gold">{usersCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Posts Publicados</span>
                  <span className="font-bold text-brand-gold">{blogPostsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Projetos Ativos</span>
                  <span className="font-bold text-brand-gold">{portfolioProjectsCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Contatos Recebidos</span>
                  <span className="font-bold text-brand-gold">{contactsCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
