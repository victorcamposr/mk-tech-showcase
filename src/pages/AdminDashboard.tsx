
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Mail, 
  FileText, 
  Briefcase, 
  MessageSquare,
  BarChart3,
  Star,
  Activity
} from 'lucide-react';

const AdminDashboard = () => {
  // Carregar estatísticas gerais
  const { data: stats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const [usersRes, contactsRes, postsRes, solutionsRes, projectsRes, testimonialsRes] = await Promise.all([
        supabase.from('admin_profiles').select('id', { count: 'exact' }),
        supabase.from('contacts').select('id', { count: 'exact' }),
        supabase.from('blog_posts').select('id', { count: 'exact' }),
        supabase.from('solutions').select('id', { count: 'exact' }),
        supabase.from('portfolio_projects').select('id', { count: 'exact' }),
        supabase.from('portfolio_testimonials').select('id', { count: 'exact' })
      ]);

      return {
        users: usersRes.count || 0,
        contacts: contactsRes.count || 0,
        posts: postsRes.count || 0,
        solutions: solutionsRes.count || 0,
        projects: projectsRes.count || 0,
        testimonials: testimonialsRes.count || 0
      };
    }
  });

  // Carregar atividades recentes
  const { data: activities = [] } = useQuery({
    queryKey: ['admin-activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('admin_activities')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data;
    }
  });

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'create': return 'Criou';
      case 'update': return 'Atualizou';
      case 'delete': return 'Excluiu';
      default: return action;
    }
  };

  const getEntityLabel = (entityType: string) => {
    switch (entityType) {
      case 'blog_posts': return 'Post do Blog';
      case 'solutions': return 'Solução';
      case 'admin_profiles': return 'Usuário';
      case 'portfolio_projects': return 'Projeto';
      case 'portfolio_testimonials': return 'Depoimento';
      case 'portfolio_stats': return 'Estatística';
      default: return entityType;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-brand-black">Dashboard</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema administrativo</p>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.users || 0}</div>
              <p className="text-xs text-muted-foreground">Administradores cadastrados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contatos</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.contacts || 0}</div>
              <p className="text-xs text-muted-foreground">Mensagens recebidas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Posts do Blog</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.posts || 0}</div>
              <p className="text-xs text-muted-foreground">Artigos publicados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Soluções</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.solutions || 0}</div>
              <p className="text-xs text-muted-foreground">Produtos disponíveis</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projetos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.projects || 0}</div>
              <p className="text-xs text-muted-foreground">Cases de sucesso</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Depoimentos</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.testimonials || 0}</div>
              <p className="text-xs text-muted-foreground">Avaliações de clientes</p>
            </CardContent>
          </Card>
        </div>

        {/* Atividades recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhuma atividade recente</p>
              ) : (
                activities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between border-b pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-brand-gold rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium">
                          {activity.user_name || 'Admin'} {getActionLabel(activity.action_type)} {getEntityLabel(activity.entity_type)}
                        </p>
                        {activity.entity_title && (
                          <p className="text-xs text-gray-500">"{activity.entity_title}"</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {new Date(activity.created_at).toLocaleDateString('pt-BR')}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(activity.created_at).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
