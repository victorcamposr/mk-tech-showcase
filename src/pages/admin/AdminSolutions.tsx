
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
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-gray-600" />
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
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Solução
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-gray-600" />
              </div>
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar por título, descrição ou chave..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-gray-900 hover:bg-gray-800 text-white' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}
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

        {/* Solutions Grid */}
        <div>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto"></div>
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
                  className="bg-gray-900 hover:bg-gray-800 text-white font-medium"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Solução
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSolutions.map((solution) => {
                const Icon = getIcon(solution.icon_name);
                return (
                  <Card key={solution.id} className="relative overflow-hidden hover:shadow-md transition-shadow border border-gray-200">
                    <CardContent className="p-6">
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className={`${
                          solution.status === 'active' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        } border font-medium text-xs`}>
                          {solution.status === 'active' ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>

                      {/* Icon and Title */}
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                            {solution.title}
                          </h3>
                          <p className="text-sm text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded">
                            {solution.key}
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {solution.description}
                      </p>

                      {/* Features Tags */}
                      {solution.features && solution.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {solution.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-gray-300 text-gray-600">
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

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(solution)}
                          className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(solution)}
                          className="flex-1 border-gray-300 text-gray-600 hover:bg-gray-50"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Editar
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

                      {/* Metadata */}
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Criado em: {formatDate(solution.created_at)}</span>
                          {solution.sort_order !== null && (
                            <span>Ordem: {solution.sort_order}</span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
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
