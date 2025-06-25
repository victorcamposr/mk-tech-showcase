
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SolutionModal from '@/components/admin/SolutionModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Lightbulb,
  Filter,
  RefreshCw,
  Calculator,
  Users,
  BarChart3,
  Shield,
  Zap,
  Settings,
  FileText,
  Database,
  Globe,
  Smartphone
} from 'lucide-react';

interface AdminSolution {
  id: string;
  title: string;
  description: string;
  key: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  icon_name: string;
  features: string[];
  benefits: string[];
  industries: string[];
  card_image_url: string | null;
  hero_image_url: string | null;
  sort_order: number | null;
}

const AdminSolutions = () => {
  const [solutions, setSolutions] = useState<AdminSolution[]>([]);
  const [filteredSolutions, setFilteredSolutions] = useState<AdminSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<AdminSolution | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const { toast } = useToast();

  // Icon mapping
  const iconMap: Record<string, any> = {
    calculator: Calculator,
    users: Users,
    'bar-chart-3': BarChart3,
    shield: Shield,
    zap: Zap,
    settings: Settings,
    'file-text': FileText,
    database: Database,
    globe: Globe,
    smartphone: Smartphone,
    lightbulb: Lightbulb,
  };

  const getIcon = (iconName: string) => {
    return iconMap[iconName] || Lightbulb;
  };

  useEffect(() => {
    fetchSolutions();
  }, []);

  useEffect(() => {
    filterSolutions();
  }, [solutions, searchTerm, statusFilter]);

  const fetchSolutions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      const typedSolutions = (data || []).map(solution => ({
        ...solution,
        status: solution.status as 'active' | 'inactive'
      }));

      setSolutions(typedSolutions);
    } catch (error: any) {
      console.error('Error fetching solutions:', error);
      toast({
        title: "Erro ao carregar soluções",
        description: error.message || "Não foi possível carregar as soluções.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterSolutions = () => {
    let filtered = solutions;

    if (searchTerm) {
      filtered = filtered.filter(solution =>
        solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solution.key.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(solution => solution.status === statusFilter);
    }

    setFilteredSolutions(filtered);
  };

  const handleCreate = () => {
    setSelectedSolution(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleView = (solution: AdminSolution) => {
    setSelectedSolution(solution);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEdit = (solution: AdminSolution) => {
    setSelectedSolution(solution);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDelete = (solution: AdminSolution) => {
    setSelectedSolution(solution);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedSolution) return;

    try {
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', selectedSolution.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Solução excluída",
        description: "A solução foi excluída com sucesso.",
      });

      fetchSolutions();
    } catch (error: any) {
      console.error('Error deleting solution:', error);
      toast({
        title: "Erro ao excluir solução",
        description: error.message || "Não foi possível excluir a solução.",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSolution(null);
    }
  };

  const handleModalSuccess = () => {
    fetchSolutions();
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand-black flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-brand-gold to-brand-gold-dark rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              Soluções
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie as soluções disponéveis no sistema
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchSolutions}
              variant="outline"
              size="sm"
              className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleCreate}
              size="sm"
              className="bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Solução
            </Button>
          </div>
        </div>

        {/* Filters Card */}
        <Card className="border-brand-gold/20">
          <CardHeader className="pb-3 bg-gradient-to-r from-brand-gold/5 to-brand-gold/10">
            <CardTitle className="text-lg flex items-center gap-2 text-brand-black">
              <Filter className="w-5 h-5 text-brand-gold" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gold w-4 h-4" />
                  <Input
                    placeholder="Buscar soluções..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-brand-gold/30 focus:border-brand-gold focus:ring-brand-gold/20"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-brand-gold hover:bg-brand-gold-dark text-brand-black' : 'border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10'}
                >
                  Todas
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-green-300 text-green-600 hover:bg-green-50'}
                >
                  Ativas
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter('inactive')}
                  className={statusFilter === 'inactive' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-red-300 text-red-600 hover:bg-red-50'}
                >
                  Inativas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solutions Table */}
        <Card className="border-brand-gold/20">
          <CardHeader className="pb-3 bg-gradient-to-r from-brand-gold/5 to-brand-gold/10">
            <CardTitle className="text-lg flex items-center justify-between text-brand-black">
              <span>Soluções Cadastradas</span>
              <Badge variant="outline" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">{filteredSolutions.length} soluções</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold mx-auto"></div>
                <p className="mt-2 text-gray-600">Carregando soluções...</p>
              </div>
            ) : filteredSolutions.length === 0 ? (
              <div className="text-center py-8">
                <Lightbulb className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-brand-black mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhuma solução encontrada' : 'Nenhuma solução cadastrada'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar o que procura.'
                    : 'Comece criando sua primeira solução.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={handleCreate} size="sm" className="bg-gradient-to-r from-brand-gold to-brand-gold-dark hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Solução
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredSolutions.map((solution) => {
                  const Icon = getIcon(solution.icon_name);
                  return (
                    <div key={solution.id} className="p-4 hover:bg-brand-gold/5 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-brand-gold/20 to-brand-gold/30 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-brand-gold" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-base font-semibold text-brand-black truncate">
                                {solution.title}
                              </h3>
                              <Badge 
                                variant={solution.status === 'active' ? 'default' : 'secondary'}
                                className={solution.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                              >
                                {solution.status === 'active' ? 'Ativa' : 'Inativa'}
                              </Badge>
                              {solution.sort_order !== null && (
                                <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold">
                                  #{solution.sort_order}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 font-mono bg-brand-gold/10 px-2 py-1 rounded inline-block mb-1">
                              {solution.key}
                            </p>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                              {solution.description}
                            </p>
                            {solution.features && solution.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-1">
                                {solution.features.slice(0, 3).map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700">
                                    {feature}
                                  </Badge>
                                ))}
                                {solution.features.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold">
                                    +{solution.features.length - 3}
                                  </Badge>
                                )}
                              </div>
                            )}
                            <p className="text-xs text-gray-400">
                              Criado em: {formatDate(solution.created_at)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleView(solution)}
                            className="border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(solution)}
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(solution)}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <SolutionModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedSolution(null);
        }}
        solution={selectedSolution}
        onSuccess={handleModalSuccess}
        mode={modalMode}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedSolution(null);
        }}
        onConfirm={confirmDelete}
        title="Excluir Solução"
        description={
          selectedSolution 
            ? `Tem certeza que deseja excluir a solução "${selectedSolution.title}"? Esta ação não pode ser desfeita.`
            : ''
        }
      />
    </AdminLayout>
  );
};

export default AdminSolutions;
