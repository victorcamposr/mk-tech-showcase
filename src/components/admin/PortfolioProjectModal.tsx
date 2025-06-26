
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { X, Plus } from 'lucide-react';
import { logAdminActivity } from '@/utils/adminActivity';

interface PortfolioProjectModalProps {
  open: boolean;
  onClose: () => void;
  editingItem?: any;
}

const PortfolioProjectModal = ({ open, onClose, editingItem }: PortfolioProjectModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    results: [''],
    image_url: '',
    status: 'active' as 'active' | 'inactive',
    sort_order: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (editingItem) {
      setFormData({
        title: editingItem.title || '',
        category: editingItem.category || '',
        description: editingItem.description || '',
        results: editingItem.results || [''],
        image_url: editingItem.image_url || '',
        status: editingItem.status || 'active',
        sort_order: editingItem.sort_order || 0
      });
    } else {
      setFormData({
        title: '',
        category: '',
        description: '',
        results: [''],
        image_url: '',
        status: 'active',
        sort_order: 0
      });
    }
  }, [editingItem, open]);

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const filteredResults = data.results.filter(result => result.trim() !== '');
      const submitData = { ...data, results: filteredResults };
      
      if (editingItem) {
        const { error } = await supabase
          .from('portfolio_projects')
          .update(submitData)
          .eq('id', editingItem.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('portfolio_projects')
          .insert([submitData]);
        if (error) throw error;
      }
    },
    onSuccess: async () => {
      // Invalidar todas as queries relacionadas
      await queryClient.invalidateQueries({ queryKey: ['admin-portfolio-projects'] });
      await queryClient.invalidateQueries({ queryKey: ['portfolio-projects'] });
      
      // Log admin activity
      await logAdminActivity(
        editingItem ? 'update' : 'create',
        'portfolio_projects',
        formData.title
      );
      
      toast({
        title: editingItem ? "Projeto atualizado!" : "Projeto criado!",
        description: "As alterações foram salvas com sucesso.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Não foi possível salvar o projeto. Tente novamente.",
      });
      console.error('Error saving project:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const addResult = () => {
    setFormData({ ...formData, results: [...formData.results, ''] });
  };

  const removeResult = (index: number) => {
    const newResults = formData.results.filter((_, i) => i !== index);
    setFormData({ ...formData, results: newResults });
  };

  const updateResult = (index: number, value: string) => {
    const newResults = [...formData.results];
    newResults[index] = value;
    setFormData({ ...formData, results: newResults });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingItem ? 'Editar Projeto' : 'Novo Projeto'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Nome da Empresa</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="ex: Supermercado Central"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="ex: Varejo Alimentício"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva o projeto implementado..."
              rows={4}
              required
            />
          </div>

          <ImageUpload
            label="Imagem do Projeto"
            value={formData.image_url}
            onChange={(url) => setFormData({ ...formData, image_url: url })}
            disabled={mutation.isPending}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Resultados Obtidos</Label>
              <Button type="button" size="sm" variant="outline" onClick={addResult}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {formData.results.map((result, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={result}
                    onChange={(e) => updateResult(index, e.target.value)}
                    placeholder="ex: Redução de 40% no tempo de fechamento"
                  />
                  {formData.results.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeResult(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
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

export default PortfolioProjectModal;
