import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
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
  Smartphone,
  Calendar,
  CreditCard,
  Coffee,
  QrCode,
  Truck,
  Link2,
  Bot,
  Monitor,
  TrendingUp,
  Banknote,
  Building2,
  Tablet,
  Fuel,
  Receipt
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
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState<AdminSolution[]>([]);
  const [filteredSolutions, setFilteredSolutions] = useState<AdminSolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState<AdminSolution | null>(null);
  const { toast } = useToast();

  // Static solution icon mapping based on solution keys (same as frontend)
  const staticSolutionIcons: Record<string, any> = {
    'pdv-frente-caixa': Calculator,
    'mesas-comandas': Coffee,
    'cardapio-digital': QrCode,
    'maquininhas-cartao': CreditCard,
    'controle-motoboys': Truck,
    'integracoes': Link2,
    'gestao-analise': BarChart3,
    'robo-whatsapp': Bot,
    'nota-fiscal': Receipt,
    'auto-atendimento': Monitor,
    'marketing-vendas': TrendingUp,
    'pagamento-tef': Banknote,
    'franquias-filiais': Building2,
    'autoatendimento-tablet': Tablet,
    'sistema-revendas-gas-agua': Fuel,
  };

  // Fallback icon mapping
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
    'credit-card': CreditCard,
    coffee: Coffee,
    'qr-code': QrCode,
    truck: Truck,
    link2: Link2,
    bot: Bot,
    monitor: Monitor,
    'trending-up': TrendingUp,
    banknote: Banknote,
    building2: Building2,
    tablet: Tablet,
    fuel: Fuel,
  };

  const getIcon = (solution: AdminSolution) => {
    // First try to get icon from static mapping based on solution key
    if (staticSolutionIcons[solution.key]) {
      return staticSolutionIcons[solution.key];
    }
    // Fallback to icon mapping by icon_name
    return iconMap[solution.icon_name] || Lightbulb;
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
    navigate('/admin/solutions/create');
  };

  const handleView = (solution: AdminSolution) => {
    navigate(`/admin/solutions/${solution.id}/view`);
  };

  const handleEdit = (solution: AdminSolution) => {
    navigate(`/admin/solutions/${solution.id}/edit`);
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
              <Lightbulb className="w-8 h-8 text-brand-gold" />
              Gerenciar Soluções
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie as soluções disponíveis no sistema
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchSolutions}
              variant="outline"
              size="sm"
              className="shadow-md hover:shadow-lg transition-all duration-200"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button
              onClick={handleCreate}
              className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Solução
            </Button>
          </div>
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
                className="pl-10 bg-white border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
              />
            </div>
          </div>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {solutions.filter(s => s.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Ativas</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {solutions.filter(s => s.status === 'inactive').length}
                </div>
                <div className="text-sm text-gray-600">Inativas</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-brand-gold" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' 
                  ? 'bg-brand-gold hover:bg-brand-gold-dark text-white shadow-md' 
                  : 'shadow-md hover:shadow-lg transition-all duration-200'
                }
              >
                Todas
              </Button>
              <Button
                variant={statusFilter === 'active' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('active')}
                className={statusFilter === 'active' 
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-md' 
                  : 'shadow-md hover:shadow-lg transition-all duration-200'
                }
              >
                Ativas
              </Button>
              <Button
                variant={statusFilter === 'inactive' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('inactive')}
                className={statusFilter === 'inactive' 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-md' 
                  : 'shadow-md hover:shadow-lg transition-all duration-200'
                }
              >
                Inativas
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Solutions List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-brand-gold" />
                Soluções Cadastradas
              </span>
              <Badge variant="outline" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                {filteredSolutions.length} soluções
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando soluções...</p>
                </div>
              </div>
            ) : filteredSolutions.length === 0 ? (
              <div className="text-center py-12">
                <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhuma solução encontrada' : 'Nenhuma solução cadastrada'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar o que procura.'
                    : 'Comece criando sua primeira solução.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    onClick={handleCreate} 
                    className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeira Solução
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredSolutions.map((solution) => {
                  const Icon = getIcon(solution);
                  return (
                    <div
                      key={solution.id}
                      className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-full shadow-sm">
                            <Icon className="w-6 h-6 text-brand-gold" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{solution.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500 font-mono bg-brand-gold/10 px-2 py-1 rounded">
                                {solution.key}
                              </span>
                              {solution.sort_order !== null && (
                                <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold">
                                  #{solution.sort_order}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Badge 
                          variant={solution.status === 'active' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {solution.status === 'active' ? 'Ativa' : 'Inativa'}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                        {solution.description}
                      </p>
                      
                      {solution.features && solution.features.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {solution.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs border-blue-200 text-blue-700 bg-blue-50">
                              {feature}
                            </Badge>
                          ))}
                          {solution.features.length > 3 && (
                            <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold bg-brand-gold/10">
                              +{solution.features.length - 3}
                            </Badge>
                          )}
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
                            onClick={() => handleView(solution)}
                            className="shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(solution)}
                            className="shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(solution)}
                            className="shadow-md hover:shadow-lg transition-all duration-200"
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
