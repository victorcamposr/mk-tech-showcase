
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Lightbulb, TrendingUp, BarChart3, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPosts: 0,
    publishedPosts: 0,
    totalSolutions: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      // Get users count
      const { count: usersCount } = await supabase
        .from('admin_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Get posts count
      const { count: postsCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true });

      // Get published posts count
      const { count: publishedCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published');

      // Get solutions count
      const { count: solutionsCount } = await supabase
        .from('solutions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      setStats({
        totalUsers: usersCount || 0,
        totalPosts: postsCount || 0,
        publishedPosts: publishedCount || 0,
        totalSolutions: solutionsCount || 0
      });
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Usuários Administrativos',
      value: stats.totalUsers,
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Posts do Blog',
      value: stats.totalPosts,
      icon: FileText,
      gradient: 'from-green-500 to-green-600',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'Posts Publicados',
      value: stats.publishedPosts,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-purple-600',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Soluções Ativas',
      value: stats.totalSolutions,
      icon: Lightbulb,
      gradient: 'from-brand-gold to-brand-gold-light',
      iconBg: 'bg-brand-gold/10',
      iconColor: 'text-brand-gold'
    }
  ];

  const quickActions = [
    {
      title: 'Gerenciar Usuários',
      description: 'Adicionar e gerenciar usuários administrativos',
      icon: Users,
      href: '/admin/users',
      color: 'blue'
    },
    {
      title: 'Criar Post',
      description: 'Escrever novo artigo para o blog',
      icon: FileText,
      href: '/admin/blog',
      color: 'green'
    },
    {
      title: 'Gerenciar Soluções',
      description: 'Atualizar catálogo de soluções',
      icon: Lightbulb,
      href: '/admin/solutions',
      color: 'purple'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header com gradiente */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-gold via-brand-gold-light to-brand-gold p-8">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold text-brand-black mb-3">
              Dashboard Administrativo
            </h1>
            <p className="text-brand-black/80 text-lg">
              Bem-vindo ao painel de controle da MK Tecnologia
            </p>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-[0.02]`}></div>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-xl ${stat.iconBg}`}>
                    <IconComponent className={`w-5 h-5 ${stat.iconColor}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className={`w-full h-1 bg-gradient-to-r ${stat.gradient} rounded-full opacity-20`}></div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            const colorMap = {
              blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'text-blue-600', hover: 'hover:bg-blue-100' },
              green: { bg: 'bg-green-50', border: 'border-green-200', icon: 'text-green-600', hover: 'hover:bg-green-100' },
              purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'text-purple-600', hover: 'hover:bg-purple-100' }
            };
            const colors = colorMap[action.color as keyof typeof colorMap];
            
            return (
              <Card key={index} className={`${colors.bg} ${colors.border} border-2 ${colors.hover} transition-all duration-200 cursor-pointer hover:shadow-md`}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <IconComponent className={`w-8 h-8 ${colors.icon}`} />
                    <div>
                      <CardTitle className="text-lg text-gray-900">{action.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <BarChart3 className="w-5 h-5 text-brand-gold" />
                Visão Geral do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Conteúdo Publicado</span>
                  <span className="font-semibold text-gray-900">{stats.publishedPosts} posts</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Soluções Disponíveis</span>
                  <span className="font-semibold text-gray-900">{stats.totalSolutions} soluções</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Administradores Ativos</span>
                  <span className="font-semibold text-gray-900">{stats.totalUsers} usuários</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Settings className="w-5 h-5 text-brand-gold" />
                Ações Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Backup do Sistema</div>
                  <div className="text-sm text-gray-600">Fazer backup dos dados</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Relatórios</div>
                  <div className="text-sm text-gray-600">Gerar relatórios de uso</div>
                </button>
                <button className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="font-medium text-gray-900">Configurações</div>
                  <div className="text-sm text-gray-600">Ajustar configurações do sistema</div>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
