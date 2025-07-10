import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { logAdminActivity } from '@/utils/adminActivity';

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

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSave: () => void;
}

const CustomerModal = ({ isOpen, onClose, customer, onSave }: CustomerModalProps) => {
  const [formData, setFormData] = useState({
    nome_empresa: '',
    responsavel: '',
    telefone: '',
    celular: '',
    cnpj: '',
    inscricao_estadual: '',
    email: '',
    data_vencimento_cobranca: 1,
    status_pagamento: 'regular' as 'regular' | 'pendente' | 'inadimplente'
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (customer) {
      setFormData({
        nome_empresa: customer.nome_empresa,
        responsavel: customer.responsavel,
        telefone: customer.telefone || '',
        celular: customer.celular || '',
        cnpj: customer.cnpj,
        inscricao_estadual: customer.inscricao_estadual || '',
        email: customer.email,
        data_vencimento_cobranca: customer.data_vencimento_cobranca,
        status_pagamento: customer.status_pagamento
      });
    } else {
      setFormData({
        nome_empresa: '',
        responsavel: '',
        telefone: '',
        celular: '',
        cnpj: '',
        inscricao_estadual: '',
        email: '',
        data_vencimento_cobranca: 1,
        status_pagamento: 'regular'
      });
    }
  }, [customer]);

  const formatCNPJ = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara do CNPJ
    if (numbers.length <= 14) {
      return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    return numbers.slice(0, 14).replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (field === 'cnpj') {
      setFormData(prev => ({ ...prev, [field]: formatCNPJ(value as string) }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    if (!formData.nome_empresa.trim()) {
      toast({
        title: 'Erro',
        description: 'Nome da empresa é obrigatório',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.responsavel.trim()) {
      toast({
        title: 'Erro',
        description: 'Responsável é obrigatório',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.cnpj.trim()) {
      toast({
        title: 'Erro',
        description: 'CNPJ é obrigatório',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.email.trim()) {
      toast({
        title: 'Erro',
        description: 'E-mail é obrigatório',
        variant: 'destructive',
      });
      return false;
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: 'Erro',
        description: 'E-mail inválido',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  // TODO: Future Asaas integration
  const createAsaasCustomer = async (customerData: any) => {
    // This function will be implemented when Asaas integration is ready
    // const asaasResponse = await fetch('/api/asaas/customers', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ASAAS_API_KEY'
    //   },
    //   body: JSON.stringify({
    //     name: customerData.nome_empresa,
    //     cpfCnpj: customerData.cnpj.replace(/\D/g, ''), // Remove formatting
    //     mobilePhone: customerData.celular
    //   })
    // });
    // 
    // if (asaasResponse.ok) {
    //   const asaasCustomer = await asaasResponse.json();
    //   return asaasCustomer.id; // Returns customer ID like 'cus_000005219613'
    // }
    
    return null; // For now, return null until integration is ready
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // TODO: Future Asaas integration
      let asaasCustomerId = null;
      // asaasCustomerId = await createAsaasCustomer(formData);

      const customerData = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ''), // Store without formatting
        asaas_customer_id: asaasCustomerId
      };

      let result;
      if (customer) {
        // Update existing customer
        result = await supabase
          .from('customers')
          .update(customerData)
          .eq('id', customer.id);
      } else {
        // Create new customer
        result = await supabase
          .from('customers')
          .insert([customerData]);
      }

      if (result.error) throw result.error;

      // Log admin activity
      await logAdminActivity(
        customer ? 'update' : 'create',
        'customers',
        customer?.id || '',
        formData.nome_empresa
      );

      toast({
        title: 'Sucesso',
        description: customer ? 'Cliente atualizado com sucesso' : 'Cliente cadastrado com sucesso',
      });

      onSave();
    } catch (error) {
      console.error('Error saving customer:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar cliente',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate day options for payment due date
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {customer ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="nome_empresa">Nome da Empresa *</Label>
            <Input
              id="nome_empresa"
              value={formData.nome_empresa}
              onChange={(e) => handleInputChange('nome_empresa', e.target.value)}
              placeholder="Digite o nome da empresa"
            />
          </div>

          <div>
            <Label htmlFor="responsavel">Responsável *</Label>
            <Input
              id="responsavel"
              value={formData.responsavel}
              onChange={(e) => handleInputChange('responsavel', e.target.value)}
              placeholder="Digite o nome do responsável"
            />
          </div>

          <div>
            <Label htmlFor="cnpj">CNPJ *</Label>
            <Input
              id="cnpj"
              value={formData.cnpj}
              onChange={(e) => handleInputChange('cnpj', e.target.value)}
              placeholder="00.000.000/0000-00"
              maxLength={18}
            />
          </div>

          <div>
            <Label htmlFor="inscricao_estadual">Inscrição Estadual</Label>
            <Input
              id="inscricao_estadual"
              value={formData.inscricao_estadual}
              onChange={(e) => handleInputChange('inscricao_estadual', e.target.value)}
              placeholder="Digite a inscrição estadual"
            />
          </div>

          <div>
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="Digite o e-mail"
            />
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              placeholder="(00) 0000-0000"
            />
          </div>

          <div>
            <Label htmlFor="celular">Celular</Label>
            <Input
              id="celular"
              value={formData.celular}
              onChange={(e) => handleInputChange('celular', e.target.value)}
              placeholder="(00) 00000-0000"
            />
          </div>

          <div>
            <Label htmlFor="data_vencimento_cobranca">Dia do Vencimento *</Label>
            <Select 
              value={formData.data_vencimento_cobranca.toString()} 
              onValueChange={(value) => handleInputChange('data_vencimento_cobranca', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {dayOptions.map((day) => (
                  <SelectItem key={day} value={day.toString()}>
                    Dia {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="status_pagamento">Status do Pagamento</Label>
            <Select 
              value={formData.status_pagamento} 
              onValueChange={(value) => handleInputChange('status_pagamento', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="inadimplente">Inadimplente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : (customer ? 'Atualizar' : 'Cadastrar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal;