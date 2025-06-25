
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lightbulb, Plus, Save } from 'lucide-react';

interface SolutionData {
  title: string;
  description: string;
  key: string;
  icon_name: string;
  status: 'active' | 'inactive';
  features: string;
  benefits: string;
  industries: string;
  card_image_url: string;
  hero_image_url: string;
  sort_order: number;
}

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  solution?: any;
  mode: 'create' | 'edit' | 'view';
}

const SolutionModal = ({ isOpen, onClose, onSuccess, solution, mode }: SolutionModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SolutionData>({
    defaultValues: {
      title: '',
      description: '',
      key: '',
      icon_name: '',
      status: 'active',
      features: '',
      benefits: '',
      industries: '',
      card_image_url: '',
      hero_image_url: '',
      sort_order: 0,
    },
  });

  // Função para registrar atividades
  const logActivity = async (actionType: string, entityTitle: string, entityId?: string) => {
    try {
      await supabase
        .from('admin_activities')
        .insert([{
          action_type: actionType,
          entity_type: 'solution',
          entity_id: entityId,
          entity_title: entityTitle,
          user_name: 'Admin', // Temporário - em produção seria do perfil do usuário
        }]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Reset form when solution changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (solution) {
        console.log('Setting form values for solution:', solution);
        form.reset({
          title: solution.title || '',
          description: solution.description || '',
          key: solution.key || '',
          icon_name: solution.icon_name || '',
          status: solution.status || 'active',
          features: Array.isArray(solution.features) ? solution.features.join(', ') : (solution.features || ''),
          benefits: Array.isArray(solution.benefits) ? solution.benefits.join(', ') : (solution.benefits || ''),
          industries: Array.isArray(solution.industries) ? solution.industries.join(', ') : (solution.industries || ''),
          card_image_url: solution.card_image_url || '',
          hero_image_url: solution.hero_image_url || '',
          sort_order: solution.sort_order || 0,
        });
      } else {
        // Reset para valores padrão quando criando nova solução
        form.reset({
          title: '',
          description: '',
          key: '',
          icon_name: '',
          status: 'active',
          features: '',
          benefits: '',
          industries: '',
          card_image_url: '',
          hero_image_url: '',
          sort_order: 0,
        });
      }
    }
  }, [isOpen, solution, form]);

  const onSubmit = async (data: SolutionData) => {
    if (mode === 'view') return;
    
    setLoading(true);
    console.log('Submitting solution data:', data);
    
    try {
      const featuresArray = data.features ? data.features.split(',').map(item => item.trim()).filter(item => item) : [];
      const benefitsArray = data.benefits ? data.benefits.split(',').map(item => item.trim()).filter(item => item) : [];
      const industriesArray = data.industries ? data.industries.split(',').map(item => item.trim()).filter(item => item) : [];
      
      if (mode === 'create') {
        const { data: result, error } = await supabase
          .from('solutions')
          .insert([{
            title: data.title,
            description: data.description,
            key: data.key,
            icon_name: data.icon_name,
            status: data.status,
            features: featuresArray,
            benefits: benefitsArray,
            industries: industriesArray,
            card_image_url: data.card_image_url || null,
            hero_image_url: data.hero_image_url || null,
            sort_order: data.sort_order,
          }])
          .select()
          .single();

        console.log('Insert result:', result, 'Error:', error);
        if (error) throw error;
        
        // Registrar atividade
        await logActivity('create', data.title, result.id);
        
        toast({
          title: "Solução criada com sucesso!",
          description: "A nova solução foi adicionada ao catálogo.",
        });
      } else {
        const { data: result, error } = await supabase
          .from('solutions')
          .update({
            title: data.title,
            description: data.description,
            key: data.key,
            icon_name: data.icon_name,
            status: data.status,
            features: featuresArray,
            benefits: benefitsArray,
            industries: industriesArray,
            card_image_url: data.card_image_url || null,
            hero_image_url: data.hero_image_url || null,
            sort_order: data.sort_order,
          })
          .eq('id', solution.id)
          .select()
          .single();

        console.log('Update result:', result, 'Error:', error);
        if (error) throw error;
        
        // Registrar atividade
        await logActivity('update', data.title, solution.id);
        
        toast({
          title: "Solução atualizada com sucesso!",
          description: "As alterações foram salvas.",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving solution:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar solução",
        description: error.message || "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-brand-gold" />
            {mode === 'create' ? 'Nova Solução' : mode === 'edit' ? 'Editar Solução' : 'Visualizar Solução'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da solução" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="key"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chave *</FormLabel>
                    <FormControl>
                      <Input placeholder="chave-da-solucao" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição detalhada da solução" 
                      className="min-h-[100px]" 
                      {...field} 
                      disabled={isReadOnly}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="icon_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Ícone</FormLabel>
                    <FormControl>
                      <Input placeholder="shopping-cart" {...field} disabled={isReadOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isReadOnly}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativa</SelectItem>
                        <SelectItem value="inactive">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ordem</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recursos (separados por vírgula)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Controle de estoque, Relatórios, Integração" 
                        className="min-h-[80px]" 
                        {...field} 
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="benefits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Benefícios (separados por vírgula)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Economia de tempo, Maior controle, Redução de custos" 
                        className="min-h-[80px]" 
                        {...field} 
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="industries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Segmentos (separados por vírgula)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Restaurantes, Lanchonetes, Pizzarias" 
                        className="min-h-[80px]" 
                        {...field} 
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="card_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem do Card (URL)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://exemplo.com/card-image.jpg" 
                        {...field} 
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hero_image_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem Hero (URL)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://exemplo.com/hero-image.jpg" 
                        {...field} 
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {!isReadOnly && (
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-brand-black" />
                  ) : (
                    <>
                      {mode === 'create' ? <Plus className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      {mode === 'create' ? 'Criar Solução' : 'Salvar Alterações'}
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SolutionModal;
