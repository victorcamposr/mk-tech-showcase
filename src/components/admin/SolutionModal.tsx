
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
import { Lightbulb, Plus, Save, Eye, Trash2 } from 'lucide-react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface SolutionData {
  key: string;
  title: string;
  description: string;
  features: string;
  benefits: string;
  industries: string;
  icon_name: string;
  card_image_url: string;
  hero_image_url: string;
  status: 'active' | 'inactive';
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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SolutionData>({
    defaultValues: {
      key: '',
      title: '',
      description: '',
      features: '',
      benefits: '',
      industries: '',
      icon_name: 'Award',
      card_image_url: '',
      hero_image_url: '',
      status: 'active',
      sort_order: 0,
    },
  });

  const isViewMode = mode === 'view';
  const isCreateMode = mode === 'create';

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
          user_name: 'Admin',
        }]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Reset form when solution changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (solution) {
        form.reset({
          key: solution.key || '',
          title: solution.title || '',
          description: solution.description || '',
          features: solution.features ? solution.features.join('\n') : '',
          benefits: solution.benefits ? solution.benefits.join('\n') : '',
          industries: solution.industries ? solution.industries.join(', ') : '',
          icon_name: solution.icon_name || 'Award',
          card_image_url: solution.card_image_url || '',
          hero_image_url: solution.hero_image_url || '',
          status: solution.status || 'active',
          sort_order: solution.sort_order || 0,
        });
      } else {
        form.reset({
          key: '',
          title: '',
          description: '',
          features: '',
          benefits: '',
          industries: '',
          icon_name: 'Award',
          card_image_url: '',
          hero_image_url: '',
          status: 'active',
          sort_order: 0,
        });
      }
    }
  }, [isOpen, solution, form]);

  const handleDelete = async () => {
    if (!solution) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('solutions')
        .delete()
        .eq('id', solution.id);

      if (error) throw error;

      // Registrar atividade
      await logActivity('delete', solution.title, solution.id);
      
      toast({
        title: "Solução excluída com sucesso!",
        description: `"${solution.title}" foi removida.`,
      });

      onSuccess();
      onClose();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Error deleting solution:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir solução",
        description: error.message || "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: SolutionData) => {
    if (isViewMode) return;
    
    setLoading(true);
    
    try {
      const featuresArray = data.features ? data.features.split('\n').map(f => f.trim()).filter(f => f) : [];
      const benefitsArray = data.benefits ? data.benefits.split('\n').map(b => b.trim()).filter(b => b) : [];
      const industriesArray = data.industries ? data.industries.split(',').map(i => i.trim()).filter(i => i) : [];

      const solutionData = {
        key: data.key,
        title: data.title,
        description: data.description,
        features: featuresArray,
        benefits: benefitsArray,
        industries: industriesArray,
        icon_name: data.icon_name,
        card_image_url: data.card_image_url || null,
        hero_image_url: data.hero_image_url || null,
        status: data.status,
        sort_order: data.sort_order,
      };

      if (mode === 'create') {
        const { data: result, error } = await supabase
          .from('solutions')
          .insert([solutionData])
          .select()
          .single();

        if (error) throw error;

        // Registrar atividade
        await logActivity('create', data.title, result.id);
        
        toast({
          title: "Solução criada com sucesso!",
          description: `"${data.title}" foi adicionada.`,
        });
      } else {
        const { error } = await supabase
          .from('solutions')
          .update(solutionData)
          .eq('id', solution.id);

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
    } catch (error: any) {
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

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Nova Solução';
      case 'edit': return 'Editar Solução';
      case 'view': return 'Visualizar Solução';
      default: return 'Solução';
    }
  };

  const getModalIcon = () => {
    switch (mode) {
      case 'view': return <Eye className="w-5 h-5 text-brand-gold" />;
      default: return <Lightbulb className="w-5 h-5 text-brand-gold" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getModalIcon()}
              {getModalTitle()}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="key"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chave (URL)</FormLabel>
                      <FormControl>
                        <Input placeholder="sistema-pdv" {...field} disabled={isViewMode} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Nome da solução" {...field} disabled={isViewMode} />
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
                        placeholder="Descrição detalhada da solução..."
                        rows={3}
                        {...field} 
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Recursos (um por linha)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Controle de estoque&#10;Emissão de notas fiscais&#10;Relatórios detalhados"
                          rows={6}
                          {...field} 
                          disabled={isViewMode}
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
                          placeholder="Reduz tempo de atendimento&#10;Melhora organização&#10;Aumenta vendas"
                          rows={6}
                          {...field} 
                          disabled={isViewMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="industries"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Setores (separados por vírgula)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Varejo, Supermercados, Farmácias"
                        {...field} 
                        disabled={isViewMode}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="card_image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem do Card (URL)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://exemplo.com/card.jpg"
                          {...field} 
                          disabled={isViewMode}
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
                          placeholder="https://exemplo.com/hero.jpg"
                          {...field} 
                          disabled={isViewMode}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="icon_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isViewMode}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o ícone" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Award">Award</SelectItem>
                          <SelectItem value="ShoppingCart">Shopping Cart</SelectItem>
                          <SelectItem value="Lightbulb">Lightbulb</SelectItem>
                          <SelectItem value="BarChart">Bar Chart</SelectItem>
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
                      <Select onValueChange={field.onChange} value={field.value} disabled={isViewMode}>
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
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          disabled={isViewMode}
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
                  {isViewMode ? 'Fechar' : 'Cancelar'}
                </Button>
                {!isViewMode && (
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
                )}
                {mode === 'edit' && solution && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                    disabled={loading}
                    className="flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Excluir Solução"
        description={`Tem certeza que deseja excluir a solução "${solution?.title}"? Esta ação não pode ser desfeita.`}
        loading={loading}
      />
    </>
  );
};

export default SolutionModal;
