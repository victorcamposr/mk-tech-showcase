
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageUpload } from '@/components/ui/image-upload';
import { logAdminActivity } from '@/utils/adminActivity';

interface ServiceCard {
  id: string;
  logo_url: string;
  description: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  sort_order: number;
}

interface ServiceCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceCard?: ServiceCard;
  onSuccess: () => void;
}

const ServiceCardModal = ({ isOpen, onClose, serviceCard, onSuccess }: ServiceCardModalProps) => {
  const [formData, setFormData] = useState({
    logo_url: '',
    description: '',
    phone: '',
    email: '',
    status: 'active' as 'active' | 'inactive',
    sort_order: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (serviceCard) {
      setFormData({
        logo_url: serviceCard.logo_url,
        description: serviceCard.description,
        phone: serviceCard.phone,
        email: serviceCard.email,
        status: serviceCard.status,
        sort_order: serviceCard.sort_order
      });
    } else {
      setFormData({
        logo_url: '',
        description: '',
        phone: '',
        email: '',
        status: 'active',
        sort_order: 0
      });
    }
  }, [serviceCard, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!formData.logo_url || !formData.description || !formData.phone || !formData.email) {
        toast({
          title: 'Erro',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          variant: 'destructive'
        });
        return;
      }

      if (serviceCard) {
        // Atualizar card existente
        const { error } = await supabase
          .from('service_cards')
          .update(formData)
          .eq('id', serviceCard.id);

        if (error) throw error;

        await logAdminActivity('update', 'service_cards', serviceCard.description);

        toast({
          title: 'Card atualizado',
          description: 'Card de serviço atualizado com sucesso.'
        });
      } else {
        // Criar novo card
        const { error } = await supabase
          .from('service_cards')
          .insert([formData]);

        if (error) throw error;

        await logAdminActivity('create', 'service_cards', formData.description);

        toast({
          title: 'Card criado',
          description: 'Card de serviço criado com sucesso.'
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Erro ao salvar card:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao salvar o card.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {serviceCard ? 'Editar Card de Serviço' : 'Novo Card de Serviço'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="logo_url">Logo *</Label>
            <ImageUpload
              value={formData.logo_url}
              onChange={(url) => setFormData(prev => ({ ...prev, logo_url: url }))}
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="phone">Telefone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="(65) 99999-9999"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="contato@exemplo.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => setFormData(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sort_order">Ordem de Exibição</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black">
              {isLoading ? 'Salvando...' : (serviceCard ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCardModal;
