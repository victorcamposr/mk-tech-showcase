import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColoredServiceIcon from "@/components/ColoredServiceIcon";
import CountUpNumber from "@/components/CountUpNumber";
import SimpleIcon from "@/components/SimpleIcon";
import TypewriterText from "@/components/TypewriterText";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import LazyImage from "@/components/LazyImage";
import CriticalImage from "@/components/CriticalImage";
import { ScrollReveal } from "@/components/ScrollReveal";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Index = () => {
  const services = [
    {
      iconType: "automation" as const,
      title: "Automação Comercial",
      description: "Sistemas completos para gestão do seu negócio"
    },
    {
      iconType: "inventory" as const,
      title: "Controle de Estoque",
      description: "Gestão inteligente com alertas automáticos"
    },
    {
      iconType: "fiscal" as const,
      title: "Emissão Fiscal",
      description: "NFe, NFCe e cupons fiscais automatizados"
    },
    {
      iconType: "financial" as const,
      title: "Gestão Financeira",
      description: "Controle completo do fluxo de caixa"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Automação Comercial em Pontes e Lacerda"
        description="Especialistas em automação comercial, sistemas PDV, controle de estoque e emissão fiscal em Pontes e Lacerda, MT. Soluções tecnológicas completas para empresas de todos os segmentos com suporte 24/7."
        keywords="automação comercial, sistema PDV, controle estoque, emissão fiscal, NFe, NFCe, Pontes e Lacerda, Mato Grosso, tecnologia empresarial, gestão comercial, software empresarial"
      />
      <StructuredData type="localBusiness" />
      <StructuredData type="organization" />
      <Header />
      
      {/* Hero Section */}
      <ScrollReveal animation="fade-in">
        <section className="bg-gradient-to-br from-brand-black to-brand-black-light text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-6">
                  Transforme seu Negócio com 
                  <span className="text-brand-gold block">
                    <TypewriterText 
                      texts={["Automação Comercial"]}
                      speed={120}
                      pauseDuration={3000}
                    />
                  </span>
                </h1>
                <p className="text-xl text-gray-300 mb-8 max-w-lg">
                  Soluções completas em tecnologia para controle de estoque, emissão fiscal 
                  e gestão empresarial. Especialistas em automação comercial em Pontes e Lacerda/MT.
                </p>
                 <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
                    <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                      <SimpleIcon type="whatsapp-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Falar no WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all duration-300">
                    <a href="/servicos">
                      Ver Serviços
                    </a>
                  </Button>
                 </div>
              </div>
              <div className="text-center animate-fade-in">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
                  <CriticalImage 
                    src="/lovable-uploads/894786af-af73-492e-ae6a-d8a39e0ac4cb.png" 
                    alt="MK Tecnologia - Especialistas em Automação Comercial em Pontes e Lacerda, MT"
                    className="w-80 h-auto mx-auto relative z-10 hover:scale-105 transition-transform duration-500"
                    width={320}
                    height={320}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Services Section */}
      <ScrollReveal animation="fade-up" delay={100}>
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
                <Card key={index} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <div className="mb-6">
                      <ColoredServiceIcon type={service.iconType} className="group-hover:animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold text-brand-black mb-4 group-hover:text-brand-gold transition-colors duration-300">{service.title}</h3>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{service.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* About Section */}
      <ScrollReveal animation="fade-up" delay={200}>
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
                <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="text-4xl font-bold text-brand-gold mb-2">
                    <CountUpNumber end={100} suffix="+" className="block" />
                  </div>
                  <div className="text-gray-600 font-medium">Empresas Atendidas</div>
                </div>
                <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="text-4xl font-bold text-brand-gold mb-2">
                    <CountUpNumber end={5} suffix="+" className="block" />
                  </div>
                  <div className="text-gray-600 font-medium">Anos de Experiência</div>
                </div>
                <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="text-4xl font-bold text-brand-gold mb-2">24/7</div>
                  <div className="text-gray-600 font-medium">Suporte Disponível</div>
                </div>
                <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl hover:bg-white/70 transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <div className="text-4xl font-bold text-brand-gold mb-2">
                    <CountUpNumber end={15} suffix="+" className="block" />
                  </div>
                  <div className="text-gray-600 font-medium">Segmentos Atendidos</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* CTA Section */}
      <ScrollReveal animation="fade-up" delay={300}>
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
               <Button asChild size="lg" className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
                 <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                   <SimpleIcon type="whatsapp-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                   Falar no WhatsApp
                 </a>
               </Button>
                <Button asChild size="lg" variant="outline" className="border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-black">
                  <a href="/contato" className="flex items-center gap-2">
                    <SimpleIcon type="email-black" className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    Solicitar Orçamento
                  </a>
                </Button>
             </div>
          </div>
        </section>
      </ScrollReveal>

      <Footer />
    </div>
  );
};

export default Index;