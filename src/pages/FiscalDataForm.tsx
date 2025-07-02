
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ui/image-upload";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const fiscalDataSchema = z.object({
  razao_social: z.string().min(1, "Razão social é obrigatória"),
  nome_fantasia: z.string().optional(),
  email_empresarial: z.string().email("E-mail inválido"),
  email_contador: z.string().email("E-mail inválido").optional().or(z.literal("")),
  endereco_rua: z.string().min(1, "Rua é obrigatória"),
  endereco_numero: z.string().min(1, "Número é obrigatório"),
  endereco_complemento: z.string().optional(),
  endereco_cidade: z.string().min(1, "Cidade é obrigatória"),
  endereco_estado: z.string().min(2, "Estado é obrigatório"),
  contador_nome: z.string().optional(),
  contador_crc: z.string().optional(),
  contador_telefone: z.string().optional(),
  serie: z.string().optional(),
  ultimo_cupom_emitido: z.string().optional(),
  ultima_nfe: z.string().optional(),
  senha_certificado: z.string().optional(),
});

type FiscalDataForm = z.infer<typeof fiscalDataSchema>;

const FiscalDataForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [tokenFileUrl, setTokenFileUrl] = useState("");
  const [certificadoUrl, setCertificadoUrl] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FiscalDataForm>({
    resolver: zodResolver(fiscalDataSchema),
  });

  const onSubmit = async (data: FiscalDataForm) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Erro",
          description: "Você precisa estar logado para cadastrar dados fiscais.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("fiscal_data")
        .insert({
          ...data,
          user_id: user.id,
          arquivo_token_url: tokenFileUrl,
          certificado_digital_url: certificadoUrl,
        });

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Dados fiscais cadastrados com sucesso!",
      });

      reset();
      setTokenFileUrl("");
      setCertificadoUrl("");
      navigate("/");
    } catch (error: any) {
      console.error("Erro ao cadastrar dados fiscais:", error);
      toast({
        title: "Erro",
        description: error.message || "Erro ao cadastrar dados fiscais.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Cadastro de Dados Fiscais - MK Tecnologia"
        description="Cadastre seus dados fiscais para emissão de cupons e notas fiscais"
      />
      <Header />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-brand-black mb-4">
              Cadastro de <span className="text-brand-gold">Dados Fiscais</span>
            </h1>
            <p className="text-lg text-gray-600">
              Preencha os dados abaixo para configurar a emissão fiscal da sua empresa
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Dados da Empresa */}
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-black">Dados da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="razao_social">Razão Social *</Label>
                    <Input
                      id="razao_social"
                      {...register("razao_social")}
                      className={errors.razao_social ? "border-red-500" : ""}
                    />
                    {errors.razao_social && (
                      <p className="text-red-500 text-sm mt-1">{errors.razao_social.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nome_fantasia">Nome Fantasia</Label>
                    <Input id="nome_fantasia" {...register("nome_fantasia")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email_empresarial">E-mail Empresarial *</Label>
                    <Input
                      id="email_empresarial"
                      type="email"
                      {...register("email_empresarial")}
                      className={errors.email_empresarial ? "border-red-500" : ""}
                    />
                    {errors.email_empresarial && (
                      <p className="text-red-500 text-sm mt-1">{errors.email_empresarial.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Endereço */}
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-black">Endereço</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="endereco_rua">Rua *</Label>
                    <Input
                      id="endereco_rua"
                      {...register("endereco_rua")}
                      className={errors.endereco_rua ? "border-red-500" : ""}
                    />
                    {errors.endereco_rua && (
                      <p className="text-red-500 text-sm mt-1">{errors.endereco_rua.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="endereco_numero">Número *</Label>
                    <Input
                      id="endereco_numero"
                      {...register("endereco_numero")}
                      className={errors.endereco_numero ? "border-red-500" : ""}
                    />
                    {errors.endereco_numero && (
                      <p className="text-red-500 text-sm mt-1">{errors.endereco_numero.message}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="endereco_complemento">Complemento</Label>
                    <Input id="endereco_complemento" {...register("endereco_complemento")} />
                  </div>
                  <div>
                    <Label htmlFor="endereco_cidade">Cidade *</Label>
                    <Input
                      id="endereco_cidade"
                      {...register("endereco_cidade")}
                      className={errors.endereco_cidade ? "border-red-500" : ""}
                    />
                    {errors.endereco_cidade && (
                      <p className="text-red-500 text-sm mt-1">{errors.endereco_cidade.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="endereco_estado">Estado *</Label>
                    <Input
                      id="endereco_estado"
                      {...register("endereco_estado")}
                      className={errors.endereco_estado ? "border-red-500" : ""}
                      maxLength={2}
                    />
                    {errors.endereco_estado && (
                      <p className="text-red-500 text-sm mt-1">{errors.endereco_estado.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados do Contador */}
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-black">Dados do Contador</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contador_nome">Nome do Contador</Label>
                    <Input id="contador_nome" {...register("contador_nome")} />
                  </div>
                  <div>
                    <Label htmlFor="contador_crc">CRC</Label>
                    <Input id="contador_crc" {...register("contador_crc")} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contador_telefone">Telefone</Label>
                    <Input id="contador_telefone" {...register("contador_telefone")} />
                  </div>
                  <div>
                    <Label htmlFor="email_contador">E-mail do Contador</Label>
                    <Input
                      id="email_contador"
                      type="email"
                      {...register("email_contador")}
                      className={errors.email_contador ? "border-red-500" : ""}
                    />
                    {errors.email_contador && (
                      <p className="text-red-500 text-sm mt-1">{errors.email_contador.message}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dados Fiscais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-black">Dados Fiscais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="serie">Série</Label>
                    <Input id="serie" {...register("serie")} />
                  </div>
                  <div>
                    <Label htmlFor="ultimo_cupom_emitido">Último Cupom Emitido</Label>
                    <Input id="ultimo_cupom_emitido" {...register("ultimo_cupom_emitido")} />
                  </div>
                  <div>
                    <Label htmlFor="ultima_nfe">Última NFe</Label>
                    <Input id="ultima_nfe" {...register("ultima_nfe")} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Arquivos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-brand-black">Arquivos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ImageUpload
                  label="Token de Cupom Fiscal (XML, TXT ou PDF)"
                  value={tokenFileUrl}
                  onChange={setTokenFileUrl}
                  accept=".xml,.txt,.pdf"
                />
                <ImageUpload
                  label="Certificado Digital"
                  value={certificadoUrl}
                  onChange={setCertificadoUrl}
                  accept=".p12,.pfx"
                />
                <div>
                  <Label htmlFor="senha_certificado">Senha do Certificado</Label>
                  <Input
                    id="senha_certificado"
                    type="password"
                    {...register("senha_certificado")}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold px-8 py-3"
              >
                {isLoading ? "Salvando..." : "Cadastrar Dados Fiscais"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FiscalDataForm;
