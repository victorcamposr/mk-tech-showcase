import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SimpleIcon from "@/components/SimpleIcon";

interface FormData {
  name: string;
  company?: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactFormProps {
  onSuccess: () => void;
}

const ContactForm = ({ onSuccess }: ContactFormProps) => {
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    console.log('Iniciando envio do formulário:', data);
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_key: '4b611952-1cbf-41e2-92e0-94827feb419d',
          name: data.name,
          company: data.company || '',
          email: data.email,
          phone: data.phone,
          subject: data.subject,
          message: data.message
        })
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        onSuccess();
        toast({
          title: "Mensagem enviada!",
          description: "Recebemos sua mensagem e entraremos em contato em breve.",
        });
        reset();
      } else {
        throw new Error('Erro no envio');
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      toast({
        title: "Erro ao enviar",
        description: "Não foi possível enviar sua mensagem. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
  };

  const handleFormSubmit = handleSubmit(
    onSubmit,
    (errors) => {
      console.log("Form validation errors:", errors);
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos obrigatórios antes de enviar.",
        variant: "destructive",
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Nome *
              </label>
              <Input 
                name="name"
                placeholder="Seu nome completo" 
                className="border-gray-300 focus:border-brand-black focus:ring-1 focus:ring-brand-black focus-visible:ring-brand-black focus:ring-offset-0 transition-all duration-200" 
                {...register("name", { required: "Nome é obrigatório" })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Empresa
              </label>
              <Input 
                name="company"
                placeholder="Nome da sua empresa" 
                className="border-gray-300 focus:border-brand-black focus:ring-1 focus:ring-brand-black focus-visible:ring-brand-black focus:ring-offset-0 transition-all duration-200" 
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
                className="border-gray-300 focus:border-brand-black focus:ring-1 focus:ring-brand-black focus-visible:ring-brand-black focus:ring-offset-0 transition-all duration-200" 
                {...register("email", { required: "E-mail é obrigatório" })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">
                Telefone *
              </label>
              <Input 
                name="phone"
                placeholder="(65) 99999-9999" 
                className="border-gray-300 focus:border-brand-black focus:ring-1 focus:ring-brand-black focus-visible:ring-brand-black focus:ring-offset-0 transition-all duration-200" 
                {...register("phone", { required: "Telefone é obrigatório" })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Assunto *
            </label>
            <Input 
              name="subject"
              placeholder="Como podemos ajudar?" 
              className="border-gray-300 focus:border-brand-black focus:ring-1 focus:ring-brand-black focus-visible:ring-brand-black focus:ring-offset-0 transition-all duration-200" 
              {...register("subject", { required: "Assunto é obrigatório" })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">
              Mensagem *
            </label>
            <Textarea 
              name="message"
              placeholder="Descreva suas necessidades ou dúvidas..."
              className="border-gray-300 focus:border-brand-black focus:ring-1 focus:ring-brand-black focus-visible:ring-brand-black focus:ring-offset-0 transition-all duration-200 min-h-[120px]"
              {...register("message", { required: "Mensagem é obrigatória" })}
            />
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