
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logAdminActivity } from '@/utils/adminActivity';

interface ServiceCard {
  id?: string;
  title: string;
  logo_url: string;
  description: string;
  phone: string;
  email: string;
  status: string;
  sort_order: number;
  category_id?: string;
}

interface ServiceCategory {
  id: string;
  name: string;
  status: string;
}

interface ServiceCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  serviceCard?: ServiceCard;
}

const ServiceCardModal = ({ isOpen, onClose, onSuccess, serviceCard }: ServiceCardModalProps) => {
  const [formData, setFormData] = useState<Omit<ServiceCard, 'id'>>({
    title: '',
    logo_url: '',
    description: '',
    phone: '',
    email: '',
    status: 'active',
    sort_order: 0,
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
    if (serviceCard) {
      setFormData({
        title: serviceCard.title,
        logo_url: serviceCard.logo_url,
        description: serviceCard.description,
        phone: serviceCard.phone,
        email: serviceCard.email,
        status: serviceCard.status,
        sort_order: serviceCard.sort_order,
        category_id: serviceCard.category_id || '',
      });
    } else {
      setFormData({
        title: '',
        logo_url: '',
        description: '',
        phone: '',
        email: '',
        status: 'active',
        sort_order: 0,
        category_id: '',
      });
    }
    setErrors({});
  }, [serviceCard, isOpen]);

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
    
    if (!formData.logo_url.trim()) {
      newErrors.logo_url = 'Logo é obrigatória';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone é obrigatório';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
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
      let result;
      const actionType = serviceCard?.id ? 'update' : 'create';
      
      const dataToSave = {
        ...formData,
        category_id: formData.category_id || null,
      };
      
      if (serviceCard?.id) {
        result = await supabase
          .from('service_cards')
          .update(dataToSave)
          .eq('id', serviceCard.id);
      } else {
        result = await supabase
          .from('service_cards')
          .insert([dataToSave]);
      }

      if (result.error) throw result.error;

      await logAdminActivity(
        actionType,
        'service_cards',
        formData.title
      );

      toast({
        title: "Sucesso",
        description: `Card ${serviceCard?.id ? 'atualizado' : 'criado'} com sucesso!`,
      });

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving service card:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar o card. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {serviceCard?.id ? 'Editar Card' : 'Novo Card'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                setFormData({ ...formData, title: e.target.value });
                clearFieldError('title');
              }}
              placeholder="Título do serviço..."
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
              <option value="">Selecione uma categoria (opcional)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <ImageUpload
              label="Logo *"
              value={formData.logo_url}
              onChange={(url) => {
                setFormData({ ...formData, logo_url: url });
                clearFieldError('logo_url');
              }}
              className={`mt-2 ${errors.logo_url ? 'border-red-500' : ''}`}
            />
            {errors.logo_url && (
              <p className="text-red-500 text-sm mt-1">{errors.logo_url}</p>
            )}
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                clearFieldError('description');
              }}
              placeholder="Descrição do serviço..."
              className={`mt-2 ${errors.description ? 'border-red-500 focus:border-red-500' : ''}`}
              rows={4}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefone *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  setFormData({ ...formData, phone: e.target.value });
                  clearFieldError('phone');
                }}
                placeholder="(65) 99999-9999"
                className={`mt-2 ${errors.phone ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  clearFieldError('email');
                }}
                placeholder="contato@exemplo.com"
                className={`mt-2 ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
              {loading ? 'Salvando...' : serviceCard?.id ? 'Atualizar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCardModal;
