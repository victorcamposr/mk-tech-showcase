
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmDialog from "@/components/admin/DeleteConfirmDialog";
import { Trash2, Eye, Search, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { logAdminActivity } from "@/utils/adminActivity";

interface FiscalData {
  id: string;
  razao_social: string;
  nome_fantasia: string | null;
  endereco_cidade: string;
  endereco_estado: string;
  email_empresarial: string;
  email_contador: string | null;
  contador_nome: string | null;
  contador_crc: string | null;
  contador_telefone: string | null;
  created_at: string;
}

const AdminFiscalData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewData, setViewData] = useState<FiscalData | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: fiscalData, isLoading } = useQuery({
    queryKey: ["fiscal-data"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("fiscal_data")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as FiscalData[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("fiscal_data")
        .delete()
        .eq("id", id);
      
      if (error) throw error;
    },
    onSuccess: async (_, deletedId) => {
      const deletedItem = fiscalData?.find(item => item.id === deletedId);
      if (deletedItem) {
        await logAdminActivity("delete", "dados fiscais", deletedItem.razao_social);
      }
      
      queryClient.invalidateQueries({ queryKey: ["fiscal-data"] });
      toast({
        title: "Sucesso",
        description: "Dados fiscais excluídos com sucesso!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro",
        description: error.message || "Erro ao excluir dados fiscais.",
        variant: "destructive",
      });
    },
  });

  const filteredData = fiscalData?.filter((item) =>
    item.razao_social.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.endereco_cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.email_empresarial.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cadastros Fiscais</h1>
            <p className="text-gray-600 mt-2">
              Gerencie os dados fiscais cadastrados no sistema
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Dados Fiscais Cadastrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por razão social, cidade ou e-mail..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Carregando dados fiscais...</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Razão Social</TableHead>
                      <TableHead>Cidade/Estado</TableHead>
                      <TableHead>E-mail de Contato</TableHead>
                      <TableHead>Contador</TableHead>
                      <TableHead>Data de Cadastro</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                          Nenhum dado fiscal encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            <div>
                              <div className="font-semibold">{item.razao_social}</div>
                              {item.nome_fantasia && (
                                <div className="text-sm text-gray-500">{item.nome_fantasia}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{item.endereco_cidade}</div>
                            <div className="text-sm text-gray-500">{item.endereco_estado}</div>
                          </TableCell>
                          <TableCell>{item.email_empresarial}</TableCell>
                          <TableCell>
                            {item.contador_nome ? (
                              <div>
                                <div className="font-medium">{item.contador_nome}</div>
                                {item.contador_crc && (
                                  <div className="text-sm text-gray-500">CRC: {item.contador_crc}</div>
                                )}
                              </div>
                            ) : (
                              <span className="text-gray-400">Não informado</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {new Date(item.created_at).toLocaleDateString("pt-BR")}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setViewData(item)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setDeleteId(item.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Visualização de Dados */}
        <Dialog open={!!viewData} onOpenChange={() => setViewData(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Detalhes dos Dados Fiscais</DialogTitle>
            </DialogHeader>
            {viewData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-gray-900">Razão Social</Label>
                    <p className="text-gray-700">{viewData.razao_social}</p>
                  </div>
                  {viewData.nome_fantasia && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900">Nome Fantasia</Label>
                      <p className="text-gray-700">{viewData.nome_fantasia}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900">E-mail Empresarial</Label>
                    <p className="text-gray-700">{viewData.email_empresarial}</p>
                  </div>
                  {viewData.email_contador && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900">E-mail do Contador</Label>
                      <p className="text-gray-700">{viewData.email_contador}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900">Cidade</Label>
                    <p className="text-gray-700">{viewData.endereco_cidade}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-900">Estado</Label>
                    <p className="text-gray-700">{viewData.endereco_estado}</p>
                  </div>
                  {viewData.contador_nome && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900">Nome do Contador</Label>
                      <p className="text-gray-700">{viewData.contador_nome}</p>
                    </div>
                  )}
                  {viewData.contador_crc && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900">CRC</Label>
                      <p className="text-gray-700">{viewData.contador_crc}</p>
                    </div>
                  )}
                  {viewData.contador_telefone && (
                    <div>
                      <Label className="text-sm font-semibold text-gray-900">Telefone do Contador</Label>
                      <p className="text-gray-700">{viewData.contador_telefone}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-sm font-semibold text-gray-900">Data de Cadastro</Label>
                    <p className="text-gray-700">
                      {new Date(viewData.created_at).toLocaleString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirmação de Exclusão */}
        <DeleteConfirmDialog
          isOpen={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={() => {
            if (deleteId) {
              deleteMutation.mutate(deleteId);
              setDeleteId(null);
            }
          }}
          title="Excluir Dados Fiscais"
          description="Tem certeza que deseja excluir estes dados fiscais? Esta ação não pode ser desfeita."
        />
      </div>
    </AdminLayout>
  );
};

export default AdminFiscalData;
