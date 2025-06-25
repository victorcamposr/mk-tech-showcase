
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Lightbulb, Plus, Save } from 'lucide-react';

interface SolutionData {
  title: string;
  key: string;
  description: string;
  features: string;
  benefits: string;
  industries: string;
  icon_name: string;
  status: 'active' | 'inactive';
  sort_order: number;
}

interface SolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  solution?: any;
  mode: 'create' | 'edit';
}

const SolutionModal = ({ isOpen, onClose, onSuccess, solution, mode }: SolutionModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SolutionData>({
    defaultValues: {
      title: '',
      key: '',
      description: '',
      features: '',
      benefits: '',
      industries: '',
      icon_name: 'Lightbulb',
      status: 'active',
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
          key: solution.key || '',
          description: solution.description || '',
          features: Array.isArray(solution.features) ? solution.features.join('\n') : solution.features || '',
          benefits: Array.isArray(solution.benefits) ? solution.benefits.join('\n') : solution.benefits || '',
          industries: Array.isArray(solution.industries) ? solution.industries.join('\n') : solution.industries || '',
          icon_name: solution.icon_name || 'Lightbulb',
          status: solution.status || 'active',
          sort_order: solution.sort_order || 0,
        });
      } else {
        form.reset({
          title: '',
          key: '',
          description: '',
          features: '',
          benefits: '',
          industries: '',
          icon_name: 'Lightbulb',
          status: 'active',
          sort_order: 0,
        });
      }
    }
  }, [isOpen, solution, form]);

  const onSubmit = async (data: SolutionData) => {
    setLoading(true);
    console.log('Submitting solution data:', data);
    
    try {
      const solutionData = {
        title: data.title,
        key: data.key,
        description: data.description,
        features: data.features.split('\n').filter(f => f.trim()),
        benefits: data.benefits.split('\n').filter(b => b.trim()),
        industries: data.industries.split('\n').filter(i => i.trim()),
        icon_name: data.icon_name,
        status: data.status,
        sort_order: data.sort_order,
      };

      if (mode === 'create') {
        const { data: result, error } = await supabase
          .from('solutions')
          .insert([solutionData])
          .select()
          .single();

        console.log('Insert result:', result, 'Error:', error);
        if (error) throw error;
        
        // Registrar atividade
        await logActivity('create', data.title, result.id);
        
        toast({
          title: "Solução criada com sucesso!",
          description: "A nova solução foi adicionada ao sistema.",
        });
      } else {
        const { data: result, error } = await supabase
          .from('solutions')
          .update(solutionData)
          .eq('id', solution.id)
          .select()
          .single();

        console.log('Update result:', result, 'Error:', error);
        if (error) throw error;
        
        // Registrar atividade
        await logActivity('update', data.title, solution.id);
        
        toast({
          title: "Solução atualizada com sucesso!",
          description: "As informações foram salvas.",
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-brand-gold" />
            {mode === 'create' ? 'Nova Solução' : 'Editar Solução'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome da solução" {...field} />
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
                    <FormLabel>Chave (URL)</FormLabel>
                    <FormControl>
                      <Input placeholder="pdv-frente-caixa" {...field} />
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
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descrição detalhada da solução" 
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="features"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recursos (um por linha)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Recurso 1&#10;Recurso 2&#10;Recurso 3"
                      className="min-h-[100px]"
                      {...field} 
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
                  <FormLabel>Benefícios (um por linha)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Benefício 1&#10;Benefício 2&#10;Benefício 3"
                      className="min-h-[100px]"
                      {...field} 
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
                  <FormLabel>Segmentos (um por linha)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Varejo&#10;Restaurantes&#10;Serviços"
                      className="min-h-[80px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="icon_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o ícone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Monitor">Monitor</SelectItem>
                        <SelectItem value="Package">Package</SelectItem>
                        <SelectItem value="FileText">FileText</SelectItem>
                        <SelectItem value="DollarSign">DollarSign</SelectItem>
                        <SelectItem value="Droplets">Droplets</SelectItem>
                        <SelectItem value="CreditCard">CreditCard</SelectItem>
                        <SelectItem value="Lightbulb">Lightbulb</SelectItem>
                      </SelectContent>
                    </Select>
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
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Ativo</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
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
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                    {mode === 'create' ? 'Criar' : 'Salvar'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default SolutionModal;
