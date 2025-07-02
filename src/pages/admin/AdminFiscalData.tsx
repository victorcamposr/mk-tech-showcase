import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Eye, FileText, Download, Receipt, Building2, MapPin, User, Mail, Phone, Link as LinkIcon, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import AdminLayout from '@/components/admin/AdminLayout';
import { logAdminActivity } from '@/utils/adminActivity';

interface FiscalData {
  id: string;
  razao_social: string;
  nome_fantasia?: string;
  endereco_rua: string;
  endereco_numero: string;
  endereco_complemento?: string;
  endereco_cidade: string;
  endereco_estado: string;
  email_empresarial: string;
  contador_nome?: string;
  contador_crc?: string;
  contador_telefone?: string;
  email_contador?: string;
  serie?: string;
  ultimo_cupom_emitido?: string;
  ultima_nfe?: string;
  senha_certificado?: string;
  arquivo_token_url?: string;
  certificado_digital_url?: string;
  created_at: string;
  updated_at: string;
}

const AdminFiscalData = () => {
  const [fiscalData, setFiscalData] = useState<FiscalData[]>([]);
  const [filteredData, setFilteredData] = useState<FiscalData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedData, setSelectedData] = useState<FiscalData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { toast } = useToast();

  useEffect(() => {
    fetchFiscalData();
  }, []);

  useEffect(() => {
    filterData();
  }, [fiscalData, searchTerm]);

  const fetchFiscalData = async () => {
    try {
      const { data, error } = await supabase
        .from('fiscal_data')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setFiscalData(data || []);
    } catch (error) {
      console.error('Error fetching fiscal data:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Ocorreu um erro ao carregar os dados fiscais.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterData = () => {
    let filtered = [...fiscalData];

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(data => 
        data.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.nome_fantasia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.email_empresarial.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.endereco_cidade.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredData(filtered);
    setCurrentPage(1); // Reset para primeira página ao filtrar
  };

  const handleDelete = async (id: string, razaoSocial: string) => {
    try {
      const { error } = await supabase
        .from('fiscal_data')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      await logAdminActivity('delete', 'dados fiscais', razaoSocial);

      toast({
        title: 'Cadastro excluído',
        description: 'O cadastro fiscal foi excluído com sucesso.',
      });

      fetchFiscalData();
    } catch (error) {
      console.error('Error deleting fiscal data:', error);
      toast({
        title: 'Erro ao excluir',
        description: 'Ocorreu um erro ao excluir o cadastro.',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Paginação
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


  const ViewDialog = ({ data }: { data: FiscalData }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-brand-gold" />
            Detalhes do Cadastro Fiscal
          </DialogTitle>
          <DialogDescription>
            Cadastrado em {formatDate(data.created_at)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Dados da Empresa */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-gold" />
              <h3 className="text-lg font-semibold">Dados da Empresa</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm font-medium text-gray-600">Razão Social</p>
                <p className="text-sm">{data.razao_social}</p>
              </div>
              {data.nome_fantasia && (
                <div>
                  <p className="text-sm font-medium text-gray-600">Nome Fantasia</p>
                  <p className="text-sm">{data.nome_fantasia}</p>
                </div>
              )}
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-brand-gold" />
              <h3 className="text-lg font-semibold">Endereço</h3>
            </div>
            <div className="pl-7">
              <p className="text-sm">
                {data.endereco_rua}, {data.endereco_numero}
                {data.endereco_complemento && `, ${data.endereco_complemento}`}
              </p>
              <p className="text-sm">{data.endereco_cidade} - {data.endereco_estado}</p>
            </div>
          </div>

          {/* E-mails */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-brand-gold" />
              <h3 className="text-lg font-semibold">E-mails</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm font-medium text-gray-600">E-mail Empresarial</p>
                <p className="text-sm">{data.email_empresarial}</p>
              </div>
              {data.email_contador && (
                <div>
                  <p className="text-sm font-medium text-gray-600">E-mail do Contador</p>
                  <p className="text-sm">{data.email_contador}</p>
                </div>
              )}
            </div>
          </div>

          {/* Dados do Contador */}
          {(data.contador_nome || data.contador_crc || data.contador_telefone) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-brand-gold" />
                <h3 className="text-lg font-semibold">Dados do Contador</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                {data.contador_nome && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nome</p>
                    <p className="text-sm">{data.contador_nome}</p>
                  </div>
                )}
                {data.contador_crc && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">CRC</p>
                    <p className="text-sm">{data.contador_crc}</p>
                  </div>
                )}
                {data.contador_telefone && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Telefone</p>
                    <p className="text-sm">{data.contador_telefone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Dados Fiscais */}
          {(data.serie || data.ultimo_cupom_emitido || data.ultima_nfe) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-brand-gold" />
                <h3 className="text-lg font-semibold">Dados Fiscais</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-7">
                {data.serie && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Série</p>
                    <p className="text-sm">{data.serie}</p>
                  </div>
                )}
                {data.ultimo_cupom_emitido && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Último Cupom</p>
                    <p className="text-sm">{data.ultimo_cupom_emitido}</p>
                  </div>
                )}
                {data.ultima_nfe && (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Última NFe</p>
                    <p className="text-sm">{data.ultima_nfe}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Arquivos */}
          {(data.arquivo_token_url || data.certificado_digital_url) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-brand-gold" />
                <h3 className="text-lg font-semibold">Arquivos</h3>
              </div>
              <div className="space-y-2 pl-7">
                {data.arquivo_token_url && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <a href={data.arquivo_token_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Arquivo Token
                      </a>
                    </Button>
                  </div>
                )}
                {data.certificado_digital_url && (
                  <div>
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <a href={data.certificado_digital_url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificado Digital
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-lg">
              <Receipt className="h-6 w-6 text-brand-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-brand-black">Cadastros Fiscais</h1>
              <p className="text-gray-600">Gerencie os cadastros fiscais recebidos</p>
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Busca */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por razão social, nome fantasia, email ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Botão de limpar filtros */}
              <Button 
                variant="outline" 
                onClick={() => setSearchTerm('')}
              >
                Limpar Busca
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lista de Cadastros</CardTitle>
            <CardDescription>
              {filteredData.length} cadastro{filteredData.length !== 1 ? 's' : ''} encontrado{filteredData.length !== 1 ? 's' : ''} 
              {searchTerm ? ` (de ${fiscalData.length} total)` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Carregando cadastros...</div>
              </div>
            ) : currentData.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">
                  {filteredData.length === 0 && fiscalData.length > 0 
                    ? 'Nenhum cadastro encontrado com os filtros aplicados' 
                    : 'Nenhum cadastro fiscal encontrado'
                  }
                </div>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Razão Social</TableHead>
                        <TableHead>Cidade/Estado</TableHead>
                        <TableHead>E-mail de Contato</TableHead>
                        <TableHead>Data do Cadastro</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentData.map((data) => (
                        <TableRow key={data.id}>
                          <TableCell className="font-medium">
                            <div>
                              <p className="font-semibold">{data.razao_social}</p>
                              {data.nome_fantasia && (
                                <p className="text-sm text-gray-500">{data.nome_fantasia}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {data.endereco_cidade} - {data.endereco_estado}
                          </TableCell>
                          <TableCell>{data.email_empresarial}</TableCell>
                          <TableCell>{formatDate(data.created_at)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <ViewDialog data={data} />
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Tem certeza que deseja excluir o cadastro fiscal de "{data.razao_social}"? 
                                      Esta ação não pode ser desfeita.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(data.id, data.razao_social)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Excluir
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Paginação */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Mostrando {startIndex + 1} a {Math.min(endIndex, filteredData.length)} de {filteredData.length} registros
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Anterior
                      </Button>
                      <span className="text-sm text-gray-600">
                        Página {currentPage} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        Próxima
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminFiscalData;