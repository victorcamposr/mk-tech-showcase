
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { logAdminActivity } from '@/utils/adminActivity';

interface HomeBanner {
  id: string;
  title: string;
  image_url: string;
  link_url: string | null;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface HomeBannerModalProps {
  open: boolean;
  onClose: () => void;
  editingItem?: HomeBanner | null;
}

const HomeBannerModal = ({ open, onClose, editingItem }: HomeBannerModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link_url: '',
    sort_order: 0,
    status: 'active' as 'active' | 'inactive'
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title,
        image_url: editingItem.image_url,
        link_url: editingItem.link_url || '',
        sort_order: editingItem.sort_order,
        status: editingItem.status
      });
    } else {
      setFormData({
        title: '',
        image_url: '',
        link_url: '',
        sort_order: 0,
        status: 'active'
      });
    }
  }, [editingItem, open]);

  const saveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingItem) {
        const { error } = await supabase
          .from('home_banners')
          .update({
            title: data.title,
            image_url: data.image_url,
            link_url: data.link_url || null,
            sort_order: data.sort_order,
            status: data.status
          })
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('home_banners')
          .insert({
            title: data.title,
            image_url: data.image_url,
            link_url: data.link_url || null,
            sort_order: data.sort_order,
            status: data.status
          });
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      console.log('Home banner saved, invalidating queries...');
      
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['admin-home-banners'] }),
        queryClient.invalidateQueries({ queryKey: ['home-banners'] }),
        queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      ]);

      await logAdminActivity(
        editingItem ? 'update' : 'create',
        'home_banners',
        formData.title
      );

      toast({
        title: editingItem ? "Banner atualizado!" : "Banner criado!",
        description: "As alterações foram salvas com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o banner. Tente novamente.",
      });
      console.error('Error saving banner:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.image_url.trim()) {
      toast({
        variant: "destructive",
        title: "Campos obrigatórios",
        description: "Preencha o título e selecione uma imagem.",
      });
      return;
    }

    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-brand-black">
            {editingItem ? 'Editar Banner' : 'Novo Banner'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Título do banner"
                className="border-brand-gold/30 focus:border-brand-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_url">Link (opcional)</Label>
              <Input
                id="link_url"
                value={formData.link_url}
                onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                placeholder="https://exemplo.com"
                className="border-brand-gold/30 focus:border-brand-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_order">Ordem</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="border-brand-gold/30 focus:border-brand-gold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                <SelectTrigger className="border-brand-gold/30 focus:border-brand-gold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <ImageUpload
              label="Imagem do Banner *"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              className="w-full"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-brand-gold/30 text-brand-gold hover:bg-brand-gold/10"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saveMutation.isPending}
              className="flex-1 bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold"
            >
              {saveMutation.isPending ? 'Salvando...' : editingItem ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HomeBannerModal;
