import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColoredServiceIcon, { getServiceColors } from "@/components/ColoredServiceIcon";
import SimpleIcon from "@/components/SimpleIcon";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      title: "Automação Comercial Completa",
      description: "Sistema integrado para gestão completa do seu negócio, desde vendas até relatórios gerenciais.",
      features: ["Interface intuitiva", "Integração completa", "Relatórios em tempo real", "Backup automático"],
      iconType: "automation" as const
    },
    {
      title: "Controle de Estoque",
      description: "Gestão inteligente de estoque com controle de entrada, saída e níveis mínimos.",
      features: ["Alertas de estoque baixo", "Controle de validade", "Gestão de fornecedores", "Inventário automático"],
      iconType: "inventory" as const
    },
    {
      title: "Emissão de Cupom Fiscal",
      description: "Sistema completo para emissão de cupons fiscais conforme legislação vigente.",
      features: ["Certificado digital", "Contingência offline", "Validação automática", "Histórico completo"],
      iconType: "cupom-fiscal" as const
    },
    {
      title: "Nota Fiscal Eletrônica",
      description: "Emissão de NFe e NFCe com total conformidade fiscal e integração com SEFAZ.",
      features: ["NFe e NFCe", "Integração SEFAZ", "Envio automático", "Controle de status"],
      iconType: "nfe" as const
    },
    {
      title: "Gestão Financeira",
      description: "Controle completo das finanças com fluxo de caixa, contas a pagar e receber.",
      features: ["Fluxo de caixa", "Controle de vencimentos", "Relatórios financeiros", "Conciliação bancária"],
      iconType: "financial" as const
    },
    {
      title: "Suporte Técnico",
      description: "Suporte especializado para garantir o funcionamento perfeito de todos os sistemas.",
      features: ["Suporte remoto", "Atualizações automáticas", "Treinamento", "Consultoria técnica"],
      iconType: "headset" as const
    }
  ];


  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Serviços de Automação Comercial"
        description="Descubra nossos serviços completos de automação comercial: PDV, controle de estoque, emissão fiscal, gestão financeira e suporte técnico especializado em Pontes e Lacerda, MT."
        keywords="serviços automação comercial, PDV, controle estoque, emissão fiscal, NFe, NFCe, gestão financeira, suporte técnico, Pontes e Lacerda"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Serviços", url: "/servicos" }
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
              Nossos <span className="text-brand-gold">Serviços</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas em automação comercial para impulsionar seu negócio
            </p>
          </div>
        </ScrollReveal>

          {/* Services Grid */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => {
              const colors = getServiceColors(service.iconType);
              return (
                <Card key={index} className={`${colors.border} hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm`}>
                 <CardHeader className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <ColoredServiceIcon type={service.iconType} className="group-hover:animate-pulse" />
                    </div>
                   <CardTitle className={`text-lg text-brand-black ${colors.hoverText} transition-colors duration-300`}>{service.title}</CardTitle>
                 </CardHeader>
                 <CardContent className="p-6 pt-0">
                  <p className="text-gray-600 mb-4 group-hover:text-gray-700 transition-colors duration-300">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 ${colors.bullet} rounded-full mr-3 group-hover:scale-125 transition-transform`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              );
            })}
            </div>
          </ScrollReveal>


          {/* CTA */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-2xl p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-4">
              Precisa de uma Solução Personalizada?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e vamos desenvolver a solução perfeita para seu negócio.
            </p>
            <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
              <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <SimpleIcon type="document-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Solicitar Orçamento
              </a>
            </Button>
            </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;