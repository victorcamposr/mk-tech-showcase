import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Receipt, Upload, FileText, Building2, MapPin, User, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const fiscalDataSchema = z.object({
  razao_social: z.string().min(1, 'Razão social é obrigatória'),
  nome_fantasia: z.string().min(1, 'Nome fantasia é obrigatório'),
  endereco_rua: z.string().min(1, 'Rua é obrigatória'),
  endereco_numero: z.string().min(1, 'Número é obrigatório'),
  endereco_complemento: z.string().min(1, 'Complemento é obrigatório'),
  endereco_cidade: z.string().min(1, 'Cidade é obrigatória'),
  endereco_estado: z.string().min(1, 'Estado é obrigatório'),
  email_empresarial: z.string().email('Email empresarial inválido'),
  contador_nome: z.string().min(1, 'Nome do contador é obrigatório'),
  contador_crc: z.string().min(1, 'CRC do contador é obrigatório'),
  contador_telefone: z.string().min(1, 'Telefone do contador é obrigatório'),
  email_contador: z.string().email('Email do contador inválido'),
  serie: z.string().min(1, 'Série é obrigatória'),
  ultimo_cupom_emitido: z.string().min(1, 'Último cupom emitido é obrigatório'),
  ultima_nfe: z.string().min(1, 'Última NFe é obrigatória'),
  senha_certificado: z.string().min(1, 'Senha do certificado é obrigatória'),
});

type FiscalDataForm = z.infer<typeof fiscalDataSchema>;

const FiscalDataForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tokenFile, setTokenFile] = useState<File | null>(null);
  const [certFile, setCertFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FiscalDataForm>({
    resolver: zodResolver(fiscalDataSchema),
    defaultValues: {
      razao_social: '',
      nome_fantasia: '',
      endereco_rua: '',
      endereco_numero: '',
      endereco_complemento: '',
      endereco_cidade: '',
      endereco_estado: '',
      email_empresarial: '',
      contador_nome: '',
      contador_crc: '',
      contador_telefone: '',
      email_contador: '',
      serie: '',
      ultimo_cupom_emitido: '',
      ultima_nfe: '',
      senha_certificado: '',
    },
  });

  const uploadFile = async (file: File, bucket: string = 'images') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `fiscal/${fileName}`;

    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const onSubmit = async (data: FiscalDataForm) => {
    setIsSubmitting(true);
    try {
      let arquivo_token_url = '';
      let certificado_digital_url = '';

      // Upload dos arquivos se foram selecionados
      if (tokenFile) {
        arquivo_token_url = await uploadFile(tokenFile);
      }

      if (certFile) {
        certificado_digital_url = await uploadFile(certFile);
      }

      // Inserir dados no banco
      const { error } = await supabase
        .from('fiscal_data')
        .insert({
          razao_social: data.razao_social,
          nome_fantasia: data.nome_fantasia || null,
          endereco_rua: data.endereco_rua,
          endereco_numero: data.endereco_numero,
          endereco_complemento: data.endereco_complemento || null,
          endereco_cidade: data.endereco_cidade,
          endereco_estado: data.endereco_estado,
          email_empresarial: data.email_empresarial,
          contador_nome: data.contador_nome || null,
          contador_crc: data.contador_crc || null,
          contador_telefone: data.contador_telefone || null,
          email_contador: data.email_contador || null,
          serie: data.serie || null,
          ultimo_cupom_emitido: data.ultimo_cupom_emitido || null,
          ultima_nfe: data.ultima_nfe || null,
          senha_certificado: data.senha_certificado || null,
          arquivo_token_url: arquivo_token_url || null,
          certificado_digital_url: certificado_digital_url || null,
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Seus dados fiscais foram registrados. Nossa equipe entrará em contato em breve.',
      });

      navigate('/');
    } catch (error) {
      console.error('Error submitting fiscal data:', error);
      toast({
        title: 'Erro ao cadastrar',
        description: 'Ocorreu um erro ao registrar seus dados. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const estados = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
  ];

  return (
    <div className="min-h-screen bg-white">{/* Mudança: fundo branco */}
      <Header />
      
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-brand-gold to-brand-gold-light rounded-xl shadow-lg">
                <Receipt className="w-8 h-8 text-brand-black" />
              </div>
              <h1 className="text-4xl font-bold text-brand-black">
                Cadastro <span className="text-brand-gold">Fiscal</span>
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">{/* Mudança: texto escuro para fundo branco */}
              Complete o formulário abaixo com os dados fiscais da sua empresa. Nossa equipe entrará em contato para configurar sua solução.
            </p>
          </div>

          <Card className="bg-white border border-gray-200 shadow-lg">{/* Mudança: card branco com borda cinza */}
            <CardHeader>
              <CardTitle className="text-brand-black text-2xl">Dados Fiscais da Empresa</CardTitle>{/* Mudança: texto escuro */}
              <CardDescription className="text-gray-600">{/* Mudança: texto escuro */}
                Preencha todos os campos obrigatórios para iniciar o processo de configuração fiscal.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Token de Cupom Fiscal */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <FileText className="w-5 h-5 text-brand-gold" />
                        <h3 className="text-lg font-semibold text-brand-black">Token de Emitir Cupom Fiscal</h3>{/* Mudança: texto escuro */}
                      </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arquivo Token (XML, TXT ou PDF)
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-gold/30 border-dashed rounded-lg cursor-pointer bg-brand-gold/5 hover:bg-brand-gold/10 transition-colors duration-300">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-brand-gold" />
                            <p className="mb-2 text-sm text-gray-700">
                              <span className="font-semibold">Clique para fazer upload</span> do arquivo token
                            </p>
                            <p className="text-xs text-gray-600">XML, TXT ou PDF (MAX. 10MB)</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            accept=".xml,.txt,.pdf"
                            onChange={(e) => setTokenFile(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      {tokenFile && (
                        <p className="text-sm text-brand-gold mt-2">Arquivo selecionado: {tokenFile.name}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="serie"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Série *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
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
                            <FormLabel className="text-gray-700">Último Cupom Emitido *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
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
                            <FormLabel className="text-gray-700">Última NFe *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Certificado Digital */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Upload className="w-5 h-5 text-brand-gold" />
                      <h3 className="text-lg font-semibold text-brand-black">Certificado Digital</h3>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Arquivo do Certificado
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-brand-gold/30 border-dashed rounded-lg cursor-pointer bg-brand-gold/5 hover:bg-brand-gold/10 transition-colors duration-300">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-brand-gold" />
                            <p className="mb-2 text-sm text-gray-700">
                              <span className="font-semibold">Clique para fazer upload</span> do certificado
                            </p>
                            <p className="text-xs text-gray-600">Arquivo do certificado digital</p>
                          </div>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                          />
                        </label>
                      </div>
                      {certFile && (
                        <p className="text-sm text-brand-gold mt-2">Arquivo selecionado: {certFile.name}</p>
                      )}
                    </div>

                    <FormField
                      control={form.control}
                      name="senha_certificado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Senha do Certificado *</FormLabel>
                          <FormControl>
                            <Input 
                              type="password" 
                              {...field} 
                              className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dados da Empresa */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Building2 className="w-5 h-5 text-brand-gold" />
                      <h3 className="text-lg font-semibold text-brand-black">Dados da Empresa</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="razao_social"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Razão Social *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
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
                            <FormLabel className="text-gray-700">Nome Fantasia *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Endereço */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <MapPin className="w-5 h-5 text-brand-gold" />
                      <h3 className="text-lg font-semibold text-brand-black">Endereço</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <FormField
                          control={form.control}
                          name="endereco_rua"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-gray-700">Rua *</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
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
                            <FormLabel className="text-gray-700">Número *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="endereco_complemento"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Complemento *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
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
                            <FormLabel className="text-gray-700">Cidade *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="endereco_estado"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-700">Estado *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Digite o estado" className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Dados do Contador */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <User className="w-5 h-5 text-brand-gold" />
                      <h3 className="text-lg font-semibold text-brand-black">Dados do Contador</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="contador_nome"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">Nome *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
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
                            <FormLabel className="text-gray-700">CRC *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
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
                            <FormLabel className="text-gray-700">Telefone *</FormLabel>
                            <FormControl>
                              <Input {...field} className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* E-mails */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Mail className="w-5 h-5 text-brand-gold" />
                      <h3 className="text-lg font-semibold text-brand-black">E-mails de Contato</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email_empresarial"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-700">E-mail Empresarial *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                {...field} 
                                className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" 
                              />
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
                            <FormLabel className="text-gray-700">E-mail do Contador *</FormLabel>
                            <FormControl>
                              <Input 
                                type="email" 
                                {...field} 
                                className="bg-white border border-gray-300 text-gray-900 placeholder-gray-500" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-brand-gold to-brand-gold-light hover:from-brand-gold-dark hover:to-brand-gold text-brand-black font-bold py-3 text-lg transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {isSubmitting ? 'Cadastrando...' : 'Cadastrar Dados Fiscais'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FiscalDataForm;