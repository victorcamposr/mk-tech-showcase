import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SimpleIcon from "@/components/SimpleIcon";
import { supabase } from "@/integrations/supabase/client";
import { useRecaptcha } from '@/hooks/useRecaptcha';

interface FormData {
  name: string;
  company?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  honeypot?: string;
}

interface ContactFormProps {
  onSuccess: () => void;
}

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<FormData>();
  const { executeRecaptchaAction } = useRecaptcha();

  const onSubmit = async (data: FormData) => {
    console.log('=== INÍCIO DO ENVIO DO FORMULÁRIO ===');
    console.log('Dados do formulário:', data);
    
    // Verificar se é um bot (honeypot preenchido)
    if (data.honeypot && data.honeypot.trim() !== '') {
      console.log('Bot detectado via honeypot');
      return;
    }
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    const requiredFields = ['name', 'email', 'phone', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !data[field as keyof FormData] || data[field as keyof FormData] === '');
    
    if (missingFields.length > 0) {
      console.error('Campos obrigatórios não preenchidos:', missingFields);
      toast({
        title: "Campos obrigatórios",
        description: `Preencha os campos: ${missingFields.join(', ')}`,
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    console.log('Todos os campos obrigatórios estão preenchidos');

    // Execute reCAPTCHA
    const recaptchaToken = await executeRecaptchaAction('contact_form');
    if (!recaptchaToken) {
      toast({
        title: "Erro de segurança",
        description: "Falha na verificação de segurança. Tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    try {
      // Primeiro, salvar no banco de dados
      console.log('Salvando contato no banco de dados...');
      const { error: dbError } = await supabase
        .from('contacts')
        .insert([
          {
            name: data.name,
            email: data.email,
            phone: data.phone,
            company: data.company || null,
            message: `Assunto: ${data.subject}\n\nMensagem:\n${data.message}`,
          }
        ]);

      if (dbError) {
        console.error('❌ Erro ao salvar no banco:', dbError);
        throw new Error('Erro ao salvar mensagem no sistema');
      }

      console.log('✅ Contato salvo no banco com sucesso!');

      // Depois, enviar por email via Web3Forms
      const requestBody = {
        access_key: 'd4fff2da-a30b-487a-b131-e858f54b1c95',
        name: data.name,
        company: data.company || '',
        email: data.email,
        phone: data.phone,
        subject: `Contato via site: ${data.subject}`,
        message: `Nome: ${data.name}\nEmpresa: ${data.company || 'Não informado'}\nTelefone: ${data.phone}\nE-mail: ${data.email}\n\nMensagem:\n${data.message}`,
        from_name: data.name,
        replyto: data.email,
        redirect: false
      };

      console.log('Enviando email via Web3Forms...');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Status da resposta:', response.status);
      const result = await response.json();
      console.log('Dados da resposta:', result);

      if (response.ok && result.success) {
        console.log('✅ Email enviado com sucesso!');
        onSuccess();
        toast({
          title: "Mensagem enviada!",
          description: "Recebemos sua mensagem e entraremos em contato em breve.",
          duration: 5000,
        });
        reset();
      } else {
        console.error('❌ Erro no envio do email:', result);
        
        // Mesmo que o email falhe, o contato foi salvo no banco
        toast({
          title: "Mensagem recebida!",
          description: "Sua mensagem foi salva em nosso sistema. Entraremos em contato em breve.",
          duration: 5000,
        });
        onSuccess();
        reset();
      }
    } catch (error) {
      console.error('❌ Erro durante o envio:', error);
      
      let errorMessage = "Não foi possível enviar sua mensagem. Tente novamente mais tarde.";
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (error instanceof Error) {
        errorMessage = `Erro: ${error.message}`;
      }
      
      toast({
        title: "Erro ao enviar",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
    
    console.log('=== FIM DO PROCESSO DE ENVIO ===');
  };

  const handleFormSubmit = handleSubmit(
    onSubmit,
    (errors) => {
      console.log("❌ Erros de validação do formulário:", errors);
      console.log("Exibindo toast de campos obrigatórios...");
      
      const errorFields = Object.keys(errors);
      console.log("Campos com erro:", errorFields);
      
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de enviar.",
        variant: "destructive",
        duration: 5000,
      });
    }
  );

  return (
    <Card className="border-brand-gold/20 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
      <CardHeader className="p-4">
        <CardTitle className="text-base text-brand-black">Envie sua Mensagem</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <form className="space-y-6">
          {/* Campo honeypot - oculto para usuários normais */}
          <div style={{ display: 'none' }}>
            <Input 
              {...register("honeypot")}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Nome *
              </label>
              <Input 
                name="name"
                placeholder="Seu nome completo" 
                {...register("name", { required: "Nome é obrigatório" })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Empresa
              </label>
              <Input 
                name="company"
                placeholder="Nome da sua empresa" 
                {...register("company")}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                E-mail *
              </label>
              <Input 
                type="email" 
                name="email"
                placeholder="seu@email.com" 
                {...register("email", { 
                  required: "E-mail é obrigatório",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "E-mail inválido"
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Telefone *
              </label>
              <Input 
                name="phone"
                placeholder="(65) 99999-9999" 
                {...register("phone", { 
                  required: "Telefone é obrigatório"
                })}
                onInput={(e) => {
                  const target = e.target as HTMLInputElement;
                  const value = target.value.replace(/\D/g, '');
                  let formattedValue = '';
                  
                  if (value.length > 0) {
                    if (value.length <= 2) {
                      formattedValue = `(${value}`;
                    } else if (value.length <= 7) {
                      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
                    } else {
                      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
                    }
                  }
                  
                  setValue('phone', formattedValue);
                  target.value = formattedValue;
                }}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Assunto *
            </label>
            <Input 
              name="subject"
              placeholder="Como podemos ajudar?" 
              {...register("subject", { required: "Assunto é obrigatório" })}
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Mensagem *
            </label>
            <Textarea 
              name="message"
              placeholder="Descreva suas necessidades ou dúvidas..."
              className="min-h-[120px]"
              {...register("message", { required: "Mensagem é obrigatória" })}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <Button 
            type="button"
            onClick={handleFormSubmit}
            className="w-full bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold transition-all duration-300 hover:scale-105"
          >
            Enviar Mensagem
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Prefere falar diretamente? Use nosso WhatsApp:
          </p>
           <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
             <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
               <SimpleIcon type="whatsapp-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
               Abrir WhatsApp
             </a>
           </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
