
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logAdminActivity } from '@/utils/adminActivity';
import { useAuth } from '@/hooks/useAuth';

interface ServiceCard {
  id?: string;
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
  onSave: () => void;
  serviceCard?: ServiceCard;
}

const ServiceCardModal = ({ isOpen, onClose, onSave, serviceCard }: ServiceCardModalProps) => {
  const [formData, setFormData] = useState<ServiceCard>({
    logo_url: '',
    description: '',
    phone: '',
    email: '',
    status: 'active',
    sort_order: 0
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { adminProfile } = useAuth();

  useEffect(() => {
    if (serviceCard) {
      setFormData(serviceCard);
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
  }, [serviceCard]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (serviceCard?.id) {
        // Update existing service card
        const { error } = await supabase
          .from('service_cards')
          .update({
            logo_url: formData.logo_url,
            description: formData.description,
            phone: formData.phone,
            email: formData.email,
            status: formData.status,
            sort_order: formData.sort_order
          })
          .eq('id', serviceCard.id);

        if (error) throw error;

        await logAdminActivity({
          action_type: 'update',
          entity_type: 'service_card',
          entity_id: serviceCard.id,
          entity_title: formData.description.substring(0, 50) + '...',
          user_name: adminProfile?.name || 'Admin'
        });

        toast({
          title: "Card atualizado",
          description: "O card de serviço foi atualizado com sucesso.",
        });
      } else {
        // Create new service card
        const { error } = await supabase
          .from('service_cards')
          .insert([{
            logo_url: formData.logo_url,
            description: formData.description,
            phone: formData.phone,
            email: formData.email,
            status: formData.status,
            sort_order: formData.sort_order
          }]);

        if (error) throw error;

        await logAdminActivity({
          action_type: 'create',
          entity_type: 'service_card',
          entity_title: formData.description.substring(0, 50) + '...',
          user_name: adminProfile?.name || 'Admin'
        });

        toast({
          title: "Card criado",
          description: "O card de serviço foi criado com sucesso.",
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving service card:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o card de serviço.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {serviceCard ? 'Editar Card de Serviço' : 'Novo Card de Serviço'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo</Label>
            <ImageUpload
              label="Upload do Logo"
              value={formData.logo_url}
              onChange={(url) => setFormData({ ...formData, logo_url: url })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do serviço..."
              required
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(65) 99999-9999"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contato@exemplo.com"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}
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

            <div className="space-y-2">
              <Label htmlFor="sort_order">Ordem</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceCardModal;
