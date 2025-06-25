
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { User, Plus, Save } from 'lucide-react';

interface UserData {
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any;
  mode: 'create' | 'edit';
}

const UserModal = ({ isOpen, onClose, onSuccess, user, mode }: UserModalProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<UserData>({
    defaultValues: {
      name: '',
      email: '',
      role: 'admin',
    },
  });

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (isOpen && user) {
      console.log('Setting form values for user:', user);
      form.reset({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'admin',
      });
    } else if (isOpen && !user) {
      form.reset({
        name: '',
        email: '',
        role: 'admin',
      });
    }
  }, [isOpen, user, form]);

  const onSubmit = async (data: UserData) => {
    setLoading(true);
    console.log('Submitting user data:', data);
    
    try {
      if (mode === 'create') {
        const { data: result, error } = await supabase
          .from('admin_profiles')
          .insert([{
            name: data.name,
            email: data.email,
            role: data.role,
            user_id: crypto.randomUUID(), // Temporário - em produção seria do auth
            is_active: true,
          }]);

        console.log('Insert result:', result, 'Error:', error);
        if (error) throw error;
        
        toast({
          title: "Usuário criado com sucesso!",
          description: "O novo administrador foi adicionado ao sistema.",
        });
      } else {
        const { data: result, error } = await supabase
          .from('admin_profiles')
          .update({
            name: data.name,
            email: data.email,
            role: data.role,
          })
          .eq('id', user.id);

        console.log('Update result:', result, 'Error:', error);
        if (error) throw error;
        
        toast({
          title: "Usuário atualizado com sucesso!",
          description: "As informações foram salvas.",
        });
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving user:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar usuário",
        description: error.message || "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-brand-gold" />
            {mode === 'create' ? 'Novo Administrador' : 'Editar Administrador'}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Digite o nome completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="admin@exemplo.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nível de Acesso</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o nível" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="super_admin">Super Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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

export default UserModal;
