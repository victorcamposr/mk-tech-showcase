import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactIcon from "@/components/ContactIcon";
import SimpleIcon from "@/components/SimpleIcon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Contact = () => {
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
      iconType: "location" as const,
      title: "Endereço",
      info: "Av Marechal Rondon, 1512\nPontes e Lacerda/MT",
      link: null
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
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
              Entre em <span className="text-brand-gold">Contato</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Estamos prontos para atender você e transformar seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informações de Contato */}
            <div>
              <h2 className="text-3xl font-bold text-brand-black mb-8">
                Fale Conosco
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {contactInfo.map((contact, index) => (
                   <Card key={index} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-2 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                     <CardContent className="p-8 text-center">
                       <ContactIcon type={contact.iconType} className="mb-6 group-hover:animate-pulse" />
                       <h3 className="font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors duration-300">{contact.title}</h3>
                      {contact.link ? (
                        <a 
                          href={contact.link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-brand-gold hover:text-brand-gold-dark transition-colors font-medium"
                        >
                          {contact.info}
                        </a>
                      ) : (
                        <p className="text-gray-600 whitespace-pre-line">{contact.info}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Horário de Atendimento */}
              <Card className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ContactIcon type="clock" className="group-hover:animate-pulse" />
                    <CardTitle className="text-brand-black">Horário de Atendimento</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-gray-600">
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
                  <div className="mt-4 p-4 bg-gradient-to-r from-brand-gold/10 to-brand-gold/20 rounded-xl backdrop-blur-sm">
                    <p className="text-sm text-brand-black">
                      <strong>Suporte de Emergência:</strong> Disponível 24/7 via WhatsApp para clientes com contratos de suporte.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Formulário de Contato */}
            <div>
              <Card className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-brand-black">Envie sua Mensagem</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-2">
                          Nome *
                        </label>
                        <Input placeholder="Seu nome completo" className="border-brand-gold/20 focus:border-brand-gold transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-2">
                          Empresa
                        </label>
                        <Input placeholder="Nome da sua empresa" className="border-brand-gold/20 focus:border-brand-gold transition-colors" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-2">
                          E-mail *
                        </label>
                        <Input type="email" placeholder="seu@email.com" className="border-brand-gold/20 focus:border-brand-gold transition-colors" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-brand-black mb-2">
                          Telefone *
                        </label>
                        <Input placeholder="(65) 99999-9999" className="border-brand-gold/20 focus:border-brand-gold transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-black mb-2">
                        Assunto *
                      </label>
                      <Input placeholder="Como podemos ajudar?" className="border-brand-gold/20 focus:border-brand-gold transition-colors" />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-brand-black mb-2">
                        Mensagem *
                      </label>
                      <Textarea 
                        placeholder="Descreva suas necessidades ou dúvidas..."
                        className="border-brand-gold/20 focus:border-brand-gold transition-colors min-h-[120px]"
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

          {/* Localização */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-8">
              Nossa Localização
            </h2>
            <Card className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50/50">
              <CardContent className="p-12 text-center">
                <ContactIcon type="map" className="mb-6 mx-auto" />
                <h3 className="text-xl font-semibold text-brand-black mb-2">
                  Av Marechal Rondon, 1512
                </h3>
                <p className="text-gray-600 mb-4 font-medium">Pontes e Lacerda - MT</p>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;