
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logAdminActivity } from '@/utils/adminActivity';

interface ServiceCategory {
  id?: string;
  name: string;
  description?: string;
  slug: string;
  sort_order: number;
  status: 'active' | 'inactive';
}

interface ServiceCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: ServiceCategory;
}

const ServiceCategoryModal = ({ isOpen, onClose, onSuccess, category }: ServiceCategoryModalProps) => {
  const [formData, setFormData] = useState<Omit<ServiceCategory, 'id'>>({
    name: '',
    description: '',
    slug: '',
    sort_order: 0,
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description || '',
        slug: category.slug,
        sort_order: category.sort_order,
        status: category.status,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        slug: '',
        sort_order: 0,
        status: 'active',
      });
    }
  }, [category, isOpen]);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      name: value,
      slug: generateSlug(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.slug) {
      toast({
        title: "Erro",
        description: "Nome e slug são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let result;
      const actionType = category?.id ? 'update' : 'create';
      
      if (category?.id) {
        result = await supabase
          .from('service_categories')
          .update(formData)
          .eq('id', category.id);
      } else {
        result = await supabase
          .from('service_categories')
          .insert([formData]);
      }

      if (result.error) throw result.error;

      await logAdminActivity(
        actionType,
        'service_categories',
        formData.name
      );

      toast({
        title: "Sucesso",
        description: `Categoria ${category?.id ? 'atualizada' : 'criada'} com sucesso!`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving service category:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar a categoria. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category?.id ? 'Editar Categoria' : 'Nova Categoria'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Nome da categoria..."
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug *</Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="slug-da-categoria"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição da categoria..."
              className="mt-2"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                className="mt-2 w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <div>
              <Label htmlFor="sort_order">Ordem</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Salvando...' : category?.id ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCategoryModal;
