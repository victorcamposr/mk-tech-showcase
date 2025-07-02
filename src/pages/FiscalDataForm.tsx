
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { FileText, Upload } from 'lucide-react';

const fiscalDataSchema = z.object({
  token_cupom_fiscal: z.string().optional(),
  serie: z.string().optional(),
  ultimo_cupom_emitido: z.string().optional(),
  ultima_nfe: z.string().optional(),
  senha_certificado: z.string().optional(),
  razao_social: z.string().min(1, "Razão social é obrigatória"),
  nome_fantasia: z.string().optional(),
  endereco_rua: z.string().min(1, "Rua é obrigatória"),
  endereco_numero: z.string().min(1, "Número é obrigatório"),
  endereco_complemento: z.string().optional(),
  endereco_cidade: z.string().min(1, "Cidade é obrigatória"),
  endereco_estado: z.string().min(1, "Estado é obrigatório"),
  contador_nome: z.string().optional(),
  contador_crc: z.string().optional(),
  contador_telefone: z.string().optional(),
  email_empresarial: z.string().email("E-mail empresarial inválido"),
  email_contador: z.string().email("E-mail do contador inválido").optional().or(z.literal("")),
});

type FiscalDataForm = z.infer<typeof fiscalDataSchema>;

const FiscalDataForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [tokenFile, setTokenFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);

  const form = useForm<FiscalDataForm>({
    resolver: zodResolver(fiscalDataSchema),
    defaultValues: {
      token_cupom_fiscal: "",
      serie: "",
      ultimo_cupom_emitido: "",
      ultima_nfe: "",
      senha_certificado: "",
      razao_social: "",
      nome_fantasia: "",
      endereco_rua: "",
      endereco_numero: "",
      endereco_complemento: "",
      endereco_cidade: "",
      endereco_estado: "",
      contador_nome: "",
      contador_crc: "",
      contador_telefone: "",
      email_empresarial: "",
      email_contador: "",
    },
  });

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(path, file);

    if (error) throw error;
    return data.path;
  };

  const onSubmit = async (data: FiscalDataForm) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para cadastrar dados fiscais.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let tokenFileUrl = "";
      let certificateFileUrl = "";

      if (tokenFile) {
        const tokenPath = `fiscal/tokens/${user.id}/${Date.now()}_${tokenFile.name}`;
        tokenFileUrl = await uploadFile(tokenFile, tokenPath);
      }

      if (certificateFile) {
        const certPath = `fiscal/certificates/${user.id}/${Date.now()}_${certificateFile.name}`;
        certificateFileUrl = await uploadFile(certificateFile, certPath);
      }

      // Ensure all required fields are present and properly typed
      const fiscalData = {
        user_id: user.id,
        token_cupom_fiscal: data.token_cupom_fiscal || null,
        arquivo_token_url: tokenFileUrl || null,
        serie: data.serie || null,
        ultimo_cupom_emitido: data.ultimo_cupom_emitido || null,
        ultima_nfe: data.ultima_nfe || null,
        certificado_digital_url: certificateFileUrl || null,
        senha_certificado: data.senha_certificado || null,
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia || null,
        endereco_rua: data.endereco_rua,
        endereco_numero: data.endereco_numero,
        endereco_complemento: data.endereco_complemento || null,
        endereco_cidade: data.endereco_cidade,
        endereco_estado: data.endereco_estado,
        contador_nome: data.contador_nome || null,
        contador_crc: data.contador_crc || null,
        contador_telefone: data.contador_telefone || null,
        email_empresarial: data.email_empresarial,
        email_contador: data.email_contador || null,
      };

      const { error } = await supabase
        .from('fiscal_data')
        .insert(fiscalData);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Dados fiscais cadastrados com sucesso.",
      });

      form.reset();
      setTokenFile(null);
      setCertificateFile(null);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro ao cadastrar dados fiscais. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-brand-black flex items-center justify-center gap-2">
              <FileText className="w-8 h-8 text-brand-gold" />
              Cadastro de Dados Fiscais
            </CardTitle>
            <CardDescription className="text-lg">
              Preencha todos os dados necessários para configuração fiscal
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Dados do Token */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-black">Token de Emitir Cupom Fiscal</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Arquivo do Token (XML, TXT ou PDF)</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".xml,.txt,.pdf"
                          onChange={(e) => setTokenFile(e.target.files?.[0] || null)}
                          className="w-full"
                        />
                        {tokenFile && (
                          <p className="text-sm text-green-600 mt-2">
                            <Upload className="w-4 h-4 inline mr-1" />
                            {tokenFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
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
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <h3 className="text-xl font-semibold text-brand-black">Certificado Digital</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Certificado Digital</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          accept=".p12,.pfx,.pem"
                          onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                          className="w-full"
                        />
                        {certificateFile && (
                          <p className="text-sm text-green-600 mt-2">
                            <Upload className="w-4 h-4 inline mr-1" />
                            {certificateFile.name}
                          </p>
                        )}
                      </div>
                    </div>
                    
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

                {/* Dados da Empresa */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-black">Dados da Empresa</h3>
                  
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
                </div>

                {/* Endereço */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-black">Endereço</h3>
                  
                  <div className="grid grid-cols-1 md:grid-3 gap-4">
                    <FormField
                      control={form.control}
                      name="endereco_rua"
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel>Rua *</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dados do Contador */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-black">Dados do Contador</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="contador_nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
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

                {/* E-mails */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-brand-black">E-mails</h3>
                  
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
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold"
                  disabled={isLoading}
                >
                  {isLoading ? "Cadastrando..." : "Cadastrar Dados Fiscais"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default FiscalDataForm;
