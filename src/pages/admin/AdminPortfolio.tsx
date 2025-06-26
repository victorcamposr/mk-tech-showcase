
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, BarChart3, Briefcase, MessageSquare, Star, Search, Filter, RefreshCw, Calendar } from 'lucide-react';
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
  created_at: string;
  updated_at: string;
}

interface PortfolioTestimonial {
  id: string;
  content: string;
  author: string;
  company: string;
  rating: number;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
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

  // Estados para filtros e busca
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState('all');
  const [testimonialSearch, setTestimonialSearch] = useState('');
  const [testimonialFilter, setTestimonialFilter] = useState('all');
  const [loading, setLoading] = useState(false);

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

  // Filtrar dados
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(projectSearch.toLowerCase()) ||
                         project.category.toLowerCase().includes(projectSearch.toLowerCase());
    const matchesFilter = projectFilter === 'all' || project.status === projectFilter;
    return matchesSearch && matchesFilter;
  });

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = testimonial.author.toLowerCase().includes(testimonialSearch.toLowerCase()) ||
                         testimonial.company.toLowerCase().includes(testimonialSearch.toLowerCase());
    const matchesFilter = testimonialFilter === 'all' || testimonial.status === testimonialFilter;
    return matchesSearch && matchesFilter;
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-portfolio-stats'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] }),
        queryClient.invalidateQueries({ queryKey: ['admin-portfolio-testimonials'] })
      ]);
      toast({
        title: "Dados atualizados",
        description: "As informações foram recarregadas com sucesso.",
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: "Erro ao atualizar",
        description: "Não foi possível atualizar os dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`admin-portfolio-${type}`] }),
        queryClient.invalidateQueries({ queryKey: [`portfolio-${type}`] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] }),
        queryClient.refetchQueries({ queryKey: ['dashboard-stats'] })
      ]);
      
      await logAdminActivity(
        'delete',
        `portfolio_${type}`,
        deleteDialog.title
      );
      
      toast({
        title: "Item excluído",
        description: "O item foi removido com sucesso.",
      });
      setDeleteDialog({ open: false, type: '', id: '', title: '' });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o item.",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-brand-gold" />
              Gerenciar Portfólio
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie estatísticas, projetos e depoimentos do portfólio
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              disabled={loading}
              className="shadow-md hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </div>

        <Tabs defaultValue="stats" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white shadow-lg border-0 rounded-xl p-1 h-12">
              <TabsTrigger 
                value="stats" 
                className="data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black rounded-lg font-semibold transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Estatísticas
              </TabsTrigger>
              <TabsTrigger 
                value="projects" 
                className="data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black rounded-lg font-semibold transition-all duration-200"
              >
                <Briefcase className="w-4 h-4 mr-2" />
                Projetos
              </TabsTrigger>
              <TabsTrigger 
                value="testimonials" 
                className="data-[state=active]:bg-brand-gold data-[state=active]:text-brand-black rounded-lg font-semibold transition-all duration-200"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Depoimentos
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Estatísticas */}
          <TabsContent value="stats" className="space-y-6">
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-gold" />
                  Estatísticas do Portfólio
                </CardTitle>
                <CardDescription>
                  Apenas valor e ordem podem ser editados
                </CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
                      <p className="mt-4 text-gray-600">Carregando estatísticas...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stats.filter(stat => stat.key !== 'support').map((stat) => (
                      <div
                        key={stat.id}
                        className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                              <BarChart3 className="w-6 h-6 text-brand-gold" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{stat.label}</h3>
                              <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold mt-1">
                                #{stat.sort_order}
                              </Badge>
                            </div>
                          </div>
                          <Badge 
                            variant={stat.status === 'active' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {stat.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        
                        <div className="text-3xl font-bold text-brand-gold mb-4">
                          {stat.value}{stat.suffix}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit('stats', stat)}
                              className="shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projetos */}
          <TabsContent value="projects" className="space-y-6">
            {/* Search and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar projetos..."
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    className="pl-10 bg-white border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                  />
                </div>
              </div>
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {projects.filter(p => p.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Ativos</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {projects.filter(p => p.status === 'inactive').length}
                    </div>
                    <div className="text-sm text-gray-600">Inativos</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-brand-gold" />
                    Filtros
                  </span>
                  <Button
                    onClick={() => setProjectModalOpen(true)}
                    className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Projeto
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={projectFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProjectFilter('all')}
                    className={projectFilter === 'all' 
                      ? 'bg-brand-gold hover:bg-brand-gold-dark text-white shadow-md' 
                      : 'shadow-md hover:shadow-lg transition-all duration-200'
                    }
                  >
                    Todos
                  </Button>
                  <Button
                    variant={projectFilter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProjectFilter('active')}
                    className={projectFilter === 'active' 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                      : 'shadow-md hover:shadow-lg transition-all duration-200'
                    }
                  >
                    Ativos
                  </Button>
                  <Button
                    variant={projectFilter === 'inactive' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setProjectFilter('inactive')}
                    className={projectFilter === 'inactive' 
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
                      : 'shadow-md hover:shadow-lg transition-all duration-200'
                    }
                  >
                    Inativos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Projects List */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-brand-gold" />
                    Projetos Cadastrados
                  </span>
                  <Badge variant="outline" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                    {filteredProjects.length} projetos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {projectsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
                      <p className="mt-4 text-gray-600">Carregando projetos...</p>
                    </div>
                  </div>
                ) : filteredProjects.length === 0 ? (
                  <div className="text-center py-12">
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {projectSearch || projectFilter !== 'all' ? 'Nenhum projeto encontrado' : 'Nenhum projeto cadastrado'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {projectSearch || projectFilter !== 'all' 
                        ? 'Tente ajustar os filtros.'
                        : 'Comece criando seu primeiro projeto.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredProjects.map((project) => (
                      <div
                        key={project.id}
                        className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                              {project.image_url ? (
                                <img 
                                  src={project.image_url} 
                                  alt="Logo" 
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <Briefcase className="w-6 h-6 text-brand-gold" />
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
                              <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold mt-1">
                                {project.category}
                              </Badge>
                            </div>
                          </div>
                          <Badge 
                            variant={project.status === 'active' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {project.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {project.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(project.created_at)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit('projects', project)}
                              className="shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete('projects', project.id, project.title)}
                              className="shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Depoimentos */}
          <TabsContent value="testimonials" className="space-y-6">
            {/* Search and Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Buscar depoimentos..."
                    value={testimonialSearch}
                    onChange={(e) => setTestimonialSearch(e.target.value)}
                    className="pl-10 bg-white border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                  />
                </div>
              </div>
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {testimonials.filter(t => t.status === 'active').length}
                    </div>
                    <div className="text-sm text-gray-600">Ativos</div>
                  </div>
                </CardContent>
              </Card>
              <Card className="shadow-lg border-0">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {testimonials.filter(t => t.status === 'inactive').length}
                    </div>
                    <div className="text-sm text-gray-600">Inativos</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-brand-gold" />
                    Filtros
                  </span>
                  <Button
                    onClick={() => setTestimonialModalOpen(true)}
                    className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Depoimento
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Button
                    variant={testimonialFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTestimonialFilter('all')}
                    className={testimonialFilter === 'all' 
                      ? 'bg-brand-gold hover:bg-brand-gold-dark text-white shadow-md' 
                      : 'shadow-md hover:shadow-lg transition-all duration-200'
                    }
                  >
                    Todos
                  </Button>
                  <Button
                    variant={testimonialFilter === 'active' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTestimonialFilter('active')}
                    className={testimonialFilter === 'active' 
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                      : 'shadow-md hover:shadow-lg transition-all duration-200'
                    }
                  >
                    Ativos
                  </Button>
                  <Button
                    variant={testimonialFilter === 'inactive' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTestimonialFilter('inactive')}
                    className={testimonialFilter === 'inactive' 
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
                      : 'shadow-md hover:shadow-lg transition-all duration-200'
                    }
                  >
                    Inativos
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Testimonials List */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand-gold" />
                    Depoimentos Cadastrados
                  </span>
                  <Badge variant="outline" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                    {filteredTestimonials.length} depoimentos
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testimonialsLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
                      <p className="mt-4 text-gray-600">Carregando depoimentos...</p>
                    </div>
                  </div>
                ) : filteredTestimonials.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {testimonialSearch || testimonialFilter !== 'all' ? 'Nenhum depoimento encontrado' : 'Nenhum depoimento cadastrado'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {testimonialSearch || testimonialFilter !== 'all' 
                        ? 'Tente ajustar os filtros.'
                        : 'Comece criando seu primeiro depoimento.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredTestimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center">
                              <MessageSquare className="w-6 h-6 text-brand-gold" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900">{testimonial.author}</h3>
                              <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold mt-1">
                                {testimonial.company}
                              </Badge>
                            </div>
                          </div>
                          <Badge 
                            variant={testimonial.status === 'active' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {testimonial.status === 'active' ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        
                        <div className="flex mb-3">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-brand-gold text-brand-gold" />
                          ))}
                        </div>
                        
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4 italic">
                          "{testimonial.content}"
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {formatDate(testimonial.created_at)}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit('testimonials', testimonial)}
                              className="shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete('testimonials', testimonial.id, testimonial.author)}
                              className="shadow-md hover:shadow-lg transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
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
