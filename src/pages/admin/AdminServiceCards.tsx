
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import ServiceCardModal from '@/components/admin/ServiceCardModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { logAdminActivity } from '@/utils/adminActivity';
import { useAuth } from '@/hooks/useAuth';

interface ServiceCard {
  id: string;
  logo_url: string;
  description: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const AdminServiceCards = () => {
  const [serviceCards, setServiceCards] = useState<ServiceCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ServiceCard | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<ServiceCard | null>(null);
  const { toast } = useToast();
  const { adminProfile } = useAuth();

  useEffect(() => {
    fetchServiceCards();
  }, []);

  const fetchServiceCards = async () => {
    try {
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching service cards:', error);
        toast({
          title: "Erro",
          description: "Erro ao buscar cards de serviços.",
          variant: "destructive",
        });
        return;
      }

      setServiceCards(data || []);
    } catch (error) {
      console.error('Error fetching service cards:', error);
      toast({
        title: "Erro",
        description: "Erro ao buscar cards de serviços.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (card: ServiceCard) => {
    setSelectedCard(card);
    setModalOpen(true);
  };

  const handleDelete = (card: ServiceCard) => {
    setCardToDelete(card);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!cardToDelete) return;

    try {
      const { error } = await supabase
        .from('service_cards')
        .delete()
        .eq('id', cardToDelete.id);

      if (error) throw error;

      await logAdminActivity({
        action_type: 'delete',
        entity_type: 'service_card',
        entity_id: cardToDelete.id,
        entity_title: cardToDelete.description.substring(0, 50) + '...',
        user_name: adminProfile?.name || 'Admin'
      });

      toast({
        title: "Card excluído",
        description: "O card de serviço foi excluído com sucesso.",
      });

      fetchServiceCards();
    } catch (error) {
      console.error('Error deleting service card:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir o card de serviço.",
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setCardToDelete(null);
  };

  const toggleStatus = async (card: ServiceCard) => {
    try {
      const newStatus = card.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('service_cards')
        .update({ status: newStatus })
        .eq('id', card.id);

      if (error) throw error;

      await logAdminActivity({
        action_type: 'update',
        entity_type: 'service_card',
        entity_id: card.id,
        entity_title: `Status alterado para ${newStatus}`,
        user_name: adminProfile?.name || 'Admin'
      });

      toast({
        title: "Status alterado",
        description: `Card ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
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
    setSelectedCard(undefined);
  };

  const handleModalSave = () => {
    fetchServiceCards();
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando cards de serviços...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-black">Cards de Serviços</h1>
            <p className="text-gray-600 mt-2">
              Gerencie os cards exibidos na página de serviços
            </p>
          </div>
          <Button
            onClick={() => setModalOpen(true)}
            className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Card
          </Button>
        </div>

        {serviceCards.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Nenhum card de serviço encontrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Comece criando seu primeiro card de serviço.
                </p>
                <Button
                  onClick={() => setModalOpen(true)}
                  className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Card
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceCards.map((card) => (
              <Card key={card.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={card.logo_url}
                        alt="Logo"
                        className="w-12 h-12 object-contain rounded-lg bg-gray-50 p-1"
                      />
                      <div>
                        <Badge
                          variant={card.status === 'active' ? 'default' : 'secondary'}
                          className={
                            card.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }
                        >
                          {card.status === 'active' ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
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
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(card)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(card)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {card.description}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm">
                        <span className="font-medium">Telefone:</span> {card.phone}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">E-mail:</span> {card.email}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Ordem: {card.sort_order}</span>
                      <span>{new Date(card.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <ServiceCardModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleModalSave}
        serviceCard={selectedCard}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Card de Serviço"
        description={`Tem certeza que deseja excluir este card de serviço? Esta ação não pode ser desfeita.`}
      />
    </AdminLayout>
  );
};

export default AdminServiceCards;
