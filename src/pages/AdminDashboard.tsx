
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, Layers, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-brand-black">Dashboard</h1>
          <p className="text-gray-600 mt-2">Bem-vindo ao painel administrativo da MK Tecnologia</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-brand-gold/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Total de Usuários
              </CardTitle>
              <Users className="h-4 w-4 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">1</div>
              <p className="text-xs text-gray-500">Administradores ativos</p>
            </CardContent>
          </Card>

          <Card className="border-brand-gold/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Posts do Blog
              </CardTitle>
              <FileText className="h-4 w-4 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">0</div>
              <p className="text-xs text-gray-500">Posts publicados</p>
            </CardContent>
          </Card>

          <Card className="border-brand-gold/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Soluções
              </CardTitle>
              <Layers className="h-4 w-4 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-brand-black">5</div>
              <p className="text-xs text-gray-500">Soluções ativas</p>
            </CardContent>
          </Card>

          <Card className="border-brand-gold/20 hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Status do Sistema
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-brand-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Online</div>
              <p className="text-xs text-gray-500">Todos os serviços operacionais</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-brand-gold/20">
            <CardHeader>
              <CardTitle className="text-brand-black">Atividades Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-brand-black">Sistema inicializado</p>
                    <p className="text-sm text-gray-500">Painel administrativo configurado</p>
                  </div>
                  <span className="text-xs text-gray-400">Agora</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-brand-gold/20">
            <CardHeader>
              <CardTitle className="text-brand-black">Acesso Rápido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => navigate('/admin/users')}
                  className="p-4 bg-brand-gold/10 hover:bg-brand-gold/20 rounded-lg transition-colors text-left"
                >
                  <Users className="h-6 w-6 text-brand-gold mb-2" />
                  <p className="font-medium text-brand-black">Usuários</p>
                </button>
                <button 
                  onClick={() => navigate('/admin/blog')}
                  className="p-4 bg-brand-gold/10 hover:bg-brand-gold/20 rounded-lg transition-colors text-left"
                >
                  <FileText className="h-6 w-6 text-brand-gold mb-2" />
                  <p className="font-medium text-brand-black">Blog</p>
                </button>
                <button 
                  onClick={() => navigate('/admin/solutions')}
                  className="p-4 bg-brand-gold/10 hover:bg-brand-gold/20 rounded-lg transition-colors text-left"
                >
                  <Layers className="h-6 w-6 text-brand-gold mb-2" />
                  <p className="font-medium text-brand-black">Soluções</p>
                </button>
                <button className="p-4 bg-brand-gold/10 hover:bg-brand-gold/20 rounded-lg transition-colors text-left">
                  <BarChart3 className="h-6 w-6 text-brand-gold mb-2" />
                  <p className="font-medium text-brand-black">Relatórios</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
