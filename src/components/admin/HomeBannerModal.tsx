
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logAdminActivity } from '@/utils/adminActivity';

interface HomeBanner {
  id?: string;
  title: string;
  image_url: string;
  link_url?: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface HomeBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: HomeBanner;
  onSuccess: () => void;
}

const HomeBannerModal = ({ isOpen, onClose, banner, onSuccess }: HomeBannerModalProps) => {
  const [formData, setFormData] = useState<HomeBanner>({
    title: '',
    image_url: '',
    link_url: '',
    sort_order: 0,
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (banner) {
      setFormData(banner);
    } else {
      setFormData({
        title: '',
        image_url: '',
        link_url: '',
        sort_order: 0,
        status: 'active'
      });
    }
  }, [banner, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSave = {
        title: formData.title,
        image_url: formData.image_url,
        link_url: formData.link_url || null,
        sort_order: formData.sort_order,
        status: formData.status
      };

      let error;

      if (banner?.id) {
        const { error: updateError } = await supabase
          .from('home_banners')
          .update(dataToSave)
          .eq('id', banner.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('home_banners')
          .insert([dataToSave]);
        error = insertError;
      }

      if (error) {
        throw error;
      }

      // Registrar atividade
      await logAdminActivity(
        banner?.id ? 'update' : 'create',
        'home_banners',
        formData.title
      );

      toast({
        title: banner?.id ? 'Banner atualizado' : 'Banner criado',
        description: banner?.id ? 'Banner atualizado com sucesso.' : 'Banner criado com sucesso.',
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving banner:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o banner.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {banner?.id ? 'Editar Banner' : 'Novo Banner'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="image">Imagem do Banner</Label>
            <ImageUpload
              label="Imagem do Banner"
              value={formData.image_url}
              onChange={(url) => setFormData({ ...formData, image_url: url })}
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="link_url">Link (opcional)</Label>
            <Input
              id="link_url"
              type="url"
              placeholder="https://exemplo.com"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="sort_order">Ordem de Exibição</Label>
            <Input
              id="sort_order"
              type="number"
              min="0"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="status"
              checked={formData.status === 'active'}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, status: checked ? 'active' : 'inactive' })
              }
            />
            <Label htmlFor="status">Banner Ativo</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !formData.title || !formData.image_url}>
              {loading ? 'Salvando...' : (banner?.id ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HomeBannerModal;
