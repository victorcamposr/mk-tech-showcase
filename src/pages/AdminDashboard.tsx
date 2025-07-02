import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, Users, FileText, Briefcase, Image, CreditCard, Tags, Receipt } from 'lucide-react';
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
  }, []);

  const fetchUsersCount = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count(*)');

      if (error) {
        throw error;
      }

      setUsersCount(data?.[0]?.count || 0);
    } catch (error) {
      console.error('Error fetching users count:', error);
    }
  };

  const fetchBlogPostsCount = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('count(*)');

      if (error) {
        throw error;
      }

      setBlogPostsCount(data?.[0]?.count || 0);
    } catch (error) {
      console.error('Error fetching blog posts count:', error);
    }
  };

  const fetchPortfolioProjectsCount = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('count(*)')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      setPortfolioProjectsCount(data?.[0]?.count || 0);

      // Contar projetos inativos
      const { data: inactiveData, error: inactiveError } = await supabase
        .from('portfolio_projects')
        .select('count(*)')
        .eq('is_active', false);

      if (inactiveError) {
        throw inactiveError;
      }

      setInactivePortfolioProjects(inactiveData?.[0]?.count || 0);

    } catch (error) {
      console.error('Error fetching portfolio projects count:', error);
    }
  };

  const fetchHomeBannersCount = async () => {
    try {
      const { data, error } = await supabase
        .from('home_banners')
        .select('count(*)')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      setHomeBannersCount(data?.[0]?.count || 0);

      // Contar banners inativos
      const { data: inactiveData, error: inactiveError } = await supabase
        .from('home_banners')
        .select('count(*)')
        .eq('is_active', false);

      if (inactiveError) {
        throw inactiveError;
      }

      setInactiveHomeBanners(inactiveData?.[0]?.count || 0);

    } catch (error) {
      console.error('Error fetching home banners count:', error);
    }
  };

  const fetchServiceCardsCount = async () => {
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .select('count(*)')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      setServiceCardsCount(data?.[0]?.count || 0);

      // Contar cards inativos
      const { data: inactiveData, error: inactiveError } = await supabase
        .from('service_cards')
        .select('count(*)')
        .eq('is_active', false);

      if (inactiveError) {
        throw inactiveError;
      }

      setInactiveServiceCards(inactiveData?.[0]?.count || 0);

    } catch (error) {
      console.error('Error fetching service cards count:', error);
    }
  };

  const fetchServiceCategoriesCount = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('count(*)')
        .eq('is_active', true);

      if (error) {
        throw error;
      }

      setServiceCategoriesCount(data?.[0]?.count || 0);

       // Contar categorias inativas
       const { data: inactiveData, error: inactiveError } = await supabase
       .from('service_categories')
       .select('count(*)')
       .eq('is_active', false);

     if (inactiveError) {
       throw inactiveError;
     }

     setInactiveServiceCategories(inactiveData?.[0]?.count || 0);

    } catch (error) {
      console.error('Error fetching service categories count:', error);
    }
  };

  const fetchContactsCount = async () => {
    try {
      const { data, error } = await supabase
        .from('contacts')
        .select('count(*)');

      if (error) {
        throw error;
      }

      setContactsCount(data?.[0]?.count || 0);
    } catch (error) {
      console.error('Error fetching contacts count:', error);
    }
  };

  const fetchFiscalDataCount = async () => {
    try {
      const { data, error } = await supabase
        .from('fiscal_data')
        .select('count(*)');

      if (error) {
        throw error;
      }

      setFiscalDataCount(data?.[0]?.count || 0);
    } catch (error) {
      console.error('Error fetching fiscal data count:', error);
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
        <Card className="bg-gray-50/50 border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => navigate('/admin/fiscal-data')}>
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

      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
