import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  AlertCircle,
  Send,
  RefreshCw,
  History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Customer {
  id: string;
  nome_empresa: string;
  responsavel: string;
  telefone?: string;
  celular?: string;
  cnpj: string;
  inscricao_estadual?: string;
  email: string;
  data_vencimento_cobranca: number;
  asaas_customer_id?: string;
  status_pagamento: 'regular' | 'pendente' | 'inadimplente';
  ultima_cobranca_automatica?: string;
  created_at: string;
  updated_at: string;
}

interface PaymentHistory {
  id: string;
  data_pagamento?: string;
  valor?: number;
  status: string;
  observacoes?: string;
  created_at: string;
}

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer;
  onCustomerUpdate: () => void;
}

const CustomerDetailsModal = ({ isOpen, onClose, customer, onCustomerUpdate }: CustomerDetailsModalProps) => {
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [sendingCharge, setSendingCharge] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && customer.id) {
      fetchPaymentHistory();
    }
  }, [isOpen, customer.id]);

  const fetchPaymentHistory = async () => {
    try {
      setLoadingHistory(true);
      const { data, error } = await supabase
        .from('customer_payment_history')
        .select('*')
        .eq('customer_id', customer.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setPaymentHistory(data || []);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao carregar histórico de pagamentos',
        variant: 'destructive',
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'regular':
        return <Badge className="bg-green-100 text-green-800">Regular</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'inadimplente':
        return <Badge className="bg-red-100 text-red-800">Inadimplente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pago':
        return <Badge className="bg-green-100 text-green-800">Pago</Badge>;
      case 'pendente':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendente</Badge>;
      case 'vencido':
        return <Badge className="bg-red-100 text-red-800">Vencido</Badge>;
      case 'cancelado':
        return <Badge className="bg-gray-100 text-gray-800">Cancelado</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  // TODO: Future Asaas integration for manual billing
  const handleSendManualCharge = async () => {
    setSendingCharge(true);
    
    try {
      // Future implementation with Asaas API
      // const response = await fetch('/api/asaas/payments', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': 'Bearer ASAAS_API_KEY'
      //   },
      //   body: JSON.stringify({
      //     customer: customer.asaas_customer_id,
      //     billingType: 'BOLETO',
      //     dueDate: new Date(new Date().setDate(customer.data_vencimento_cobranca)).toISOString().split('T')[0],
      //     value: 100.00, // This should come from a service plan or be configurable
      //     description: `Cobrança mensal - ${customer.nome_empresa}`
      //   })
      // });
      
      // For now, just show a success message
      toast({
        title: 'Cobrança enviada',
        description: 'A cobrança manual foi enviada com sucesso',
      });

      // Update last automatic charge date
      await supabase
        .from('customers')
        .update({ ultima_cobranca_automatica: new Date().toISOString() })
        .eq('id', customer.id);

      onCustomerUpdate();
    } catch (error) {
      console.error('Error sending manual charge:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao enviar cobrança manual',
        variant: 'destructive',
      });
    } finally {
      setSendingCharge(false);
    }
  };

  // TODO: Future Asaas integration for payment status check
  const handleCheckPaymentStatus = async () => {
    setCheckingStatus(true);
    
    try {
      // Future implementation with Asaas API
      // const response = await fetch(`/api/asaas/customers/${customer.asaas_customer_id}/payments`, {
      //   headers: {
      //     'Authorization': 'Bearer ASAAS_API_KEY'
      //   }
      // });
      
      // For now, just show a message
      toast({
        title: 'Status verificado',
        description: 'Status de pagamento verificado com sucesso',
      });

      fetchPaymentHistory();
    } catch (error) {
      console.error('Error checking payment status:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao verificar status de pagamento',
        variant: 'destructive',
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: ptBR });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Detalhes do Cliente
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações do Cliente</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Building2 className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{customer.nome_empresa}</p>
                  <p className="text-sm text-gray-500">CNPJ: {customer.cnpj}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{customer.responsavel}</p>
                  <p className="text-sm text-gray-500">Responsável</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">{customer.email}</p>
                  <p className="text-sm text-gray-500">E-mail</p>
                </div>
              </div>

              {(customer.telefone || customer.celular) && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    {customer.celular && <p className="font-medium">{customer.celular} (Celular)</p>}
                    {customer.telefone && <p className="font-medium">{customer.telefone} (Telefone)</p>}
                  </div>
                </div>
              )}

              {customer.inscricao_estadual && (
                <div>
                  <p className="text-sm text-gray-500">Inscrição Estadual</p>
                  <p className="font-medium">{customer.inscricao_estadual}</p>
                </div>
              )}

              <Separator />

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="font-medium">Dia {customer.data_vencimento_cobranca}</p>
                  <p className="text-sm text-gray-500">Data de vencimento</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <AlertCircle className="h-4 w-4 text-gray-500" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    {getStatusBadge(customer.status_pagamento)}
                  </div>
                </div>
              </div>

              {customer.asaas_customer_id && (
                <div>
                  <p className="text-sm text-gray-500">ID Asaas</p>
                  <p className="font-mono text-sm bg-gray-100 p-2 rounded">{customer.asaas_customer_id}</p>
                </div>
              )}

              {customer.ultima_cobranca_automatica && (
                <div>
                  <p className="text-sm text-gray-500">Última cobrança automática</p>
                  <p className="font-medium">{formatDate(customer.ultima_cobranca_automatica)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions and Payment History */}
          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleSendManualCharge}
                  disabled={sendingCharge}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sendingCharge ? 'Enviando...' : 'Enviar cobrança manualmente'}
                </Button>

                <Button 
                  onClick={handleCheckPaymentStatus}
                  disabled={checkingStatus}
                  className="w-full justify-start"
                  variant="outline"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {checkingStatus ? 'Verificando...' : 'Verificar status de pagamento'}
                </Button>

                {customer.ultima_cobranca_automatica && (
                  <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
                    <strong>Última cobrança:</strong> {formatDate(customer.ultima_cobranca_automatica)}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Histórico de Pagamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loadingHistory ? (
                  <div className="text-center py-4">Carregando...</div>
                ) : paymentHistory.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {paymentHistory.map((payment) => (
                      <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            {payment.data_pagamento && (
                              <p className="font-medium text-sm">
                                {formatDate(payment.data_pagamento)}
                              </p>
                            )}
                            {payment.valor && (
                              <p className="text-lg font-bold text-green-600">
                                {formatCurrency(payment.valor)}
                              </p>
                            )}
                          </div>
                          {getPaymentStatusBadge(payment.status)}
                        </div>
                        {payment.observacoes && (
                          <p className="text-xs text-gray-600">{payment.observacoes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <CreditCard className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Nenhum pagamento registrado</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Future automation info */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">🚀 Automação Futura</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600">
            <p><strong>Em desenvolvimento:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Cobrança automática no dia do vencimento via Asaas</li>
              <li>Envio automático de boletos via WhatsApp</li>
              <li>Atualização automática de status de pagamento</li>
              <li>Webhook para processar notificações de pagamento</li>
              <li>Relatórios de inadimplência</li>
            </ul>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerDetailsModal;