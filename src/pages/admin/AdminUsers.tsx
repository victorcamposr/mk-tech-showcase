
import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserModal from '@/components/admin/UserModal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Users, 
  Plus, 
  Search, 
  Edit,
  Shield,
  Calendar,
  Mail,
  CheckCircle,
  XCircle,
  UserCheck
} from 'lucide-react';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const AdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar usuários",
        description: "Não foi possível carregar a lista de administradores.",
      });
    } finally {
      setLoading(false);
    }
  };

  const logActivity = async (actionType: string, entityTitle: string, entityId: string) => {
    try {
      // Get current user profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('admin_profiles')
        .select('name')
        .eq('user_id', user.id)
        .single();

      if (profile) {
        await supabase
          .from('admin_activities')
          .insert({
            action_type: actionType,
            entity_type: 'admin_profiles',
            entity_title: entityTitle,
            entity_id: entityId,
            user_name: profile.name
          });
      }
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const toggleUserStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const user = users.find(u => u.id === userId);
      if (!user) return;

      const { error } = await supabase
        .from('admin_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', userId);

      if (error) throw error;

      // Log activity
      const actionText = !currentStatus ? 'ativou' : 'desativou';
      await logActivity('update', `${actionText} o usuário ${user.name}`, userId);

      await fetchUsers();
      toast({
        title: "Status atualizado",
        description: `Usuário ${!currentStatus ? 'ativado' : 'desativado'} com sucesso.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar status",
        description: "Não foi possível atualizar o status do usuário.",
      });
    }
  };

  const handleNewUser = () => {
    setSelectedUser(null);
    setModalMode('create');
    setModalOpen(true);
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setModalMode('edit');
    setModalOpen(true);
  };

  const handleModalSuccess = async (userData?: any, isNew?: boolean) => {
    if (userData && userData.name) {
      const actionType = isNew ? 'create' : 'update';
      const actionText = isNew ? 'criou' : 'atualizou';
      await logActivity(actionType, `${actionText} o usuário ${userData.name}`, userData.id || 'new');
    }
    await fetchUsers();
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = users.filter(user => user.is_active).length;
  const inactiveCount = users.filter(user => !user.is_active).length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Administrador';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando usuários...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Users className="w-8 h-8 text-brand-gold" />
              Gerenciar Usuários
            </h1>
            <p className="text-gray-600 mt-2">
              Administre os usuários do sistema administrativo
            </p>
          </div>
          <Button 
            onClick={handleNewUser}
            className="bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Buscar usuários..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white border-gray-300 focus:border-brand-gold focus:ring-brand-gold"
              />
            </div>
          </div>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                <div className="text-sm text-gray-600">Ativos</div>
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{inactiveCount}</div>
                <div className="text-sm text-gray-600">Inativos</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-brand-gold" />
              Administradores do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'Nenhum usuário encontrado' : 'Nenhum usuário cadastrado'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? 'Tente usar outros termos de busca.' 
                    : 'Adicione o primeiro administrador ao sistema.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border-l-4 border-brand-gold"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full shadow-sm">
                          {user.is_active ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{user.email}</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={user.is_active ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-brand-gold" />
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.created_at)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleEditUser(user)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={user.is_active ? 'destructive' : 'default'}
                          onClick={() => toggleUserStatus(user.id, user.is_active)}
                          className="shadow-md hover:shadow-lg transition-all duration-200"
                        >
                          {user.is_active ? 'Desativar' : 'Ativar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Modal */}
        <UserModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={handleModalSuccess}
          user={selectedUser}
          mode={modalMode}
        />
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
