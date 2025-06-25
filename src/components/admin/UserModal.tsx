
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
import { User, Plus, Save, Eye, EyeOff, Trash2 } from 'lucide-react';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface UserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  is_active: boolean;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: any;
  mode: 'create' | 'edit' | 'view';
}

const UserModal = ({ isOpen, onClose, onSuccess, user, mode }: UserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<UserData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'admin',
      is_active: true,
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
          entity_type: 'user',
          entity_id: entityId,
          entity_title: entityTitle,
          user_name: 'Admin', // Temporário - em produção seria do perfil do usuário
        }]);
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  // Reset form when user changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (user) {
        console.log('Setting form values for user:', user);
        form.reset({
          name: user.name || '',
          email: user.email || '',
          password: '', // Nunca pré-preencher senha
          role: user.role || 'admin',
          is_active: user.is_active !== undefined ? user.is_active : true,
        });
      } else {
        form.reset({
          name: '',
          email: '',
          password: '',
          role: 'admin',
          is_active: true,
        });
      }
    }
  }, [isOpen, user, form]);

  const handleDelete = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Primeiro, deletar o perfil de admin
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Se houver user_id, tentar deletar o usuário da auth também
      if (user.user_id) {
        const { error: authError } = await supabase.auth.admin.deleteUser(user.user_id);
        if (authError) {
          console.warn('Could not delete auth user:', authError);
          // Não falhar completamente se não conseguir deletar da auth
        }
      }

      // Registrar atividade
      await logActivity('delete', user.name, user.id);
      
      toast({
        title: "Usuário excluído com sucesso!",
        description: `${user.name} foi removido do sistema.`,
      });

      onSuccess();
      onClose();
      setDeleteDialogOpen(false);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir usuário",
        description: error.message || "Tente novamente em alguns instantes.",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserData) => {
    if (isViewMode) return;
    
    setLoading(true);
    console.log('Submitting user data:', { ...data, password: '***' });
    
    try {
      if (mode === 'create') {
        // Primeiro, criar o usuário na auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              name: data.name,
            }
          }
        });

        if (authError) {
          console.error('Auth error:', authError);
          
          // Mostrar mensagens de erro mais específicas
          let errorMessage = "Tente novamente em alguns instantes.";
          if (authError.message.includes('Password')) {
            errorMessage = "A senha deve ter pelo menos 6 caracteres.";
          } else if (authError.message.includes('email')) {
            errorMessage = "Email inválido ou já está em uso.";
          } else if (authError.message.includes('weak')) {
            errorMessage = "Senha muito fraca. Use pelo menos 6 caracteres com letras e números.";
          }
          
          throw new Error(errorMessage);
        }

        if (!authData.user) {
          throw new Error('Falha ao criar usuário');
        }

        console.log('Auth user created:', authData.user.id);

        // Depois, criar o perfil de admin
        const { data: profileData, error: profileError } = await supabase
          .from('admin_profiles')
          .insert([{
            user_id: authData.user.id,
            name: data.name,
            email: data.email,
            role: data.role,
            is_active: data.is_active,
          }])
          .select()
          .single();

        if (profileError) {
          console.error('Profile error:', profileError);
          throw new Error(profileError.message);
        }

        console.log('Profile created:', profileData);
        
        // Registrar atividade
        await logActivity('create', data.name, profileData.id);
        
        toast({
          title: "Usuário criado com sucesso!",
          description: `${data.name} foi adicionado ao sistema.`,
        });
      } else {
        // Atualizar perfil existente
        const { data: result, error } = await supabase
          .from('admin_profiles')
          .update({
            name: data.name,
            email: data.email,
            role: data.role,
            is_active: data.is_active,
          })
          .eq('id', user.id)
          .select()
          .single();

        console.log('Update result:', result, 'Error:', error);
        if (error) throw error;

        // Se uma nova senha foi fornecida, atualizar na auth
        if (data.password && data.password.trim() !== '') {
          const { error: passwordError } = await supabase.auth.admin.updateUserById(
            user.user_id,
            { password: data.password }
          );
          
          if (passwordError) {
            console.error('Password update error:', passwordError);
            // Não falhar completamente se a senha não puder ser atualizada
            toast({
              variant: "destructive",
              title: "Aviso",
              description: "Usuário atualizado, mas não foi possível alterar a senha.",
            });
          }
        }
        
        // Registrar atividade
        await logActivity('update', data.name, user.id);
        
        toast({
          title: "Usuário atualizado com sucesso!",
          description: "As informações foram salvas.",
        });
      }

      onSuccess();
      onClose();
    } catch (error: any) {
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

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Novo Usuário';
      case 'edit': return 'Editar Usuário';
      case 'view': return 'Visualizar Usuário';
      default: return 'Usuário';
    }
  };

  const getModalIcon = () => {
    switch (mode) {
      case 'view': return <Eye className="w-5 h-5 text-brand-gold" />;
      default: return <User className="w-5 h-5 text-brand-gold" />;
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {getModalIcon()}
              {getModalTitle()}
            </DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome completo" {...field} disabled={isViewMode} />
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
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="email@exemplo.com" 
                        type="email" 
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {isCreateMode ? 'Senha' : 'Nova Senha (deixe em branco para manter a atual)'}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          placeholder={isCreateMode ? "Digite uma senha segura" : "Digite a nova senha"}
                          type={showPassword ? "text" : "password"}
                          {...field} 
                          disabled={isViewMode}
                        />
                        {!isViewMode && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                    {isCreateMode && (
                      <p className="text-xs text-gray-500">
                        A senha deve ter pelo menos 6 caracteres
                      </p>
                    )}
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} disabled={isViewMode}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a função" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="is_active"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(value === 'true')} 
                        value={field.value ? 'true' : 'false'} 
                        disabled={isViewMode}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="true">Ativo</SelectItem>
                          <SelectItem value="false">Inativo</SelectItem>
                        </SelectContent>
                      </Select>
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
                {mode === 'edit' && user && (
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
        title="Excluir Usuário"
        description={`Tem certeza que deseja excluir o usuário "${user?.name}"? Esta ação não pode ser desfeita.`}
        loading={loading}
      />
    </>
  );
};

export default UserModal;
