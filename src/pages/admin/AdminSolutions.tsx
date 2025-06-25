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

      // Cast status to proper type
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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              Gerenciar Soluções
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie as soluções e serviços da empresa
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchSolutions}
              variant="outline"
              className="border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Solução
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-blue-600" />
              </div>
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por título, descrição ou chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}
                >
                  Todas
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}
                >
                  Ativas
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('inactive')}
                  className={statusFilter === 'inactive' ? 'bg-red-600 hover:bg-red-700 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}
                >
                  Inativas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solutions List */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
            <CardTitle className="flex items-center justify-between text-gray-900">
              <span>Soluções Cadastradas</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {filteredSolutions.length} soluções
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Carregando soluções...</p>
              </div>
            ) : filteredSolutions.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhuma solução encontrada' : 'Nenhuma solução cadastrada'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar o que procura.'
                    : 'Comece criando sua primeira solução para o sistema.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    onClick={handleCreate}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Solução
                  </Button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredSolutions.map((solution) => {
                  const Icon = getIcon(solution.icon_name);
                  return (
                    <div key={solution.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {solution.title}
                              </h3>
                              <Badge className={`text-xs border ${
                                solution.status === 'active' 
                                  ? 'bg-green-100 text-green-800 border-green-200' 
                                  : 'bg-red-100 text-red-800 border-red-200'
                              }`}>
                                {solution.status === 'active' ? 'Ativa' : 'Inativa'}
                              </Badge>
                              {solution.sort_order !== null && (
                                <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
                                  Ordem: {solution.sort_order}
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded inline-block mb-2">
                              {solution.key}
                            </p>
                            <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                              {solution.description}
                            </p>
                            {solution.features && solution.features.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2">
                                {solution.features.slice(0, 3).map((feature, index) => (
                                  <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                                    {feature}
                                  </Badge>
                                ))}
                                {solution.features.length > 3 && (
                                  <Badge variant="outline" className="text-xs border-gray-300 text-gray-600">
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
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(solution)}
                            className="border-green-200 text-green-600 hover:bg-green-50"
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(solution)}
                            className="border-red-200 text-red-600 hover:bg-red-50"
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
