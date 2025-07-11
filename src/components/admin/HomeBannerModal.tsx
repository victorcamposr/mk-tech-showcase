
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
  category_id?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  status: string;
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
    status: 'active',
    category_id: '',
  });
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (banner) {
      setFormData({
        ...banner,
        category_id: banner.category_id || '',
      });
    } else {
      setFormData({
        title: '',
        image_url: '',
        link_url: '',
        sort_order: 0,
        status: 'active',
        category_id: '',
      });
    }
    setErrors({});
  }, [banner, isOpen]);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('service_categories')
        .select('id, name, status')
        .eq('status', 'active')
        .order('sort_order', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Título é obrigatório';
    }
    
    if (!formData.image_url.trim()) {
      newErrors.image_url = 'Imagem é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const dataToSave = {
        title: formData.title,
        image_url: formData.image_url,
        link_url: formData.link_url || null,
        sort_order: formData.sort_order,
        status: formData.status,
        category_id: formData.category_id || null,
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
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                clearFieldError('title');
              }}
              placeholder="Título do banner..."
              className={`mt-2 ${errors.title ? 'border-red-500 focus:border-red-500' : ''}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <select
              id="category"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
              className="mt-2 w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Home - Exibir na página inicial</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="image">Imagem do Banner *</Label>
            <ImageUpload
              label="Imagem do Banner"
              value={formData.image_url}
              onChange={(url) => {
                setFormData({ ...formData, image_url: url });
                clearFieldError('image_url');
              }}
              className={`mt-2 ${errors.image_url ? 'border-red-500' : ''}`}
            />
            {errors.image_url && (
              <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>
            )}
          </div>

          <div>
            <Label htmlFor="link_url">Link (opcional)</Label>
            <Input
              id="link_url"
              type="url"
              placeholder="https://exemplo.com"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              className="mt-2"
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
              className="mt-2"
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : (banner?.id ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default HomeBannerModal;
