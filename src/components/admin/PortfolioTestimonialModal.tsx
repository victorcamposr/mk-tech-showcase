
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logAdminActivity } from '@/utils/adminActivity';

interface PortfolioTestimonialModalProps {
  open: boolean;
  onClose: () => void;
  editingItem?: any;
}

const PortfolioTestimonialModal = ({ open, onClose, editingItem }: PortfolioTestimonialModalProps) => {
  const [formData, setFormData] = useState({
    content: '',
    author: '',
    company: '',
    rating: 5,
    status: 'active' as 'active' | 'inactive',
    sort_order: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingItem) {
      console.log('PortfolioTestimonialModal - Editing item:', editingItem);
      setFormData({
        content: editingItem.content || '',
        author: editingItem.author || '',
        company: editingItem.company || '',
        rating: editingItem.rating || 5,
        status: editingItem.status || 'active',
        sort_order: editingItem.sort_order || 0
      });
    } else {
      setFormData({
        content: '',
        author: '',
        company: '',
        rating: 5,
        status: 'active',
        sort_order: 0
      });
    }
  }, [editingItem, open]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Submitting portfolio testimonial data:', data);
      
      if (editingItem) {
        console.log('Updating portfolio testimonial with ID:', editingItem.id);
        const { error } = await supabase
          .from('portfolio_testimonials')
          .update(data)
          .eq('id', editingItem.id);
        if (error) {
          console.error('Supabase error updating portfolio testimonial:', error);
          throw error;
        }
      } else {
        console.log('Creating new portfolio testimonial');
        const { error } = await supabase
          .from('portfolio_testimonials')
          .insert([data]);
        if (error) {
          console.error('Supabase error creating portfolio testimonial:', error);
          throw error;
        }
      }
      
      console.log('Portfolio testimonial operation completed successfully');
    },
    onSuccess: async () => {
      console.log('Portfolio testimonial saved, invalidating all related queries...');
      
      // Invalidar todas as queries relacionadas ao portfólio
      const queries = [
        'admin-portfolio-testimonials',
        'portfolio-testimonials',
        'dashboard-stats'
      ];
      
      await Promise.all([
        ...queries.map(key => queryClient.invalidateQueries({ queryKey: [key] })),
        queryClient.refetchQueries({ queryKey: ['dashboard-stats'] }),
        // Forçar refetch dos dados do portfólio público
        queryClient.refetchQueries({ queryKey: ['portfolio-testimonials'] })
      ]);
      
      console.log('All portfolio testimonial queries invalidated and dashboard refetched');
      
      // Log admin activity
      await logAdminActivity(
        editingItem ? 'update' : 'create',
        'portfolio_testimonials',
        `${formData.author} - ${formData.company}`
      );
      
      toast({
        title: editingItem ? "Depoimento atualizado!" : "Depoimento criado!",
        description: "As alterações foram salvas e atualizadas em todo o sistema.",
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error saving portfolio testimonial:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar o depoimento. Tente novamente.",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting portfolio testimonial form with data:', formData);
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Editar Depoimento' : 'Novo Depoimento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="author">Nome do Cliente</Label>
            <Input
              id="author"
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              placeholder="ex: João Silva"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Empresa</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="ex: Supermercado Central"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Depoimento</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Digite o depoimento do cliente..."
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Avaliação (estrelas)</Label>
            <Select
              value={formData.rating.toString()}
              onValueChange={(value) => setFormData({ ...formData, rating: parseInt(value) })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">⭐ (1 estrela)</SelectItem>
                <SelectItem value="2">⭐⭐ (2 estrelas)</SelectItem>
                <SelectItem value="3">⭐⭐⭐ (3 estrelas)</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ (4 estrelas)</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ (5 estrelas)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sort_order">Ordem de Exibição</Label>
            <Input
              id="sort_order"
              type="number"
              value={formData.sort_order}
              onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
          </div>

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

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-brand-gold hover:bg-brand-gold-dark text-brand-black"
            >
              {mutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioTestimonialModal;
