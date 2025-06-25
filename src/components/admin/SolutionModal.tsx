
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

const iconOptions = [
  'Lightbulb',
  'Monitor',
  'Package',
  'Receipt',
  'DollarSign',
  'Headphones',
  'FileText',
  'Settings',
  'Cog',
  'Zap',
  'Shield',
  'Target',
  'TrendingUp',
  'Users',
  'Database',
  'Cloud',
  'Smartphone',
  'Globe'
];

const SolutionModal = ({ isOpen, onClose, solution, onSuccess, mode }: SolutionModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    key: '',
    status: 'active' as 'active' | 'inactive',
    icon_name: 'Lightbulb',
    features: [] as string[],
    benefits: [] as string[],
    industries: [] as string[],
    card_image_url: '',
    hero_image_url: '',
    sort_order: 0
  });
  const [featuresText, setFeaturesText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [industriesText, setIndustriesText] = useState('');
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
        industries: solution.industries || [],
        card_image_url: solution.card_image_url || '',
        hero_image_url: solution.hero_image_url || '',
        sort_order: solution.sort_order || 0
      });
      setFeaturesText((solution.features || []).join(', '));
      setBenefitsText((solution.benefits || []).join(', '));
      setIndustriesText((solution.industries || []).join(', '));
    } else {
      setFormData({
        title: '',
        description: '',
        key: '',
        status: 'active',
        icon_name: 'Lightbulb',
        features: [],
        benefits: [],
        industries: [],
        card_image_url: '',
        hero_image_url: '',
        sort_order: 0
      });
      setFeaturesText('');
      setBenefitsText('');
      setIndustriesText('');
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
        features: featuresText ? featuresText.split(',').map(item => item.trim()).filter(item => item) : [],
        benefits: benefitsText ? benefitsText.split(',').map(item => item.trim()).filter(item => item) : [],
        industries: industriesText ? industriesText.split(',').map(item => item.trim()).filter(item => item) : [],
        card_image_url: formData.card_image_url || null,
        hero_image_url: formData.hero_image_url || null,
        sort_order: formData.sort_order
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
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">{getModalTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="icon_name">Ícone</Label>
              <Select
                value={formData.icon_name}
                onValueChange={(value) => setFormData(prev => ({ ...prev, icon_name: value }))}
                disabled={mode === 'view'}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon}>
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label htmlFor="sort_order">Ordem</Label>
              <Input
                id="sort_order"
                type="number"
                value={formData.sort_order}
                onChange={(e) => setFormData(prev => ({ ...prev, sort_order: parseInt(e.target.value) || 0 }))}
                placeholder="0"
                disabled={mode === 'view'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Recursos (separados por vírgula)</Label>
            <Textarea
              id="features"
              value={featuresText}
              onChange={(e) => setFeaturesText(e.target.value)}
              placeholder="Recurso 1, Recurso 2, Recurso 3"
              rows={3}
              disabled={mode === 'view'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefícios (separados por vírgula)</Label>
            <Textarea
              id="benefits"
              value={benefitsText}
              onChange={(e) => setBenefitsText(e.target.value)}
              placeholder="Benefício 1, Benefício 2, Benefício 3"
              rows={3}
              disabled={mode === 'view'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industries">Segmentos (separados por vírgula)</Label>
            <Textarea
              id="industries"
              value={industriesText}
              onChange={(e) => setIndustriesText(e.target.value)}
              placeholder="Varejo, Indústria, Serviços"
              rows={2}
              disabled={mode === 'view'}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="card_image_url">Imagem do Card (URL)</Label>
              <Input
                id="card_image_url"
                value={formData.card_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, card_image_url: e.target.value }))}
                placeholder="https://exemplo.com/imagem-card.jpg"
                disabled={mode === 'view'}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hero_image_url">Imagem Hero (URL)</Label>
              <Input
                id="hero_image_url"
                value={formData.hero_image_url}
                onChange={(e) => setFormData(prev => ({ ...prev, hero_image_url: e.target.value }))}
                placeholder="https://exemplo.com/imagem-hero.jpg"
                disabled={mode === 'view'}
              />
            </div>
          </div>

          {mode !== 'view' && (
            <div className="flex justify-end space-x-2 pt-6 border-t">
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
