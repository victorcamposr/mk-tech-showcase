import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const services = [
    {
      icon: "💻",
      title: "Automação Comercial",
      description: "Sistemas completos para gestão do seu negócio"
    },
    {
      icon: "📊",
      title: "Controle de Estoque",
      description: "Gestão inteligente com alertas automáticos"
    },
    {
      icon: "🧾",
      title: "Emissão Fiscal",
      description: "NFe, NFCe e cupons fiscais automatizados"
    },
    {
      icon: "💰",
      title: "Gestão Financeira",
      description: "Controle completo do fluxo de caixa"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-black to-brand-black-light text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Transforme seu Negócio com 
                <span className="text-brand-gold block">Automação Comercial</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 max-w-lg">
                Soluções completas em tecnologia para controle de estoque, emissão fiscal 
                e gestão empresarial. Especialistas em automação comercial em Pontes e Lacerda/MT.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold">
                  <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer">
                    💬 Falar no WhatsApp
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-black">
                  <a href="/servicos">
                    Ver Serviços
                  </a>
                </Button>
              </div>
            </div>
            <div className="text-center">
              <img 
                src="/lovable-uploads/a60d254c-a883-48c4-b073-85cb46bc5238.png" 
                alt="MK Tecnologia" 
                className="w-80 h-auto mx-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-brand-black mb-6">
              Nossas <span className="text-brand-gold">Especialidades</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos soluções completas para automatizar e otimizar todos os processos do seu negócio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-6 text-center">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-brand-black mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-brand-black mb-6">
                Sobre a <span className="text-brand-gold">MK Tecnologia</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Somos especialistas em automação comercial, oferecendo soluções tecnológicas 
                inovadoras para empresas de todos os segmentos. Nossa missão é simplificar 
                a gestão empresarial através da tecnologia.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-brand-gold rounded-full mr-4"></div>
                  <span className="text-gray-700">Controle de estoque inteligente</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-brand-gold rounded-full mr-4"></div>
                  <span className="text-gray-700">Emissão de cupom fiscal e notas fiscais</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-brand-gold rounded-full mr-4"></div>
                  <span className="text-gray-700">Suporte técnico especializado</span>
                </div>
              </div>
              <Button asChild className="mt-8 bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold">
                <a href="/sobre">
                  Saiba Mais
                </a>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-gold mb-2">100+</div>
                <div className="text-gray-600">Empresas Atendidas</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-gold mb-2">5+</div>
                <div className="text-gray-600">Anos de Experiência</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-gold mb-2">24/7</div>
                <div className="text-gray-600">Suporte Disponível</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-brand-gold mb-2">15+</div>
                <div className="text-gray-600">Segmentos Atendidos</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-brand-black to-brand-black-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
            Pronto para <span className="text-brand-gold">Automatizar</span> seu Negócio?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Entre em contato conosco e descubra como a MK Tecnologia pode transformar 
            sua empresa com soluções personalizadas e suporte especializado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold">
              <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer">
                💬 Falar no WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-black">
              <a href="/contato">
                📧 Solicitar Orçamento
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
