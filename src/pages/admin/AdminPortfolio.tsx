
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  BarChart3,
  MessageSquare,
  Star,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

interface PortfolioProject {
  id: string;
  title: string;
  category: string;
  description: string;
  results: string[];
  image_url?: string;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
}

interface PortfolioStat {
  id: string;
  key: string;
  label: string;
  value: number;
  suffix: string;
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
  const [projects, setProjects] = useState<PortfolioProject[]>([]);
  const [stats, setStats] = useState<PortfolioStat[]>([]);
  const [testimonials, setTestimonials] = useState<PortfolioTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; type: string; id: string; title: string }>({
    isOpen: false,
    type: '',
    id: '',
    title: ''
  });
  const [activeTab, setActiveTab] = useState<'projects' | 'stats' | 'testimonials'>('projects');
  const { toast } = useToast();

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const [projectsRes, statsRes, testimonialsRes] = await Promise.all([
        supabase
          .from('portfolio_projects')
          .select('*')
          .order('sort_order', { ascending: true }),
        supabase
          .from('portfolio_stats')
          .select('*')
          .order('sort_order', { ascending: true }),
        supabase
          .from('portfolio_testimonials')
          .select('*')
          .order('sort_order', { ascending: true })
      ]);

      if (projectsRes.error) throw projectsRes.error;
      if (statsRes.error) throw statsRes.error;
      if (testimonialsRes.error) throw testimonialsRes.error;

      setProjects((projectsRes.data || []) as PortfolioProject[]);
      setStats((statsRes.data || []) as PortfolioStat[]);
      setTestimonials((testimonialsRes.data || []) as PortfolioTestimonial[]);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados do portfólio.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (type: string, id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      let tableName: 'portfolio_projects' | 'portfolio_stats' | 'portfolio_testimonials';
      
      if (type === 'projects') {
        tableName = 'portfolio_projects';
      } else if (type === 'stats') {
        tableName = 'portfolio_stats';
      } else {
        tableName = 'portfolio_testimonials';
      }

      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `${type === 'projects' ? 'Projeto' : type === 'stats' ? 'Estatística' : 'Depoimento'} ${newStatus === 'active' ? 'ativado' : 'desativado'}`,
        description: `O item foi ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
      });

      fetchPortfolioData();
    } catch (error: any) {
      console.error('Error toggling status:', error);
      toast({
        title: "Erro ao alterar status",
        description: error.message || "Não foi possível alterar o status do item.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    const { type, id } = deleteDialog;
    
    try {
      let tableName: 'portfolio_projects' | 'portfolio_stats' | 'portfolio_testimonials';
      
      if (type === 'projects') {
        tableName = 'portfolio_projects';
      } else if (type === 'stats') {
        tableName = 'portfolio_stats';
      } else {
        tableName = 'portfolio_testimonials';
      }

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `${type === 'projects' ? 'Projeto' : type === 'stats' ? 'Estatística' : 'Depoimento'} excluído`,
        description: "O item foi excluído com sucesso.",
      });

      setDeleteDialog({ isOpen: false, type: '', id: '', title: '' });
      fetchPortfolioData();
    } catch (error: any) {
      console.error('Error deleting item:', error);
      toast({
        title: "Erro ao excluir",
        description: error.message || "Não foi possível excluir o item.",
        variant: "destructive",
      });
    }
  };

  const updateSortOrder = async (type: string, id: string, direction: 'up' | 'down') => {
    const items = type === 'projects' ? projects : type === 'stats' ? stats : testimonials;
    const currentIndex = items.findIndex((item: any) => item.id === id);
    
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === items.length - 1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    const currentItem = items[currentIndex];
    const swapItem = items[newIndex];

    try {
      let tableName: 'portfolio_projects' | 'portfolio_stats' | 'portfolio_testimonials';
      
      if (type === 'projects') {
        tableName = 'portfolio_projects';
      } else if (type === 'stats') {
        tableName = 'portfolio_stats';
      } else {
        tableName = 'portfolio_testimonials';
      }

      await Promise.all([
        supabase
          .from(tableName)
          .update({ sort_order: swapItem.sort_order })
          .eq('id', currentItem.id),
        supabase
          .from(tableName)
          .update({ sort_order: currentItem.sort_order })
          .eq('id', swapItem.id)
      ]);

      fetchPortfolioData();
    } catch (error: any) {
      console.error('Error updating sort order:', error);
      toast({
        title: "Erro ao reordenar",
        description: "Não foi possível alterar a ordem do item.",
        variant: "destructive",
      });
    }
  };

  const renderProjects = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projetos em Destaque</h3>
        <Button className="bg-brand-gold hover:bg-brand-gold-dark text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>
      
      {projects.map((project, index) => (
        <Card key={project.id} className="border-brand-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                {project.image_url ? (
                  <img src={project.image_url} alt={project.title} className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-brand-gold" />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-brand-black">{project.title}</h4>
                    <Badge variant="outline" className="text-xs">{project.category}</Badge>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{project.description}</p>
                  <div className="text-xs text-gray-500">
                    {project.results.length} resultados • Ordem: {project.sort_order}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSortOrder('projects', project.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSortOrder('projects', project.id, 'down')}
                  disabled={index === projects.length - 1}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStatus('projects', project.id, project.status)}
                >
                  {project.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteDialog({
                    isOpen: true,
                    type: 'projects',
                    id: project.id,
                    title: project.title
                  })}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderStats = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Estatísticas</h3>
        <Button className="bg-brand-gold hover:bg-brand-gold-dark text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nova Estatística
        </Button>
      </div>
      
      {stats.map((stat, index) => (
        <Card key={stat.id} className="border-brand-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-brand-black">{stat.label}</h4>
                    <Badge variant={stat.status === 'active' ? 'default' : 'secondary'}>
                      {stat.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Valor: {stat.value}{stat.suffix} • Ordem: {stat.sort_order}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSortOrder('stats', stat.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSortOrder('stats', stat.id, 'down')}
                  disabled={index === stats.length - 1}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStatus('stats', stat.id, stat.status)}
                >
                  {stat.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteDialog({
                    isOpen: true,
                    type: 'stats',
                    id: stat.id,
                    title: stat.label
                  })}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTestimonials = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Depoimentos</h3>
        <Button className="bg-brand-gold hover:bg-brand-gold-dark text-white">
          <Plus className="w-4 h-4 mr-2" />
          Novo Depoimento
        </Button>
      </div>
      
      {testimonials.map((testimonial, index) => (
        <Card key={testimonial.id} className="border-brand-gold/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="w-12 h-12 bg-brand-gold/20 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-brand-black">{testimonial.author}</h4>
                    <div className="flex">
                      {Array.from({ length: testimonial.rating }, (_, i) => (
                        <Star key={i} className="w-3 h-3 text-brand-gold fill-current" />
                      ))}
                    </div>
                    <Badge variant={testimonial.status === 'active' ? 'default' : 'secondary'}>
                      {testimonial.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{testimonial.company}</p>
                  <p className="text-xs text-gray-500 line-clamp-2">{testimonial.content}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSortOrder('testimonials', testimonial.id, 'up')}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateSortOrder('testimonials', testimonial.id, 'down')}
                  disabled={index === testimonials.length - 1}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleStatus('testimonials', testimonial.id, testimonial.status)}
                >
                  {testimonial.status === 'active' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDeleteDialog({
                    isOpen: true,
                    type: 'testimonials',
                    id: testimonial.id,
                    title: testimonial.author
                  })}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados do portfólio...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-xl flex items-center justify-center shadow-lg">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            Gerenciar Portfólio
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie projetos, estatísticas e depoimentos do portfólio
          </p>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('projects')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'projects'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Projetos ({projects.length})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Estatísticas ({stats.length})
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'testimonials'
                  ? 'border-brand-gold text-brand-gold'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Depoimentos ({testimonials.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <Card className="shadow-lg border-brand-gold/20">
          <CardContent className="p-6">
            {activeTab === 'projects' && renderProjects()}
            {activeTab === 'stats' && renderStats()}
            {activeTab === 'testimonials' && renderTestimonials()}
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() => setDeleteDialog({ isOpen: false, type: '', id: '', title: '' })}
          onConfirm={handleDelete}
          title="Confirmar Exclusão"
          description={`Tem certeza que deseja excluir "${deleteDialog.title}"? Esta ação não pode ser desfeita.`}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
