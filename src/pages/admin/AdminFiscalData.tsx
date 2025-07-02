
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Search, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { logAdminActivity } from '@/utils/adminActivity';

interface FiscalDataRecord {
  id: string;
  razao_social: string;
  nome_fantasia: string | null;
  email_empresarial: string;
  endereco_cidade: string;
  endereco_estado: string;
  created_at: string;
}

const AdminFiscalData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fiscalData, setFiscalData] = useState<FiscalDataRecord[]>([]);
  const [filteredData, setFilteredData] = useState<FiscalDataRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchFiscalData();
  }, []);

  useEffect(() => {
    filterData();
  }, [fiscalData, searchTerm]);

  const fetchFiscalData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fiscal_data')
        .select(`
          id,
          razao_social,
          nome_fantasia,
          email_empresarial,
          endereco_cidade,
          endereco_estado,
          created_at
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setFiscalData(data || []);
    } catch (error: any) {
      console.error('Error fetching fiscal data:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar os dados fiscais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterData = () => {
    if (!searchTerm) {
      setFilteredData(fiscalData);
      return;
    }

    const filtered = fiscalData.filter(item =>
      item.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email_empresarial.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.endereco_cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.endereco_estado.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const handleDelete = async (id: string) => {
    try {
      const itemToDelete = fiscalData.find(item => item.id === id);
      if (!itemToDelete) return;

      const { error } = await supabase
        .from('fiscal_data')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Log da atividade
      await logAdminActivity('delete', 'fiscal_data', itemToDelete.razao_social);

      setFiscalData(fiscalData.filter(item => item.id !== id));
      toast({
        title: "Sucesso",
        description: "Dados fiscais excluídos com sucesso!",
      });
    } catch (error: any) {
      console.error('Error deleting fiscal data:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir os dados fiscais.",
        variant: "destructive",
      });
    }
    setDeleteId(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando dados fiscais...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-brand-gold" />
              Cadastros Fiscais
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os dados fiscais cadastrados
            </p>
          </div>
          <Button
            onClick={() => navigate('/cadastro-fiscal')}
            className="bg-brand-gold hover:bg-brand-gold/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Cadastro
          </Button>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>Dados Fiscais Cadastrados</CardTitle>
                <CardDescription>
                  Total de {filteredData.length} registro(s)
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por razão social, cidade..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-72"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredData.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum resultado encontrado' : 'Nenhum dado fiscal cadastrado'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Razão Social</TableHead>
                      <TableHead>Nome Fantasia</TableHead>
                      <TableHead>Cidade/Estado</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Data Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.razao_social}
                        </TableCell>
                        <TableCell>
                          {item.nome_fantasia || '-'}
                        </TableCell>
                        <TableCell>
                          {item.endereco_cidade}/{item.endereco_estado}
                        </TableCell>
                        <TableCell>
                          {item.email_empresarial}
                        </TableCell>
                        <TableCell>
                          {formatDate(item.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/fiscal-data/${item.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigate(`/admin/fiscal-data/${item.id}/edit`)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteId(item.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <DeleteConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={() => deleteId && handleDelete(deleteId)}
          title="Excluir Dados Fiscais"
          description="Tem certeza que deseja excluir estes dados fiscais? Esta ação não pode ser desfeita."
        />
      </div>
    </AdminLayout>
  );
};

export default AdminFiscalData;
