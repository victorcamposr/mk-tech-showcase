
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Phone, Mail } from 'lucide-react';
import ServiceCardModal from '@/components/admin/ServiceCardModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { logAdminActivity } from '@/utils/adminActivity';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<ServiceCard | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; card?: ServiceCard }>({
    isOpen: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: serviceCards = [], isLoading } = useQuery({
    queryKey: ['service-cards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as ServiceCard[];
    }
  });

  // Filtrar cards baseado na busca e status
  const filteredCards = serviceCards.filter(card => {
    const matchesSearch = card.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Contar cards ativos e inativos
  const activeCards = serviceCards.filter(card => card.status === 'active').length;
  const inactiveCards = serviceCards.filter(card => card.status === 'inactive').length;

  const handleCreate = () => {
    setSelectedCard(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (card: ServiceCard) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  const handleDelete = (card: ServiceCard) => {
    setDeleteDialog({ isOpen: true, card });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.card) return;

    try {
      const { error } = await supabase
        .from('service_cards')
        .delete()
        .eq('id', deleteDialog.card.id);

      if (error) throw error;

      await logAdminActivity('delete', 'service_cards', deleteDialog.card.description);

      toast({
        title: 'Card excluído',
        description: 'Card de serviço excluído com sucesso.',
      });

      queryClient.invalidateQueries({ queryKey: ['service-cards'] });
    } catch (error) {
      console.error('Error deleting service card:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o card.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog({ isOpen: false });
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

      await logAdminActivity('update', 'service_cards', `${newStatus === 'active' ? 'ativou' : 'desativou'} o card "${card.description}"`);

      toast({
        title: 'Status atualizado',
        description: `Card ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ['service-cards'] });
    } catch (error) {
      console.error('Error updating service card status:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o status do card.',
        variant: 'destructive',
      });
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['service-cards'] });
  };

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
          <Button onClick={handleCreate} className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black">
            <Plus className="w-4 h-4 mr-2" />
            Novo Card
          </Button>
        </div>

        {/* Filtros e Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Cards</p>
                  <p className="text-2xl font-bold text-blue-600">{serviceCards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cards Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{activeCards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Cards Inativos</p>
                  <p className="text-2xl font-bold text-red-600">{inactiveCards}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Filtrados</p>
                  <p className="text-2xl font-bold text-purple-600">{filteredCards.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros de Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por descrição..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredCards.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== 'all' 
                      ? 'Nenhum card encontrado com os filtros aplicados' 
                      : 'Nenhum card cadastrado'
                    }
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredCards.map((card) => (
                <Card key={card.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-24 h-24 flex-shrink-0 p-2">
                      <img 
                        src={card.logo_url} 
                        alt="Logo"
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={card.status === 'active' ? 'default' : 'secondary'}>
                              {card.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          <p className="text-gray-700">{card.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {card.phone}
                            </span>
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {card.email}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">Ordem: {card.sort_order}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStatus(card)}
                          >
                            {card.status === 'active' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(card)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(card)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      <ServiceCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        serviceCard={selectedCard}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Excluir Card"
        description="Tem certeza que deseja excluir este card? Esta ação não pode ser desfeita."
      />
    </AdminLayout>
  );
};

export default AdminServiceCards;
