
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  FileText, 
  Lightbulb, 
  TrendingUp, 
  Calendar,
  BarChart3,
  ArrowRight,
  Plus,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    posts: 0,
    solutions: 0,
    activeSolutions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersResult, postsResult, solutionsResult] = await Promise.all([
        supabase.from('admin_profiles').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact' }),
        supabase.from('solutions').select('id, status', { count: 'exact' }),
      ]);

      const activeSolutions = solutionsResult.data?.filter(s => s.status === 'active').length || 0;

      setStats({
        users: usersResult.count || 0,
        posts: postsResult.count || 0,
        solutions: solutionsResult.count || 0,
        activeSolutions,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: "Gerenciar Usuários",
      description: "Criar e gerenciar administradores do sistema",
      icon: Users,
      link: "/admin/users",
      color: "from-blue-500 to-blue-600",
      count: stats.users,
    },
    {
      title: "Criar Post",
      description: "Adicionar novo artigo ao blog",
      icon: FileText,
      link: "/admin/blog",
      color: "from-green-500 to-green-600",
      count: stats.posts,
    },
    {
      title: "Gerenciar Soluções",
      description: "Administrar catálogo de soluções",
      icon: Lightbulb,
      link: "/admin/solutions",
      color: "from-purple-500 to-purple-600",
      count: stats.solutions,
    },
  ];

  const recentActivities = [
    {
      type: "user",
      message: "Novo administrador cadastrado",
      time: "2 horas atrás",
      icon: Users,
    },
    {
      type: "post",
      message: "Post 'Tecnologia no Varejo' publicado",
      time: "5 horas atrás",
      icon: FileText,
    },
    {
      type: "solution",
      message: "Solução 'PDV Frente de Caixa' atualizada",
      time: "1 dia atrás",
      icon: Lightbulb,
    },
  ];

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
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-brand-gold" />
              Dashboard Administrativo
            </h1>
            <p className="text-gray-600 mt-2">
              Bem-vindo ao painel de controle da MK Tecnologia
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            {new Date().toLocaleDateString('pt-BR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Administradores</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-l-green-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Posts do Blog</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.posts}</p>
                </div>
                <FileText className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Soluções Total</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.solutions}</p>
                </div>
                <Lightbulb className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0 bg-gradient-to-br from-brand-gold/20 to-brand-gold-light/20 border-l-4 border-l-brand-gold">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-brand-gold-dark text-sm font-medium">Soluções Ativas</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeSolutions}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-brand-gold" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-brand-gold/10 to-brand-gold-light/10">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Settings className="w-6 h-6 text-brand-gold" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {quickActions.map((action, index) => {
                const IconComponent = action.icon;
                return (
                  <Link key={index} to={action.link} className="group">
                    <div className={`p-6 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}>
                      <div className="flex items-center justify-between mb-4">
                        <IconComponent className="w-8 h-8" />
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                      <p className="text-sm opacity-90 mb-3">{action.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{action.count}</span>
                        <Plus className="w-5 h-5 opacity-75" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-gold" />
                Atividades Recentes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivities.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="p-2 bg-white rounded-full shadow-sm">
                      <IconComponent className="w-4 h-4 text-brand-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-brand-gold" />
                Resumo do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Taxa de Soluções Ativas</span>
                  <span className="text-lg font-bold text-blue-600">
                    {stats.solutions > 0 ? Math.round((stats.activeSolutions / stats.solutions) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total de Conteúdo</span>
                  <span className="text-lg font-bold text-green-600">{stats.posts + stats.solutions}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Administradores Ativos</span>
                  <span className="text-lg font-bold text-purple-600">{stats.users}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
