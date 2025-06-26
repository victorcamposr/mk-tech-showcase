
import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import HomeBannerModal from '@/components/admin/HomeBannerModal';
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';

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
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: banners = [], isLoading } = useQuery({
    queryKey: ['home-banners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('home_banners')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as HomeBanner[];
    }
  });

  const handleCreate = () => {
    setSelectedBanner(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (banner: HomeBanner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = (banner: HomeBanner) => {
    setDeleteDialog({ isOpen: true, banner });
  };

  const confirmDelete = async () => {
    if (!deleteDialog.banner) return;

    try {
      const { error } = await supabase
        .from('home_banners')
        .delete()
        .eq('id', deleteDialog.banner.id);

      if (error) throw error;

      toast({
        title: 'Banner excluído',
        description: 'Banner excluído com sucesso.',
      });

      queryClient.invalidateQueries({ queryKey: ['home-banners'] });
    } catch (error) {
      console.error('Error deleting banner:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao excluir o banner.',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialog({ isOpen: false });
    }
  };

  const toggleStatus = async (banner: HomeBanner) => {
    try {
      const newStatus = banner.status === 'active' ? 'inactive' : 'active';
      
      const { error } = await supabase
        .from('home_banners')
        .update({ status: newStatus })
        .eq('id', banner.id);

      if (error) throw error;

      toast({
        title: 'Status atualizado',
        description: `Banner ${newStatus === 'active' ? 'ativado' : 'desativado'} com sucesso.`,
      });

      queryClient.invalidateQueries({ queryKey: ['home-banners'] });
    } catch (error) {
      console.error('Error updating banner status:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao atualizar o status do banner.',
        variant: 'destructive',
      });
    }
  };

  const handleSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['home-banners'] });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-brand-black">Banners da Home</h1>
            <p className="text-gray-600 mt-2">
              Gerencie os banners exibidos na página inicial
            </p>
          </div>
          <Button onClick={handleCreate} className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black">
            <Plus className="w-4 h-4 mr-2" />
            Novo Banner
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-gold"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {banners.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">Nenhum banner cadastrado</p>
                </CardContent>
              </Card>
            ) : (
              banners.map((banner) => (
                <Card key={banner.id} className="overflow-hidden">
                  <div className="flex">
                    <div className="w-48 h-32 flex-shrink-0">
                      <img 
                        src={banner.image_url} 
                        alt={banner.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">{banner.title}</h3>
                            <Badge variant={banner.status === 'active' ? 'default' : 'secondary'}>
                              {banner.status === 'active' ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          {banner.link_url && (
                            <p className="text-sm text-gray-600">
                              Link: <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline">
                                {banner.link_url}
                              </a>
                            </p>
                          )}
                          <p className="text-sm text-gray-500">Ordem: {banner.sort_order}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleStatus(banner)}
                          >
                            {banner.status === 'active' ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(banner)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(banner)}
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
        description="Tem certeza que deseja excluir este banner? Esta ação não pode ser desfeita."
      />
    </AdminLayout>
  );
};

export default AdminHomeBanners;
