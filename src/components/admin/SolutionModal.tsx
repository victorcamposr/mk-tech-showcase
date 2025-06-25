
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Solution {
  id: string;
  title: string;
  description: string;
  key: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  icon_name: string;
  features: string[];
  benefits: string[];
  industries: string[];
  card_image_url: string | null;
  hero_image_url: string | null;
  sort_order: number | null;
}

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution?: Solution | null;
  onSuccess: () => void;
  mode: 'create' | 'edit' | 'view';
}

const SolutionModal = ({ isOpen, onClose, solution, onSuccess, mode }: SolutionModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    key: '',
    status: 'active' as 'active' | 'inactive',
    icon_name: 'Lightbulb',
    features: [] as string[],
    benefits: [] as string[],
    industries: [] as string[]
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (solution && (mode === 'edit' || mode === 'view')) {
      setFormData({
        title: solution.title,
        description: solution.description,
        key: solution.key,
        status: solution.status,
        icon_name: solution.icon_name || 'Lightbulb',
        features: solution.features || [],
        benefits: solution.benefits || [],
        industries: solution.industries || []
      });
    } else {
      setFormData({
        title: '',
        description: '',
        key: '',
        status: 'active',
        icon_name: 'Lightbulb',
        features: [],
        benefits: [],
        industries: []
      });
    }
  }, [solution, mode, isOpen]);

  const generateKey = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'view') return;

    setLoading(true);
    try {
      const solutionData = {
        title: formData.title,
        description: formData.description,
        key: formData.key || generateKey(formData.title),
        status: formData.status,
        icon_name: formData.icon_name,
        features: formData.features,
        benefits: formData.benefits,
        industries: formData.industries
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('solutions')
          .insert(solutionData);

        if (error) throw error;

        toast({
          title: "Solução criada",
          description: "A solução foi criada com sucesso.",
        });
      } else if (mode === 'edit' && solution) {
        const { error } = await supabase
          .from('solutions')
          .update(solutionData)
          .eq('id', solution.id);

        if (error) throw error;

        toast({
          title: "Solução atualizada",
          description: "A solução foi atualizada com sucesso.",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error saving solution:', error);
      toast({
        title: "Erro ao salvar solução",
        description: error.message || "Ocorreu um erro ao salvar a solução.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Nova Solução';
      case 'edit': return 'Editar Solução';
      case 'view': return 'Visualizar Solução';
      default: return 'Solução';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData(prev => ({
                  ...prev,
                  title,
                  key: prev.key || generateKey(title)
                }));
              }}
              placeholder="Título da solução"
              disabled={mode === 'view'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="key">Chave da URL *</Label>
            <Input
              id="key"
              value={formData.key}
              onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
              placeholder="chave-da-url"
              disabled={mode === 'view'}
              required
            />
            <p className="text-sm text-gray-500">
              Esta chave será usada na URL: /solucoes/{formData.key}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Descrição da solução"
              rows={4}
              disabled={mode === 'view'}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon_name">Ícone</Label>
            <Input
              id="icon_name"
              value={formData.icon_name}
              onChange={(e) => setFormData(prev => ({ ...prev, icon_name: e.target.value }))}
              placeholder="Nome do ícone (ex: Lightbulb)"
              disabled={mode === 'view'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: 'active' | 'inactive') => 
                setFormData(prev => ({ ...prev, status: value }))
              }
              disabled={mode === 'view'}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativa</SelectItem>
                <SelectItem value="inactive">Inativa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {mode !== 'view' && (
            <div className="flex justify-end space-x-2 pt-4 border-t">
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
                className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black"
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mode === 'create' ? 'Criar Solução' : 'Salvar Alterações'}
              </Button>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SolutionModal;
