import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactIcon from "@/components/ContactIcon";
import SimpleIcon from "@/components/SimpleIcon";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useState } from "react";

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const contactInfo = [
    {
      iconType: "whatsapp" as const,
      title: "WhatsApp",
      info: "(65) 99353-5079",
      link: "https://wa.me/5565993535079"
    },
    {
      iconType: "email" as const,
      title: "E-mail",
      info: "mktecnologiaoficial@gmail.com",
      link: "mailto:mktecnologiaoficial@gmail.com"
    },
    {
      iconType: "instagram" as const,
      title: "Instagram",
      info: "@mktecnologiaoficial",
      link: "https://instagram.com/mktecnologiaoficial"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Entre em Contato"
        description="Fale conosco para solicitar orçamento ou tirar dúvidas sobre automação comercial. WhatsApp: (65) 99353-5079. Atendemos Pontes e Lacerda e região com suporte especializado."
        keywords="contato MK Tecnologia, orçamento automação comercial, WhatsApp, telefone, endereço Pontes e Lacerda, atendimento"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Contato", url: "/contato" }
          ]
        }}
      />
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <ScrollReveal animation="fade-in">
            <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
              Entre em <span className="text-brand-gold">Contato</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos prontos para atender você e transformar seu negócio
            </p>
          </div>
        </ScrollReveal>

          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Informações de Contato */}
              <div>
              <h2 className="text-3xl font-bold text-brand-black mb-8">
                Fale Conosco
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
                {contactInfo.map((contact, index) => (
                   <Card key={index} className="border-brand-gold/20 hover:shadow-lg hover:shadow-brand-gold/5 transition-all duration-300 hover:-translate-y-1 group bg-gradient-to-br from-white to-gray-50/30">
                     <CardContent className="p-6 text-center">
                       <ContactIcon type={contact.iconType} className="mb-4 group-hover:animate-pulse" />
                       <h3 className="text-sm font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors duration-300">{contact.title}</h3>
                      {contact.link ? (
                        <a 
                          href={contact.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-gold hover:text-brand-gold-dark transition-colors text-sm font-medium block break-words"
                        >
                          {contact.info}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line text-sm break-words">{contact.info}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Horário de Atendimento */}
              <Card className="border-brand-gold/20 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <ContactIcon type="clock" className="group-hover:animate-pulse" />
                    <CardTitle className="text-base text-brand-black">Horário de Atendimento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 text-gray-600 text-sm">
                    <div className="flex justify-between">
                      <span>Segunda a Sexta:</span>
                      <span className="font-medium">08:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sábado:</span>
                      <span className="font-medium">08:00 - 12:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Domingo:</span>
                      <span className="font-medium">Fechado</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-gradient-to-r from-brand-gold/10 to-brand-gold/15 rounded-lg">
                    <p className="text-xs text-brand-black">
                      <strong>Suporte de Emergência:</strong> Disponível 24/7 via WhatsApp para clientes com contratos de suporte.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Contato */}
            <div>
              <Card className="border-brand-gold/20 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
                <CardHeader className="p-4">
                  <CardTitle className="text-base text-brand-black">Envie sua Mensagem</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-2">
                          Nome *
                        </label>
                        <Input placeholder="Seu nome completo" className="border-brand-gold/20 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all duration-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-2">
                          Empresa
                        </label>
                        <Input placeholder="Nome da sua empresa" className="border-brand-gold/20 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all duration-200" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-2">
                          E-mail *
                        </label>
                        <Input type="email" placeholder="seu@email.com" className="border-brand-gold/20 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all duration-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-2">
                          Telefone *
                        </label>
                        <Input placeholder="(65) 99999-9999" className="border-brand-gold/20 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all duration-200" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-black mb-2">
                        Assunto *
                      </label>
                      <Input placeholder="Como podemos ajudar?" className="border-brand-gold/20 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all duration-200" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-black mb-2">
                        Mensagem *
                      </label>
                      <Textarea 
                        placeholder="Descreva suas necessidades ou dúvidas..."
                        className="border-brand-gold/20 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-all duration-200 min-h-[120px]"
                      />
                    </div>

                    <Button 
                      type="submit" 
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
            </div>
            </div>
          </ScrollReveal>

          {/* Localização */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mt-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-8">
              Nossa Localização
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Informações da Localização */}
              <Card className="border-brand-gold/20 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50/30">
                <CardContent className="p-6 text-center">
                  <ContactIcon type="map" className="mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold text-brand-black mb-2">
                    Av Marechal Rondon, 1512
                  </h3>
                  <p className="text-gray-600 mb-4 font-medium">Pontes e Lacerda - MT</p>
                  <p className="text-gray-600 mb-6">
                    Estamos localizados no centro da cidade, facilitando o acesso de nossos clientes 
                    e parceiros. Nossa sede conta com estacionamento e está próxima aos principais 
                    pontos comerciais da cidade.
                  </p>
                  <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black transition-all duration-300 hover:scale-105">
                    <a 
                      href="https://maps.google.com/?q=Av+Marechal+Rondon+1512+Pontes+e+Lacerda+MT" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Ver no Google Maps
                    </a>
                  </Button>
                </CardContent>
              </Card>
              
              {/* Mapa Interativo */}
              <div className="flex flex-col">
                <div className="w-full h-80 lg:h-full rounded-xl overflow-hidden border border-brand-gold/20 shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3858.1234567890!2d-59.3559!3d-15.2293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTXCsDE0JzMxLjMiUyA1OcKwMjEnMjMuNSJX!5e0!3m2!1spt-BR!2sbr!4v1234567890"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Localização MK Tecnologia - Av Marechal Rondon, 1512, Pontes e Lacerda - MT"
                  />
                </div>
              </div>
            </div>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />

      {/* Modal de Confirmação */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md mx-auto bg-white border-brand-gold/20 shadow-2xl">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-gold/30 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-brand-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <DialogTitle className="text-xl font-semibold text-brand-black">
              Mensagem Enviada!
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Recebemos sua mensagem e entraremos em contato em breve. Você também pode nos chamar diretamente no WhatsApp para um atendimento mais rápido.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button 
              onClick={() => setIsModalOpen(false)}
              className="w-full bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold transition-all duration-300"
            >
              Entendi
            </Button>
            <Button 
              asChild
              variant="outline"
              className="w-full border-brand-gold/20 hover:bg-brand-gold/5 text-brand-black transition-all duration-300"
            >
              <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <SimpleIcon type="whatsapp-black" className="w-4 h-4" />
                Abrir WhatsApp
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Contact;