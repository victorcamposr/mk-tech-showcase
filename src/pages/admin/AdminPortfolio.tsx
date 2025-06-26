import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, BarChart3, Briefcase, MessageSquare, Star } from 'lucide-react';
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header com gradiente */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-2xl mb-6 shadow-lg">
              <Briefcase className="w-8 h-8 text-brand-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">
              Gerenciar <span className="text-brand-gold">Portfólio</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gerencie as estatísticas, projetos e depoimentos que destacam o sucesso da sua empresa
            </p>
          </div>

          <Tabs defaultValue="stats" className="space-y-8">
            <div className="flex justify-center">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-white shadow-lg border-2 border-brand-gold/20">
                <TabsTrigger value="stats" className="flex items-center gap-2 data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black">
                  <BarChart3 className="w-4 h-4" />
                  Estatísticas
                </TabsTrigger>
                <TabsTrigger value="projects" className="flex items-center gap-2 data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black">
                  <Briefcase className="w-4 h-4" />
                  Projetos
                </TabsTrigger>
                <TabsTrigger value="testimonials" className="flex items-center gap-2 data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black">
                  <MessageSquare className="w-4 h-4" />
                  Depoimentos
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Estatísticas */}
            <TabsContent value="stats" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-brand-black mb-2">Estatísticas do Portfólio</h2>
                <p className="text-gray-600 mb-8">Apenas valor e ordem podem ser editados</p>
              </div>

              {statsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {stats.map((stat) => (
                    <Card key={stat.id} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-2 group bg-gradient-to-br from-white to-gray-50/50">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-xl flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-brand-black" />
                          </div>
                          <Badge variant={stat.status === 'active' ? 'default' : 'secondary'} className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                            {stat.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <CardTitle className="text-xl text-brand-black group-hover:text-brand-gold transition-colors">{stat.label}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-4xl font-bold text-brand-gold mb-6">
                          {stat.value}{stat.suffix}
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit('stats', stat)}
                            className="flex-1 border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Projetos */}
            <TabsContent value="projects" className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <h2 className="text-3xl font-bold text-brand-black mb-2">Projetos em Destaque</h2>
                  <p className="text-gray-600">Showcase dos seus melhores projetos e resultados</p>
                </div>
                <Button 
                  onClick={() => setProjectModalOpen(true)} 
                  className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Projeto
                </Button>
              </div>

              {projectsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {projects.map((project) => (
                    <Card key={project.id} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-2 group bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
                      {/* Banner de imagem */}
                      <div className="h-40 overflow-hidden relative">
                        {project.image_url ? (
                          <img 
                            src={project.image_url} 
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-brand-gold/20 to-brand-gold/30 flex items-center justify-center">
                            <Briefcase className="w-12 h-12 text-brand-gold" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                        <Badge 
                          variant={project.status === 'active' ? 'default' : 'secondary'} 
                          className="absolute top-3 right-3 bg-brand-gold/90 text-brand-black border-0"
                        >
                          {project.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      
                      <CardHeader className="pb-3">
                        <div className="mb-2">
                          <div className="text-sm text-brand-gold font-semibold mb-1">{project.category}</div>
                          <CardTitle className="text-lg font-bold text-brand-black group-hover:text-brand-gold transition-colors">
                            {project.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="text-sm text-gray-600 line-clamp-2">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit('projects', project)}
                            className="flex-1 border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete('projects', project.id, project.title)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
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
            <TabsContent value="testimonials" className="space-y-8">
              <div className="flex justify-between items-center">
                <div className="text-center flex-1">
                  <h2 className="text-3xl font-bold text-brand-black mb-2">Depoimentos de Clientes</h2>
                  <p className="text-gray-600">Feedbacks que comprovam a qualidade do seu trabalho</p>
                </div>
                <Button 
                  onClick={() => setTestimonialModalOpen(true)} 
                  className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold shadow-lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Depoimento
                </Button>
              </div>

              {testimonialsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {testimonials.map((testimonial) => (
                    <Card key={testimonial.id} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-2 group bg-gradient-to-br from-white to-gray-50/50">
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-xl flex items-center justify-center">
                            <MessageSquare className="w-6 h-6 text-brand-black" />
                          </div>
                          <Badge variant={testimonial.status === 'active' ? 'default' : 'secondary'} className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                            {testimonial.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div>
                          <CardTitle className="text-lg text-brand-black group-hover:text-brand-gold transition-colors">{testimonial.author}</CardTitle>
                          <CardDescription className="text-brand-gold font-medium">{testimonial.company}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mb-6 line-clamp-3 italic">"{testimonial.content}"</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit('testimonials', testimonial)}
                            className="flex-1 border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete('testimonials', testimonial.id, testimonial.author)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
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
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
