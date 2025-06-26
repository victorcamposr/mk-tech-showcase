import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  RefreshCw, 
  Image,
  Calendar,
  Check,
  X
} from 'lucide-react';
import HomeBannerModal from '@/components/admin/HomeBannerModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import { logAdminActivity } from '@/utils/adminActivity';

interface HomeBanner {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  sort_order: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

const AdminHomeBanners = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<HomeBanner | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; banner?: HomeBanner }>({
    isOpen: false
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: banners = [], isLoading, refetch } = useQuery({
    queryKey: ['home-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_banners')
        .select('*')
        .order('sort_order', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as HomeBanner[];
    }
  });

  // Filtrar banners baseado na busca e status
  const filteredBanners = banners.filter(banner => {
    const matchesSearch = banner.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || banner.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = () => {
    setSelectedBanner(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: HomeBanner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (banner: HomeBanner) => {
    setDeleteDialog({ isOpen: true, banner });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.banner) return;
    
    try {
      const bannerData = banners.find(b => b.id === deleteDialog.banner!.id);

      const { error } = await supabase
        .from('home_banners')
        .delete()
        .eq('id', deleteDialog.banner.id);

      if (error) throw error;

      await logAdminActivity(
        'delete',
        'home_banners',
        bannerData?.title || 'Banner'
      );

      toast({
        title: 'Banner excluído',
        description: 'O banner foi excluído com sucesso.',
      });

      queryClient.invalidateQueries({ queryKey: ['home-banners'] });
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Erro ao excluir banner',
        description: 'Não foi possível excluir o banner.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog({ isOpen: false });
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['home-banners'] });
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
              <Image className="w-8 h-8 text-brand-gold" />
              Gerenciar Banners da Home
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os banners exibidos na página inicial
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => refetch()}
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
              Novo Banner
            </Button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar banners..."
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
                  {banners.filter(b => b.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Ativos</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {banners.filter(b => b.status === 'inactive').length}
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

        {/* Banners List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Image className="w-5 h-5 text-brand-gold" />
                Banners Cadastrados
              </span>
              <Badge variant="outline" className="bg-brand-gold/10 text-brand-gold border-brand-gold/30">
                {filteredBanners.length} banners
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
                  <p className="mt-4 text-gray-600">Carregando banners...</p>
                </div>
              </div>
            ) : filteredBanners.length === 0 ? (
              <div className="text-center py-12">
                <Image className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm || statusFilter !== 'all' ? 'Nenhum banner encontrado' : 'Nenhum banner cadastrado'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Tente ajustar os filtros para encontrar o que procura.'
                    : 'Comece criando seu primeiro banner.'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button 
                    onClick={handleCreate} 
                    className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Primeiro Banner
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredBanners.map((banner) => (
                  <div
                    key={banner.id}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-12 bg-white rounded-lg shadow-sm overflow-hidden">
                          <img 
                            src={banner.image_url} 
                            alt={banner.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{banner.title}</h3>
                          <Badge variant="outline" className="text-xs border-brand-gold/30 text-brand-gold mt-1">
                            #{banner.sort_order}
                          </Badge>
                        </div>
                      </div>
                      <Badge 
                        variant={banner.status === 'active' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {banner.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    {banner.link_url && (
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Link:</strong>{' '}
                        <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline truncate">
                          {banner.link_url}
                        </a>
                      </p>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(banner.created_at)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(banner)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteClick(banner)}
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

      <HomeBannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        banner={selectedBanner}
        onSuccess={handleSuccess}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={confirmDelete}
        title="Excluir Banner"
        description={`Tem certeza que deseja excluir o banner "${deleteDialog.banner?.title}"? Esta ação não pode ser desfeita.`}
      />
    </AdminLayout>
  );
};

export default AdminHomeBanners;
