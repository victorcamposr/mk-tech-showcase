
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Plus, X, Lightbulb, Calculator, Users, BarChart3, Shield, Zap, Settings, FileText, Database, Globe, Smartphone, CreditCard, Coffee, QrCode, Truck, Link2, Bot, Monitor, TrendingUp, Banknote, Building2, Tablet, Fuel, Receipt } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ImageUpload } from '@/components/ui/image-upload';

const solutionSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  key: z.string().min(1, 'Chave é obrigatória'),
  status: z.enum(['active', 'inactive']),
  icon_name: z.string().min(1, 'Ícone é obrigatório'),
  card_image_url: z.string().optional(),
  hero_image_url: z.string().optional(),
  sort_order: z.number().optional(),
});

type SolutionFormData = z.infer<typeof solutionSchema>;

const CreateSolution = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [features, setFeatures] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);

  const [newFeature, setNewFeature] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newIndustry, setNewIndustry] = useState('');

  const form = useForm<SolutionFormData>({
    resolver: zodResolver(solutionSchema),
    defaultValues: {
      title: '',
      description: '',
      key: '',
      status: 'active',
      icon_name: 'lightbulb',
      card_image_url: '',
      hero_image_url: '',
      sort_order: undefined,
    },
  });

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

  const logActivity = async (action: string, entityTitle: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();

      await supabase.from('admin_activities').insert({
        action_type: action,
        entity_type: 'solutions',
        entity_title: entityTitle,
        user_name: profile?.name || 'Admin'
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const handleTitleChange = (value: string) => {
    form.setValue('title', value);
    // Auto-generate key from title
    const key = value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
    form.setValue('key', key);
  };

  const addArrayItem = (field: 'features' | 'benefits' | 'industries', value: string, setValue: (val: string) => void) => {
    if (value.trim()) {
      const currentArray = field === 'features' ? features : field === 'benefits' ? benefits : industries;
      if (!currentArray.includes(value.trim())) {
        const newArray = [...currentArray, value.trim()];
        if (field === 'features') setFeatures(newArray);
        else if (field === 'benefits') setBenefits(newArray);
        else setIndustries(newArray);
        setValue('');
      }
    }
  };

  const removeArrayItem = (field: 'features' | 'benefits' | 'industries', index: number) => {
    if (field === 'features') {
      setFeatures(prev => prev.filter((_, i) => i !== index));
    } else if (field === 'benefits') {
      setBenefits(prev => prev.filter((_, i) => i !== index));
    } else {
      setIndustries(prev => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (data: SolutionFormData) => {
    setLoading(true);
    try {
      const dataToSave = {
        title: data.title,
        description: data.description,
        key: data.key,
        status: data.status,
        icon_name: data.icon_name,
        card_image_url: data.card_image_url || '',
        hero_image_url: data.hero_image_url || '',
        sort_order: data.sort_order || 0,
        features,
        benefits,
        industries,
      };

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

      await logActivity('create', data.title);

      toast({
        title: "Solução criada",
        description: "A solução foi criada com sucesso.",
      });

      navigate('/admin/solutions');
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

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/admin/solutions')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-xl flex items-center justify-center shadow-lg">
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              Nova Solução
            </h1>
            <p className="text-gray-600 mt-2">
              Crie uma nova solução para o sistema
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-brand-gold/20">
          <CardHeader className="bg-gradient-to-r from-brand-gold/5 to-brand-gold/10 border-b border-brand-gold/20">
            <CardTitle className="text-brand-black">Informações da Solução</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 py-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900">
                            Título *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                handleTitleChange(e.target.value);
                              }}
                              className={`h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm ${
                                form.formState.errors.title ? 'border-red-500 focus:border-red-500' : ''
                              }`}
                              placeholder="Digite o título da solução"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="key"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900">
                            Chave *
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={`h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm ${
                                form.formState.errors.key ? 'border-red-500 focus:border-red-500' : ''
                              }`}
                              placeholder="chave-da-solucao"
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900">
                            Status
                          </FormLabel>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="active">Ativa</SelectItem>
                              <SelectItem value="inactive">Inativa</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sort_order"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900">
                            Ordem de Exibição
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              value={field.value || ''}
                              onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                              className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                              placeholder="Ex: 1, 2, 3..."
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Icon Selection */}
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="icon_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-semibold text-gray-900 mb-4 block">
                            Ícone da Solução *
                          </FormLabel>
                          <div className="grid grid-cols-4 gap-3">
                            {Object.entries(availableIcons).map(([key, { component: IconComponent, name }]) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => field.onChange(key)}
                                className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-all duration-300 ${
                                  field.value === key
                                    ? 'border-brand-gold bg-brand-gold/10 shadow-lg'
                                    : 'border-gray-200 hover:border-brand-gold/50 hover:bg-brand-gold/5 hover:shadow-md'
                                } cursor-pointer`}
                              >
                                <IconComponent className={`w-6 h-6 ${field.value === key ? 'text-brand-gold' : 'text-gray-600'}`} />
                                <span className="text-xs text-gray-600 font-medium">{name}</span>
                              </button>
                            ))}
                          </div>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-900">
                        Descrição *
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className={`border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm ${
                            form.formState.errors.description ? 'border-red-500 focus:border-red-500' : ''
                          }`}
                          rows={4}
                          placeholder="Descreva a solução detalhadamente"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />

                {/* Features */}
                <div>
                  <Label className="text-sm font-semibold text-gray-900 mb-3 block">Características</Label>
                  <div className="flex gap-3 mb-4">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Nova característica"
                      className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('features', newFeature, setNewFeature))}
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
                  <div className="flex flex-wrap gap-2">
                    {features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="border-blue-200 text-blue-700 bg-blue-50 py-1 px-3">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('features', index)}
                          className="ml-2 text-blue-400 hover:text-blue-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Benefits */}
                <div>
                  <Label className="text-sm font-semibold text-gray-900 mb-3 block">Benefícios</Label>
                  <div className="flex gap-3 mb-4">
                    <Input
                      value={newBenefit}
                      onChange={(e) => setNewBenefit(e.target.value)}
                      placeholder="Novo benefício"
                      className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('benefits', newBenefit, setNewBenefit))}
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
                  <div className="flex flex-wrap gap-2">
                    {benefits.map((benefit, index) => (
                      <Badge key={index} variant="outline" className="border-green-200 text-green-700 bg-green-50 py-1 px-3">
                        {benefit}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('benefits', index)}
                          className="ml-2 text-green-400 hover:text-green-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Industries */}
                <div>
                  <Label className="text-sm font-semibold text-gray-900 mb-3 block">Segmentos</Label>
                  <div className="flex gap-3 mb-4">
                    <Input
                      value={newIndustry}
                      onChange={(e) => setNewIndustry(e.target.value)}
                      placeholder="Novo segmento"
                      className="h-12 border-gray-300 focus:border-brand-gold focus:ring-brand-gold shadow-sm"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('industries', newIndustry, setNewIndustry))}
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
                  <div className="flex flex-wrap gap-2">
                    {industries.map((industry, index) => (
                      <Badge key={index} variant="outline" className="border-purple-200 text-purple-700 bg-purple-50 py-1 px-3">
                        {industry}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('industries', index)}
                          className="ml-2 text-purple-400 hover:text-purple-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ImageUpload
                    label="Imagem do Card"
                    value={form.watch('card_image_url')}
                    onChange={(url) => form.setValue('card_image_url', url)}
                  />

                  <ImageUpload
                    label="Imagem Hero"
                    value={form.watch('hero_image_url')}
                    onChange={(url) => form.setValue('hero_image_url', url)}
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/admin/solutions')}
                    className="h-12 px-6 border-gray-300 text-gray-600 hover:bg-gray-50 shadow-sm"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-8 bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {loading ? 'Salvando...' : 'Criar Solução'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default CreateSolution;

