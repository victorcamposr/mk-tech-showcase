
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Search, Image, ExternalLink } from 'lucide-react';
import HomeBannerModal from '@/components/admin/HomeBannerModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { logAdminActivity } from '@/utils/adminActivity';

interface HomeBanner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
}

const AdminHomeBanners = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HomeBanner | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; title: string }>({
    open: false,
    id: '',
    title: ''
  });
  
  // Estados para filtros e busca
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Carregar banners
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['admin-home-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_banners')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as HomeBanner[];
    }
  });

  // Filtrar dados
  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || banner.status === filter;
    return matchesSearch && matchesFilter;
  });

  // Contar estatísticas
  const stats = {
    total: banners.length,
    active: banners.filter(b => b.status === 'active').length,
    inactive: banners.filter(b => b.status === 'inactive').length
  };

  // Mutação para deletar
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('home_banners').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: async () => {
      console.log('Home banner deleted, invalidating queries...');
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-home-banners'] }),
        queryClient.invalidateQueries({ queryKey: ['home-banners'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      ]);

      await logAdminActivity('delete', 'home_banners', deleteDialog.title);
      
      toast({
        title: "Banner excluído com sucesso!",
        description: "O banner foi removido e o sistema foi atualizado.",
      });
      setDeleteDialog({ open: false, id: '', title: '' });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao excluir",
        description: "Não foi possível excluir o banner. Tente novamente.",
      });
      console.error('Error deleting banner:', error);
    }
  });

  const handleEdit = (banner: HomeBanner) => {
    setEditingItem(banner);
    setModalOpen(true);
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteDialog({ open: true, id, title });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(deleteDialog.id);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingItem(null);
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header com gradiente */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-brand-gold to-brand-gold-light rounded-2xl mb-6 shadow-lg">
              <Image className="w-8 h-8 text-brand-black" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-black mb-4">
              Gerenciar <span className="text-brand-gold">Banners da Home</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Gerencie os banners que aparecem no carrossel da página inicial
            </p>
          </div>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
            <div className="text-center lg:text-left flex-1">
              <h2 className="text-3xl font-bold text-brand-black mb-2">Banners Cadastrados</h2>
              <p className="text-gray-600 mb-4">Configure os banners que aparecem na home</p>
              
              {/* Estatísticas */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  Total: {stats.total}
                </span>
                <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                  Ativos: {stats.active}
                </span>
                <span className="bg-gray-50 text-gray-700 px-3 py-1 rounded-full">
                  Inativos: {stats.inactive}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Barra de pesquisa */}
              <div className="relative flex-1 lg:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar banners..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-brand-gold/30 focus:border-brand-gold"
                />
              </div>
              
              {/* Filtro de status */}
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="w-full sm:w-48 border-brand-gold/30 focus:border-brand-gold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Ativos</SelectItem>
                  <SelectItem value="inactive">Inativos</SelectItem>
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => setModalOpen(true)} 
                className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Banner
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBanners.map((banner) => (
                <Card key={banner.id} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-2 group bg-gradient-to-br from-white to-gray-50/50 overflow-hidden">
                  {/* Banner de imagem */}
                  <div className="h-32 overflow-hidden relative">
                    <img 
                      src={banner.image_url} 
                      alt={banner.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    <Badge 
                      variant={banner.status === 'active' ? 'default' : 'secondary'} 
                      className="absolute top-3 right-3 bg-brand-gold/90 text-brand-black border-0"
                    >
                      {banner.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-brand-gold font-semibold">
                        Ordem: {banner.sort_order}
                      </div>
                      {banner.link_url && (
                        <ExternalLink className="w-4 h-4 text-brand-gold" />
                      )}
                    </div>
                    <CardTitle className="text-lg font-bold text-brand-black group-hover:text-brand-gold transition-colors">
                      {banner.title}
                    </CardTitle>
                    {banner.link_url && (
                      <CardDescription className="text-sm text-gray-600 truncate">
                        {banner.link_url}
                      </CardDescription>
                    )}
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(banner)}
                        className="flex-1 border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(banner.id, banner.title)}
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Modal para criar/editar */}
          <HomeBannerModal
            open={modalOpen}
            onClose={handleCloseModal}
            editingItem={editingItem}
          />

          {/* Dialog de confirmação de exclusão */}
          <DeleteConfirmDialog
            isOpen={deleteDialog.open}
            onClose={() => setDeleteDialog({ open: false, id: '', title: '' })}
            onConfirm={confirmDelete}
            title="Confirmar Exclusão"
            description={`Tem certeza que deseja excluir o banner "${deleteDialog.title}"? Esta ação não pode ser desfeita.`}
            loading={deleteMutation.isPending}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminHomeBanners;
