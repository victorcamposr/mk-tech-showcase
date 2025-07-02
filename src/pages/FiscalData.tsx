
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ImageUpload } from '@/components/ui/image-upload';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { FileText, ArrowLeft } from 'lucide-react';
import { logAdminActivity } from '@/utils/adminActivity';

const fiscalDataSchema = z.object({
  razao_social: z.string().min(1, 'Razão social é obrigatória'),
  nome_fantasia: z.string().optional(),
  email_empresarial: z.string().email('E-mail inválido'),
  email_contador: z.string().email('E-mail inválido').optional().or(z.literal('')),
  endereco_rua: z.string().min(1, 'Rua é obrigatória'),
  endereco_numero: z.string().min(1, 'Número é obrigatório'),
  endereco_complemento: z.string().optional(),
  endereco_cidade: z.string().min(1, 'Cidade é obrigatória'),
  endereco_estado: z.string().min(2, 'Estado é obrigatório'),
  contador_nome: z.string().optional(),
  contador_crc: z.string().optional(),
  contador_telefone: z.string().optional(),
  serie: z.string().optional(),
  ultimo_cupom_emitido: z.string().optional(),
  ultima_nfe: z.string().optional(),
  senha_certificado: z.string().optional(),
});

type FiscalDataForm = z.infer<typeof fiscalDataSchema>;

const FiscalData = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tokenFileUrl, setTokenFileUrl] = useState('');
  const [certificadoUrl, setCertificadoUrl] = useState('');

  const form = useForm<FiscalDataForm>({
    resolver: zodResolver(fiscalDataSchema),
    defaultValues: {
      razao_social: '',
      nome_fantasia: '',
      email_empresarial: '',
      email_contador: '',
      endereco_rua: '',
      endereco_numero: '',
      endereco_complemento: '',
      endereco_cidade: '',
      endereco_estado: '',
      contador_nome: '',
      contador_crc: '',
      contador_telefone: '',
      serie: '',
      ultimo_cupom_emitido: '',
      ultima_nfe: '',
      senha_certificado: '',
    },
  });

  const onSubmit = async (data: FiscalDataForm) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar dados fiscais.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('fiscal_data')
        .insert([{
          user_id: user.id,
          razao_social: data.razao_social,
          nome_fantasia: data.nome_fantasia || null,
          email_empresarial: data.email_empresarial,
          email_contador: data.email_contador || null,
          endereco_rua: data.endereco_rua,
          endereco_numero: data.endereco_numero,
          endereco_complemento: data.endereco_complemento || null,
          endereco_cidade: data.endereco_cidade,
          endereco_estado: data.endereco_estado,
          contador_nome: data.contador_nome || null,
          contador_crc: data.contador_crc || null,
          contador_telefone: data.contador_telefone || null,
          serie: data.serie || null,
          ultimo_cupom_emitido: data.ultimo_cupom_emitido || null,
          ultima_nfe: data.ultima_nfe || null,
          senha_certificado: data.senha_certificado || null,
          arquivo_token_url: tokenFileUrl || null,
          certificado_digital_url: certificadoUrl || null,
        }]);

      if (error) {
        throw error;
      }

      // Log da atividade
      await logAdminActivity('create', 'fiscal_data', data.razao_social);

      toast({
        title: "Sucesso",
        description: "Dados fiscais cadastrados com sucesso!",
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error saving fiscal data:', error);
      toast({
        title: "Erro",
        description: error.message || "Não foi possível salvar os dados fiscais.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-brand-gold" />
              Cadastro de Dados Fiscais
            </h1>
            <p className="text-gray-600 mt-2">
              Preencha os dados fiscais da sua empresa
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Informações Fiscais</CardTitle>
              <CardDescription>
                Cadastre os dados fiscais necessários para sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Dados da Empresa */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="razao_social"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Razão Social *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="nome_fantasia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome Fantasia</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* E-mails */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email_empresarial"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail Empresarial *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email_contador"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail do Contador</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Endereço */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="endereco_rua"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Rua *</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="endereco_numero"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="endereco_complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endereco_cidade"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade *</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endereco_estado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado *</FormLabel>
                            <FormControl>
                              <Input {...field} maxLength={2} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Dados do Contador */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Dados do Contador</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="contador_nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome do Contador</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contador_crc"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CRC</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="contador_telefone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Dados Fiscais */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Dados Fiscais</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="serie"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Série</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultimo_cupom_emitido"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Último Cupom Emitido</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ultima_nfe"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Última NFe</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Certificado Digital */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Certificado Digital</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <ImageUpload
                        label="Certificado Digital"
                        value={certificadoUrl}
                        onChange={setCertificadoUrl}
                        accept=".p12,.pfx,.crt,.cer"
                        className="md:col-span-2"
                      />
                      <FormField
                        control={form.control}
                        name="senha_certificado"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha do Certificado</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Token de Cupom Fiscal */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Token de Cupom Fiscal</h3>
                    <ImageUpload
                      label="Arquivo de Token (XML, TXT ou PDF)"
                      value={tokenFileUrl}
                      onChange={setTokenFileUrl}
                      accept=".xml,.txt,.pdf"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/')}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="bg-brand-gold hover:bg-brand-gold/90"
                    >
                      {loading ? 'Salvando...' : 'Salvar Dados Fiscais'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FiscalData;
