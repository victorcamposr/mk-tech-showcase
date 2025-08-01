
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { logAdminActivity } from '@/utils/adminActivity';

interface PortfolioStatsModalProps {
  open: boolean;
  onClose: () => void;
  editingItem?: any;
}

const PortfolioStatsModal = ({ open, onClose, editingItem }: PortfolioStatsModalProps) => {
  const [formData, setFormData] = useState({
    value: 0,
    sort_order: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingItem) {
      console.log('PortfolioStatsModal - Editing item:', editingItem);
      setFormData({
        value: editingItem.value || 0,
        sort_order: editingItem.sort_order || 0
      });
    } else {
      setFormData({
        value: 0,
        sort_order: 0
      });
    }
  }, [editingItem, open]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!editingItem) {
        console.error('No editing item provided for update');
        throw new Error('Item não encontrado para edição');
      }
      
      console.log('Updating portfolio stat with data:', data, 'for item:', editingItem.id);
      
      const { error } = await supabase
        .from('portfolio_stats')
        .update(data)
        .eq('id', editingItem.id);
      
      if (error) {
        console.error('Supabase error updating portfolio stat:', error);
        throw error;
      }
      
      console.log('Portfolio stat updated successfully');
    },
    onSuccess: async () => {
      console.log('Portfolio stats updated, invalidating all related queries...');
      
      // Invalidar todas as queries relacionadas ao portfólio com mais especificidade
      const queries = [
        'admin-portfolio-stats',
        'portfolio-stats', 
        'dashboard-stats'
      ];
      
      await Promise.all([
        ...queries.map(key => queryClient.invalidateQueries({ queryKey: [key] })),
        queryClient.refetchQueries({ queryKey: ['dashboard-stats'] }),
        // Forçar refetch dos dados do portfólio público
        queryClient.refetchQueries({ queryKey: ['portfolio-stats'] })
      ]);
      
      console.log('All portfolio stats queries invalidated and dashboard refetched');
      
      // Log admin activity
      await logAdminActivity(
        'update',
        'portfolio_stats',
        `${editingItem.label} - Valor: ${formData.value}${editingItem.suffix || ''}`
      );
      
      toast({
        title: "Estatística atualizada!",
        description: "As alterações foram salvas e atualizadas em todo o sistema.",
      });
      onClose();
    },
    onError: (error) => {
      console.error('Error saving portfolio stat:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: error.message || "Não foi possível salvar a estatística. Tente novamente.",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) {
      console.error('No editing item available for submission');
      return;
    }
    console.log('Submitting portfolio stats form with data:', formData);
    mutation.mutate(formData);
  };

  if (!editingItem) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Estatística: {editingItem.label}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">Valor</Label>
            <Input
              id="value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
              placeholder="ex: 100"
              required
            />
            <p className="text-sm text-gray-500">
              Será exibido como: {formData.value}{editingItem.suffix || ''}
            </p>
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

export default PortfolioStatsModal;
