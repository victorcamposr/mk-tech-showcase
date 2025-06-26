
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface PortfolioStatsModalProps {
  open: boolean;
  onClose: () => void;
  editingItem?: any;
}

const PortfolioStatsModal = ({ open, onClose, editingItem }: PortfolioStatsModalProps) => {
  const [formData, setFormData] = useState({
    key: '',
    label: '',
    value: 0,
    suffix: '',
    status: 'active' as 'active' | 'inactive',
    sort_order: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingItem) {
      setFormData({
        key: editingItem.key || '',
        label: editingItem.label || '',
        value: editingItem.value || 0,
        suffix: editingItem.suffix || '',
        status: editingItem.status || 'active',
        sort_order: editingItem.sort_order || 0
      });
    } else {
      setFormData({
        key: '',
        label: '',
        value: 0,
        suffix: '',
        status: 'active',
        sort_order: 0
      });
    }
  }, [editingItem, open]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (editingItem) {
        const { error } = await supabase
          .from('portfolio_stats')
          .update(data)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_stats')
          .insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-portfolio-stats'] });
      toast({
        title: editingItem ? "Estatística atualizada!" : "Estatística criada!",
        description: "As alterações foram salvas com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar a estatística. Tente novamente.",
      });
      console.error('Error saving stat:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Editar Estatística' : 'Nova Estatística'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="key">Chave (identificador único)</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => setFormData({ ...formData, key: e.target.value })}
              placeholder="ex: companies, segments"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="label">Nome da Estatística</Label>
            <Input
              id="label"
              value={formData.label}
              onChange={(e) => setFormData({ ...formData, label: e.target.value })}
              placeholder="ex: Empresas Atendidas"
              required
            />
          </div>

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
          </div>

          <div className="space-y-2">
            <Label htmlFor="suffix">Sufixo</Label>
            <Input
              id="suffix"
              value={formData.suffix}
              onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
              placeholder="ex: +, %, etc"
            />
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

export default PortfolioStatsModal;
