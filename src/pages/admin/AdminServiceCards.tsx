
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceCardModal from '@/components/admin/ServiceCardModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { logAdminActivity } from '@/utils/adminActivity';
import { Plus, Edit, Trash2, Phone, Mail, Eye, EyeOff, Search } from 'lucide-react';

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
  const [statusFilter, setStatusFilter] = useState('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchServiceCards();
  }, []);

  useEffect(() => {
    filterCards();
  }, [serviceCards, searchTerm, statusFilter]);

  const fetchServiceCards = async () => {
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServiceCards(data || []);
    } catch (error) {
      console.error('Error fetching service cards:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar os cards.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterCards = () => {
    let filtered = serviceCards;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(card => 
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.phone.includes(searchTerm)
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(card => card.status === statusFilter);
    }

    setFilteredCards(filtered);
  };

  const handleEdit = (card: ServiceCard) => {
    setEditingCard(card);
    setModalOpen(true);
  };

  const handleDelete = (card: ServiceCard) => {
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

      await logAdminActivity('delete', 'service_cards', cardToDelete.title);

      toast({
        title: "Sucesso",
        description: "Card excluído com sucesso!",
      });

      fetchServiceCards();
    } catch (error) {
      console.error('Error deleting service card:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir o card.",
        variant: "destructive",
      });
    } finally {
      setDeleteModalOpen(false);
      setCardToDelete(null);
    }
  };

  const toggleStatus = async (card: ServiceCard) => {
    try {
      const newStatus = card.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('service_cards')
        .update({ status: newStatus })
        .eq('id', card.id);

      if (error) throw error;

      await logAdminActivity('update', 'service_cards', `${newStatus === 'active' ? 'ativou' : 'desativou'} o card "${card.title}"`);

      toast({
        title: "Sucesso",
        description: `Card ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso!`,
      });

      fetchServiceCards();
    } catch (error) {
      console.error('Error updating service card status:', error);
      toast({
        title: "Erro",
        description: "Erro ao alterar status do card.",
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingCard(null);
  };

  const handleModalSuccess = () => {
    fetchServiceCards();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Carregando...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cards de Serviços</h1>
            <p className="text-gray-600 mt-2">Gerencie os cards exibidos na página de Serviços</p>
          </div>
          <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Card
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por título, descrição, email ou telefone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="all">Todos os status</option>
                <option value="active">Apenas ativos</option>
                <option value="inactive">Apenas inativos</option>
              </select>
            </div>
          </div>
        </div>

        {filteredCards.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
            <div className="text-gray-400 text-lg mb-4">
              {searchTerm || statusFilter !== 'all' ? 'Nenhum card encontrado com os filtros aplicados' : 'Nenhum card encontrado'}
            </div>
            {!searchTerm && statusFilter === 'all' && (
              <Button onClick={() => setModalOpen(true)} className="flex items-center gap-2 mx-auto">
                <Plus className="h-4 w-4" />
                Criar primeiro card
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCards.map((card) => (
              <div key={card.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      card.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {card.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                    <span className="text-xs text-gray-500">#{card.sort_order}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStatus(card)}
                      className="h-8 w-8 p-0"
                    >
                      {card.status === 'active' ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(card)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(card)}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-center">
                    <img 
                      src={card.logo_url} 
                      alt="Logo" 
                      className="w-16 h-16 object-contain rounded-lg border border-gray-200"
                    />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {card.description}
                    </p>
                  </div>
                  
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      <span>{card.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{card.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
        description={`Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita.`}
      />
    </AdminLayout>
  );
};

export default AdminServiceCards;
