
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logAdminActivity } from '@/utils/adminActivity';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceCardModal from '@/components/admin/ServiceCardModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Search, 
  Filter, 
  RefreshCw, 
  CreditCard,
  Calendar,
  Check,
  X
} from 'lucide-react';

interface ServiceCard {
  id: string;
  title: string;
  logo_url: string;
  description: string;
  phone: string;
  email: string;
  status: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const AdminServiceCards = () => {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<ServiceCard | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<ServiceCard | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchServiceCards();
  }, []);

  useEffect(() => {
    filterCards();
  }, [serviceCards, searchTerm, statusFilter]);

  const fetchServiceCards = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServiceCards(data || []);
    } catch (error) {
      console.error('Error fetching service cards:', error);
      toast({
        title: "Erro ao carregar cards",
        description: "Não foi possível carregar os cards.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCards = () => {
    let filtered = serviceCards;

    if (searchTerm) {
      filtered = filtered.filter(card =>
        card.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(card => card.status === statusFilter);
    }

    setFilteredCards(filtered);
  };

  const handleCreate = () => {
    setEditingCard(null);
    setModalOpen(true);
  };

  const handleEdit = (card: ServiceCard) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  const handleDeleteClick = (card: ServiceCard) => {
    setCardToDelete(card);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;
    
    try {
      const { error } = await supabase
        .from('service_cards')
        .delete()
        .eq('id', cardToDelete.id);

      if (error) throw error;

      await logAdminActivity(
        'delete',
        'service_cards',
        cardToDelete.title
      );

      toast({
        title: "Card excluído",
        description: "O card foi excluído com sucesso.",
      });

      fetchServiceCards();
    } catch (error) {
      console.error('Error deleting service card:', error);
      toast({
        title: "Erro ao excluir card",
        description: "Não foi possível excluir o card.",
        variant: "destructive",
      });
    } finally {
      setDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCard(null);
  };

  const handleModalSuccess = () => {
    fetchServiceCards();
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
              <CreditCard className="w-8 h-8 text-brand-gold" />
              Gerenciar Cards de Serviços
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os cards exibidos na página de Serviços
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchServiceCards}
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
              Novo Card
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar cards..."
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
                  {serviceCards.filter(c => c.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Ativos</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {serviceCards.filter(c => c.status === 'inactive').length}
                </div>
                <div className="text-sm text-gray-600">Inativos</div>
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
                Todos
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
                Ativos
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
                Inativos
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Service Cards List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-gold" />
                Cards Cadastrados
              </span>
              <Badge variant="outline" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                {filteredCards.length} cards
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando cards...</p>
                </div>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhum card encontrado' : 'Nenhum card cadastrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar o que procura.'
                    : 'Comece criando seu primeiro card.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    onClick={handleCreate} 
                    className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Card
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCards.map((card) => (
                  <div
                    key={card.id}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center overflow-hidden">
                          <img 
                            src={card.logo_url} 
                            alt="Logo" 
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                          <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold mt-1">
                            #{card.sort_order}
                          </Badge>
                        </div>
                      </div>
                      <Badge 
                        variant={card.status === 'active' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {card.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {card.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4" />
                        <span>{card.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{card.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(card.created_at)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(card)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(card)}
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
      </div>

      <ServiceCardModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        serviceCard={editingCard}
      />

      <DeleteConfirmDialog
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Card"
        description={`Tem certeza que deseja excluir o card "${cardToDelete?.title}"? Esta ação não pode ser desfeita.`}
      />
    </AdminLayout>
  );
};

export default AdminServiceCards;
