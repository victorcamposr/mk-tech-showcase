
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SolutionModal from '@/components/admin/SolutionModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Lightbulb, 
  Plus, 
  Search, 
  Edit,
  Eye,
  Calendar,
  Settings,
  CheckCircle,
  XCircle,
  Trash2
} from 'lucide-react';

interface Solution {
  id: string;
  title: string;
  description: string;
  features: string[];
  benefits: string[];
  industries: string[];
  status: string;
  created_at: string;
  updated_at: string;
  key: string;
  icon_name: string;
  card_image_url: string | null;
  hero_image_url: string | null;
  sort_order: number | null;
}

const AdminSolutions = () => {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<Solution | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [solutionToDelete, setSolutionToDelete] = useState<Solution | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      console.log('Fetching solutions...');
      const { data, error } = await supabase
        .from('solutions')
        .select('*')
        .order('sort_order', { ascending: true });

      console.log('Solutions fetched:', data, 'Error:', error);
      if (error) throw error;
      setSolutions(data || []);
    } catch (error) {
      console.error('Error fetching solutions:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar soluções",
        description: "Não foi possível carregar a lista de soluções.",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSolutionStatus = async (solutionId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    
    try {
      const { error } = await supabase
        .from('solutions')
        .update({ status: newStatus })
        .eq('id', solutionId);

      if (error) throw error;

      await fetchSolutions();
      toast({
        title: "Status atualizado",
        description: `Solução ${newStatus === 'active' ? 'ativada' : 'desativada'} com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status da solução.",
      });
    }
  };

  const handleDeleteSolution = async () => {
    if (!solutionToDelete) return;
    
    setDeleteLoading(true);
    try {
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', solutionToDelete.id);

      if (error) throw error;

      await fetchSolutions();
      toast({
        title: "Solução excluída",
        description: "A solução foi removida permanentemente do sistema.",
      });
      
      setDeleteDialogOpen(false);
      setSolutionToDelete(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao excluir solução",
        description: "Não foi possível excluir a solução.",
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleNewSolution = () => {
    setSelectedSolution(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleViewSolution = (solution: Solution) => {
    setSelectedSolution(solution);
    setModalMode('view');
    setModalOpen(true);
  };

  const handleEditSolution = (solution: Solution) => {
    setSelectedSolution(solution);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleDeleteClick = (solution: Solution) => {
    setSolutionToDelete(solution);
    setDeleteDialogOpen(true);
  };

  const filteredSolutions = solutions.filter(solution =>
    solution.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solution.key.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = solutions.filter(solution => solution.status === 'active').length;
  const inactiveCount = solutions.filter(solution => solution.status === 'inactive').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const truncateDescription = (description: string, maxLength: number = 120) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando soluções...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Lightbulb className="w-8 h-8 text-brand-gold" />
              Gerenciar Soluções
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie o catálogo de soluções da empresa
            </p>
          </div>
          <Button 
            onClick={handleNewSolution}
            className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Solução
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar soluções..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-brand-gold focus:ring-brand-gold"
              />
            </div>
          </div>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                <div className="text-sm text-gray-600">Ativas</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{inactiveCount}</div>
                <div className="text-sm text-gray-600">Inativas</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Solutions List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-gold" />
              Catálogo de Soluções
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredSolutions.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhuma solução encontrada' : 'Nenhuma solução cadastrada'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Tente usar outros termos de busca.' 
                    : 'Adicione a primeira solução ao catálogo.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSolutions.map((solution) => (
                  <div
                    key={solution.id}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {solution.status === 'active' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">{solution.title}</h3>
                      </div>
                      <Badge variant={solution.status === 'active' ? 'default' : 'destructive'}>
                        {solution.status === 'active' ? 'Ativa' : 'Inativa'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{truncateDescription(solution.description)}</p>
                    
                    <div className="mb-4">
                      <Badge variant="outline" className="text-xs">
                        {solution.key}
                      </Badge>
                    </div>

                    {solution.features && solution.features.length > 0 && (
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 mb-2">Recursos principais:</div>
                        <div className="flex flex-wrap gap-1">
                          {solution.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                          {solution.features.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{solution.features.length - 3} mais
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(solution.created_at)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleViewSolution(solution)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditSolution(solution)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={solution.status === 'active' ? 'destructive' : 'default'}
                          onClick={() => toggleSolutionStatus(solution.id, solution.status)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {solution.status === 'active' ? 'Desativar' : 'Ativar'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(solution)}
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

        {/* Solution Modal */}
        <SolutionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={fetchSolutions}
          solution={selectedSolution}
          mode={modalMode}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          isOpen={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setSolutionToDelete(null);
          }}
          onConfirm={handleDeleteSolution}
          loading={deleteLoading}
          title="Excluir Solução"
          description={`Tem certeza que deseja excluir a solução "${solutionToDelete?.title}"? Esta ação não pode ser desfeita.`}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminSolutions;
