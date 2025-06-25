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
  RefreshCw
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              Gerenciar Soluções
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Gerencie as soluções e serviços da empresa
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={fetchSolutions}
              variant="outline"
              className="border-brand-gold/20 text-brand-gold hover:bg-brand-gold/5"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-semibold shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Solução
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Filter className="w-4 h-4 text-white" />
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
                    className="pl-10 border-gray-300 focus:border-brand-gold focus:ring-brand-gold"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('all')}
                  className={statusFilter === 'all' ? 'bg-brand-gold hover:bg-brand-gold/90 text-brand-black' : ''}
                >
                  Todas
                </Button>
                <Button
                  variant={statusFilter === 'active' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}
                >
                  Ativas
                </Button>
                <Button
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                  onClick={() => setStatusFilter('inactive')}
                  className={statusFilter === 'inactive' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                >
                  Inativas
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solutions List */}
        <Card className="shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-gold to-yellow-600 rounded-lg flex items-center justify-center">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                Soluções ({filteredSolutions.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-gold mx-auto"></div>
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
                    className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Solução
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredSolutions.map((solution) => (
                  <div key={solution.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">{solution.title}</h3>
                          <Badge className={`${
                            solution.status === 'active' 
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
                              : 'bg-red-100 text-red-800 border-red-200'
                          } border font-medium`}>
                            {solution.status === 'active' ? 'Ativa' : 'Inativa'}
                          </Badge>
                          {solution.sort_order !== null && (
                            <Badge variant="outline" className="text-xs">
                              Ordem: {solution.sort_order}
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">{solution.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>Chave: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{solution.key}</code></span>
                          <span>Ícone: {solution.icon_name || 'Não definido'}</span>
                          <span>Criado em: {formatDate(solution.created_at)}</span>
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
                          <Trash2 className="w-4 h-4 mr-1" />
                          Excluir
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
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
