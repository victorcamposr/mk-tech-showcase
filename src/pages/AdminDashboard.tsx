
import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Users, FileText, Lightbulb, TrendingUp } from 'lucide-react';

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
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/20'
    },
    {
      title: 'Posts do Blog',
      value: stats.totalPosts,
      icon: FileText,
      color: 'text-green-400',
      bgColor: 'bg-green-400/20'
    },
    {
      title: 'Posts Publicados',
      value: stats.publishedPosts,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400/20'
    },
    {
      title: 'Soluções Ativas',
      value: stats.totalSolutions,
      icon: Lightbulb,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/20'
    }
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard Administrativo</h1>
          <p className="text-gray-300">Visão geral do sistema MK Tecnologia</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white/10 backdrop-blur-xl border-brand-gold/30 hover:border-brand-gold/50 transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-300">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Welcome Card */}
        <Card className="bg-gradient-to-r from-brand-gold/10 to-brand-gold-light/10 border-brand-gold/30">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Bem-vindo ao Painel Administrativo</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 mb-4">
              Gerencie todo o conteúdo do site MK Tecnologia através deste painel. 
              Você pode criar e editar posts do blog, gerenciar soluções e administrar usuários.
            </p>
            <div className="space-y-2 text-gray-300">
              <p><strong className="text-brand-gold">Blog:</strong> Crie e publique artigos sobre tecnologia e soluções</p>
              <p><strong className="text-brand-gold">Soluções:</strong> Gerencie as soluções oferecidas pela empresa</p>
              <p><strong className="text-brand-gold">Usuários:</strong> Controle o acesso administrativo</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
