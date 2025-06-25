
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { X, Plus, Calculator, Users, BarChart3, Shield, Zap, Settings, FileText, Database, Globe, Smartphone, Lightbulb, CreditCard, Coffee, QrCode, Truck, Link2, Bot, Monitor, TrendingUp, Banknote, Building2, Tablet, Fuel, Receipt } from 'lucide-react';

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  solution?: any;
  onSuccess: () => void;
  mode: 'create' | 'edit' | 'view';
}

interface ExistingSolution {
  id: string;
  title: string;
  key: string;
  icon_name: string;
}

const SolutionModal = ({ isOpen, onClose, solution, onSuccess, mode }: SolutionModalProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    key: '',
    status: 'active' as 'active' | 'inactive',
    icon_name: '',
    features: [] as string[],
    benefits: [] as string[],
    industries: [] as string[],
    card_image_url: '',
    hero_image_url: '',
    sort_order: null as number | null,
  });

  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newIndustry, setNewIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingSolutions, setExistingSolutions] = useState<ExistingSolution[]>([]);
  const { toast } = useToast();

  // Available icons with their components
  const availableIcons = {
    calculator: { component: Calculator, name: 'Calculator' },
    users: { component: Users, name: 'Users' },
    'bar-chart-3': { component: BarChart3, name: 'Bar Chart' },
    shield: { component: Shield, name: 'Shield' },
    zap: { component: Zap, name: 'Zap' },
    settings: { component: Settings, name: 'Settings' },
    'file-text': { component: FileText, name: 'File Text' },
    database: { component: Database, name: 'Database' },
    globe: { component: Globe, name: 'Globe' },
    smartphone: { component: Smartphone, name: 'Smartphone' },
    lightbulb: { component: Lightbulb, name: 'Lightbulb' },
    'credit-card': { component: CreditCard, name: 'Credit Card' },
    coffee: { component: Coffee, name: 'Coffee' },
    'qr-code': { component: QrCode, name: 'QR Code' },
    truck: { component: Truck, name: 'Truck' },
    link2: { component: Link2, name: 'Link' },
    bot: { component: Bot, name: 'Bot' },
    monitor: { component: Monitor, name: 'Monitor' },
    'trending-up': { component: TrendingUp, name: 'Trending Up' },
    banknote: { component: Banknote, name: 'Banknote' },
    building2: { component: Building2, name: 'Building' },
    tablet: { component: Tablet, name: 'Tablet' },
    fuel: { component: Fuel, name: 'Fuel' },
    receipt: { component: Receipt, name: 'Receipt' },
  };

  useEffect(() => {
    if (isOpen) {
      fetchExistingSolutions();
      if (solution && mode !== 'create') {
        setFormData({
          title: solution.title || '',
          description: solution.description || '',
          key: solution.key || '',
          status: solution.status || 'active',
          icon_name: solution.icon_name || '',
          features: solution.features || [],
          benefits: solution.benefits || [],
          industries: solution.industries || [],
          card_image_url: solution.card_image_url || '',
          hero_image_url: solution.hero_image_url || '',
          sort_order: solution.sort_order,
        });
      } else {
        resetForm();
      }
    }
  }, [isOpen, solution, mode]);

  const fetchExistingSolutions = async () => {
    try {
      let query = supabase
        .from('solutions')
        .select('id, title, key, icon_name')
        .order('title');

      // Only exclude current solution if we have a valid solution ID
      if (solution?.id && typeof solution.id === 'string' && solution.id.trim() !== '') {
        query = query.neq('id', solution.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      setExistingSolutions(data || []);
    } catch (error) {
      console.error('Error fetching existing solutions:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      key: '',
      status: 'active',
      icon_name: '',
      features: [],
      benefits: [],
      industries: [],
      card_image_url: '',
      hero_image_url: '',
      sort_order: null,
    });
    setNewFeature('');
    setNewBenefit('');
    setNewIndustry('');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addArrayItem = (field: 'features' | 'benefits' | 'industries', value: string, setValue: (val: string) => void) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
      setValue('');
    }
  };

  const removeArrayItem = (field: 'features' | 'benefits' | 'industries', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.description.trim() || !formData.key.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha título, descrição e chave.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        key: formData.key.trim(),
        icon_name: formData.icon_name || 'lightbulb',
        sort_order: formData.sort_order || null,
      };

      if (mode === 'create') {
        const { error } = await supabase
          .from('solutions')
          .insert([dataToSave]);

        if (error) {
          console.error('Database error:', error);
          toast({
            title: "Erro ao criar solução",
            description: error.message || "Não foi possível criar a solução.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Solução criada",
          description: "A solução foi criada com sucesso.",
        });
      } else if (mode === 'edit') {
        const { error } = await supabase
          .from('solutions')
          .update(dataToSave)
          .eq('id', solution.id);

        if (error) {
          console.error('Database error:', error);
          toast({
            title: "Erro ao atualizar solução",
            description: error.message || "Não foi possível atualizar a solução.",
            variant: "destructive",
          });
          return;
        }

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
        title: "Erro inesperado",
        description: error.message || "Ocorreu um erro inesperado.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const canEdit = mode === 'create' || mode === 'edit';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl border-0 bg-white rounded-lg">
        <DialogHeader className="border-b border-gray-100 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-xl flex items-center justify-center shadow-lg">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            {mode === 'create' && 'Nova Solução'}
            {mode === 'edit' && 'Editar Solução'}
            {mode === 'view' && 'Visualizar Solução'}
          </DialogTitle>
          <DialogDescription className="text-gray-600 mt-2 text-base">
            {mode === 'create' && 'Crie uma nova solução para o sistema'}
            {mode === 'edit' && 'Edite as informações da solução'}
            {mode === 'view' && 'Visualize os detalhes da solução'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Information */}
            <div className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Título *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  disabled={!canEdit}
                  className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                  placeholder="Digite o título da solução"
                />
              </div>

              <div>
                <Label htmlFor="key" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Chave *
                </Label>
                <Input
                  id="key"
                  value={formData.key}
                  onChange={(e) => handleInputChange('key', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  disabled={!canEdit}
                  className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                  placeholder="chave-da-solucao"
                />
              </div>

              <div>
                <Label htmlFor="status" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Status
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive') => handleInputChange('status', value)}
                  disabled={!canEdit}
                >
                  <SelectTrigger className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativa</SelectItem>
                    <SelectItem value="inactive">Inativa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sort_order" className="text-sm font-semibold text-gray-900 mb-2 block">
                  Ordem de Exibição
                </Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order || ''}
                  onChange={(e) => handleInputChange('sort_order', e.target.value ? parseInt(e.target.value) : null)}
                  disabled={!canEdit}
                  className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                  placeholder="Ex: 1, 2, 3..."
                />
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold text-gray-900 mb-4 block">
                  Ícone da Solução
                </Label>
                
                {/* Icons from existing solutions */}
                {existingSolutions.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs text-gray-500 mb-3 font-medium">Ícones de soluções existentes:</p>
                    <div className="grid grid-cols-4 gap-3">
                      {existingSolutions.map((sol) => {
                        const IconComponent = availableIcons[sol.icon_name as keyof typeof availableIcons]?.component || Lightbulb;
                        return (
                          <button
                            key={sol.id}
                            type="button"
                            onClick={() => canEdit && handleInputChange('icon_name', sol.icon_name)}
                            disabled={!canEdit}
                            className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                              formData.icon_name === sol.icon_name
                                ? 'border-brand-gold bg-brand-gold/10 shadow-lg'
                                : 'border-gray-200 hover:border-brand-gold/50 hover:bg-brand-gold/5 hover:shadow-md'
                            } ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            title={`${sol.title} (${sol.key})`}
                          >
                            <IconComponent className={`w-6 h-6 ${formData.icon_name === sol.icon_name ? 'text-brand-gold' : 'text-gray-600'}`} />
                            <span className="text-xs text-gray-600 truncate w-full text-center font-medium">
                              {sol.title}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Available icons */}
                <div>
                  <p className="text-xs text-gray-500 mb-3 font-medium">Ícones disponíveis:</p>
                  <div className="grid grid-cols-4 gap-3">
                    {Object.entries(availableIcons).map(([key, { component: IconComponent, name }]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => canEdit && handleInputChange('icon_name', key)}
                        disabled={!canEdit}
                        className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                          formData.icon_name === key
                            ? 'border-brand-gold bg-brand-gold/10 shadow-lg'
                            : 'border-gray-200 hover:border-brand-gold/50 hover:bg-brand-gold/5 hover:shadow-md'
                        } ${!canEdit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <IconComponent className={`w-6 h-6 ${formData.icon_name === key ? 'text-brand-gold' : 'text-gray-600'}`} />
                        <span className="text-xs text-gray-600 font-medium">{name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-sm font-semibold text-gray-900 mb-2 block">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              disabled={!canEdit}
              className="border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
              rows={4}
              placeholder="Descreva a solução detalhadamente"
            />
          </div>

          {/* Features */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">Características</Label>
            {canEdit && (
              <div className="flex gap-3 mb-4">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Nova característica"
                  className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addArrayItem('features', newFeature, setNewFeature)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('features', newFeature, setNewFeature)}
                  className="h-12 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 py-1 px-3">
                  {feature}
                  {canEdit && (
                    <button
                      onClick={() => removeArrayItem('features', index)}
                      className="ml-2 text-blue-400 hover:text-blue-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">Benefícios</Label>
            {canEdit && (
              <div className="flex gap-3 mb-4">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Novo benefício"
                  className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addArrayItem('benefits', newBenefit, setNewBenefit)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('benefits', newBenefit, setNewBenefit)}
                  className="h-12 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.benefits.map((benefit, index) => (
                <Badge key={index} variant="outline" className="border-green-200 text-green-700 bg-green-50 py-1 px-3">
                  {benefit}
                  {canEdit && (
                    <button
                      onClick={() => removeArrayItem('benefits', index)}
                      className="ml-2 text-green-400 hover:text-green-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Industries */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">Segmentos</Label>
            {canEdit && (
              <div className="flex gap-3 mb-4">
                <Input
                  value={newIndustry}
                  onChange={(e) => setNewIndustry(e.target.value)}
                  placeholder="Novo segmento"
                  className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addArrayItem('industries', newIndustry, setNewIndustry)}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('industries', newIndustry, setNewIndustry)}
                  className="h-12 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-white shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.industries.map((industry, index) => (
                <Badge key={index} variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 py-1 px-3">
                  {industry}
                  {canEdit && (
                    <button
                      onClick={() => removeArrayItem('industries', index)}
                      className="ml-2 text-purple-400 hover:text-purple-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="card_image_url" className="text-sm font-semibold text-gray-900 mb-2 block">
                URL da Imagem do Card
              </Label>
              <Input
                id="card_image_url"
                value={formData.card_image_url}
                onChange={(e) => handleInputChange('card_image_url', e.target.value)}
                disabled={!canEdit}
                className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                placeholder="https://exemplo.com/imagem.jpg"
              />
            </div>

            <div>
              <Label htmlFor="hero_image_url" className="text-sm font-semibold text-gray-900 mb-2 block">
                URL da Imagem Hero
              </Label>
              <Input
                id="hero_image_url"
                value={formData.hero_image_url}
                onChange={(e) => handleInputChange('hero_image_url', e.target.value)}
                disabled={!canEdit}
                className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                placeholder="https://exemplo.com/hero.jpg"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-12 px-6 border-gray-300 text-gray-600 hover:bg-gray-50 shadow-sm"
          >
            {mode === 'view' ? 'Fechar' : 'Cancelar'}
          </Button>
          {canEdit && (
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="h-12 px-8 bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {loading ? 'Salvando...' : (mode === 'create' ? 'Criar Solução' : 'Salvar Alterações')}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SolutionModal;
