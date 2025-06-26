
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BarChart3, Briefcase, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PortfolioStatsModal from '@/components/admin/PortfolioStatsModal';
import PortfolioProjectModal from '@/components/admin/PortfolioProjectModal';
import PortfolioTestimonialModal from '@/components/admin/PortfolioTestimonialModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { logAdminActivity } from '@/utils/adminActivity';

interface PortfolioStat {
  id: string;
  key: string;
  label: string;
  value: number;
  suffix: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  results: string[];
  image_url: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface PortfolioTestimonial {
  id: string;
  content: string;
  author: string;
  company: string;
  rating: number;
  sort_order: number;
  status: 'active' | 'inactive';
}

const AdminPortfolio = () => {
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [testimonialModalOpen, setTestimonialModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: string; id: string; title: string }>({
    open: false,
    type: '',
    id: '',
    title: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Carregar dados
  const { data: stats = [], isLoading: statsLoading } = useQuery({
    queryKey: ['admin-portfolio-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_stats')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as PortfolioStat[];
    }
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['admin-portfolio-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as PortfolioProject[];
    }
  });

  const { data: testimonials = [], isLoading: testimonialsLoading } = useQuery({
    queryKey: ['admin-portfolio-testimonials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolio_testimonials')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as PortfolioTestimonial[];
    }
  });

  // Mutações para deletar
  const deleteMutation = useMutation({
    mutationFn: async ({ type, id }: { type: string; id: string }) => {
      if (type === 'projects') {
        const { error } = await supabase.from('portfolio_projects').delete().eq('id', id);
        if (error) throw error;
      } else if (type === 'testimonials') {
        const { error } = await supabase.from('portfolio_testimonials').delete().eq('id', id);
        if (error) throw error;
      } else {
        throw new Error('Invalid type');
      }
    },
    onSuccess: async (_, { type }) => {
      console.log(`Portfolio ${type} deleted, invalidating all related queries...`);
      
      // Invalidar queries específicas e dashboard
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`admin-portfolio-${type}`] }),
        queryClient.invalidateQueries({ queryKey: [`portfolio-${type}`] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
        queryClient.refetchQueries({ queryKey: ['dashboard-stats'] })
      ]);
      
      console.log('All queries invalidated and dashboard refetched after deletion');
      
      // Log admin activity
      await logAdminActivity(
        'delete',
        `portfolio_${type}`,
        deleteDialog.title
      );
      
      toast({
        title: "Item excluído com sucesso!",
        description: "O item foi removido do portfólio e o sistema foi atualizado.",
      });
      setDeleteDialog({ open: false, type: '', id: '', title: '' });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o item. Tente novamente.",
      });
      console.error('Error deleting item:', error);
    }
  });

  const handleEdit = (type: string, item: any) => {
    setEditingItem(item);
    if (type === 'stats') setStatsModalOpen(true);
    else if (type === 'projects') setProjectModalOpen(true);
    else if (type === 'testimonials') setTestimonialModalOpen(true);
  };

  const handleDelete = (type: string, id: string, title: string) => {
    setDeleteDialog({ open: true, type, id, title });
  };

  const confirmDelete = () => {
    deleteMutation.mutate({ type: deleteDialog.type, id: deleteDialog.id });
  };

  const handleCloseModal = () => {
    setStatsModalOpen(false);
    setProjectModalOpen(false);
    setTestimonialModalOpen(false);
    setEditingItem(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-black">Gerenciar Portfólio</h1>
            <p className="text-gray-600 mt-2">Gerencie as estatísticas, projetos e depoimentos do portfólio</p>
          </div>
        </div>

        <Tabs defaultValue="stats" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Estatísticas
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Projetos
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Depoimentos
            </TabsTrigger>
          </TabsList>

          {/* Estatísticas */}
          <TabsContent value="stats" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Estatísticas do Portfólio</h2>
              <p className="text-sm text-gray-500">Apenas valor e ordem podem ser editados</p>
            </div>

            {statsLoading ? (
              <div>Carregando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => (
                  <Card key={stat.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{stat.label}</CardTitle>
                        <Badge variant={stat.status === 'active' ? 'default' : 'secondary'}>
                          {stat.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-brand-gold mb-4">
                        {stat.value}{stat.suffix}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit('stats', stat)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Projetos */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Projetos em Destaque</h2>
              <Button onClick={() => setProjectModalOpen(true)} className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black">
                <Plus className="w-4 h-4 mr-2" />
                Novo Projeto
              </Button>
            </div>

            {projectsLoading ? (
              <div>Carregando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <CardDescription>{project.category}</CardDescription>
                        </div>
                        <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                          {project.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit('projects', project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete('projects', project.id, project.title)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Depoimentos */}
          <TabsContent value="testimonials" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Depoimentos de Clientes</h2>
              <Button onClick={() => setTestimonialModalOpen(true)} className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black">
                <Plus className="w-4 h-4 mr-2" />
                Novo Depoimento
              </Button>
            </div>

            {testimonialsLoading ? (
              <div>Carregando...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((testimonial) => (
                  <Card key={testimonial.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{testimonial.author}</CardTitle>
                          <CardDescription>{testimonial.company}</CardDescription>
                        </div>
                        <Badge variant={testimonial.status === 'active' ? 'default' : 'secondary'}>
                          {testimonial.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-brand-gold">⭐</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">"{testimonial.content}"</p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit('testimonials', testimonial)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete('testimonials', testimonial.id, testimonial.author)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <PortfolioStatsModal
          open={statsModalOpen}
          onClose={handleCloseModal}
          editingItem={editingItem}
        />
        
        <PortfolioProjectModal
          open={projectModalOpen}
          onClose={handleCloseModal}
          editingItem={editingItem}
        />
        
        <PortfolioTestimonialModal
          open={testimonialModalOpen}
          onClose={handleCloseModal}
          editingItem={editingItem}
        />

        <DeleteConfirmDialog
          isOpen={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, type: '', id: '', title: '' })}
          onConfirm={confirmDelete}
          title="Confirmar Exclusão"
          description={`Tem certeza que deseja excluir "${deleteDialog.title}"? Esta ação não pode ser desfeita.`}
          loading={deleteMutation.isPending}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
