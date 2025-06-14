import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Services = () => {
  const services = [
    {
      title: "Automação Comercial Completa",
      description: "Sistema integrado para gestão completa do seu negócio, desde vendas até relatórios gerenciais.",
      features: ["Interface intuitiva", "Integração completa", "Relatórios em tempo real", "Backup automático"],
      icon: "🖥️"
    },
    {
      title: "Controle de Estoque",
      description: "Gestão inteligente de estoque com controle de entrada, saída e níveis mínimos.",
      features: ["Alertas de estoque baixo", "Controle de validade", "Gestão de fornecedores", "Inventário automático"],
      icon: "📦"
    },
    {
      title: "Emissão de Cupom Fiscal",
      description: "Sistema completo para emissão de cupons fiscais conforme legislação vigente.",
      features: ["Certificado digital", "Contingência offline", "Validação automática", "Histórico completo"],
      icon: "🧾"
    },
    {
      title: "Nota Fiscal Eletrônica",
      description: "Emissão de NFe e NFCe com total conformidade fiscal e integração com SEFAZ.",
      features: ["NFe e NFCe", "Integração SEFAZ", "Envio automático", "Controle de status"],
      icon: "📋"
    },
    {
      title: "Gestão Financeira",
      description: "Controle completo das finanças com fluxo de caixa, contas a pagar e receber.",
      features: ["Fluxo de caixa", "Controle de vencimentos", "Relatórios financeiros", "Conciliação bancária"],
      icon: "💰"
    },
    {
      title: "Suporte Técnico",
      description: "Suporte especializado para garantir o funcionamento perfeito de todos os sistemas.",
      features: ["Suporte remoto", "Atualizações automáticas", "Treinamento", "Consultoria técnica"],
      icon: "🛠️"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
              Nossos <span className="text-brand-gold">Serviços</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Soluções completas em automação comercial para impulsionar seu negócio
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="border-brand-gold/20 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mb-4">
                    <span className="text-3xl">{service.icon}</span>
                  </div>
                  <CardTitle className="text-brand-black">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-brand-gold rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Processo de Trabalho */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              Como Trabalhamos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">1</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Análise</h3>
                <p className="text-gray-600 text-sm">
                  Entendemos suas necessidades e processos atuais para propor a melhor solução.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">2</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Personalização</h3>
                <p className="text-gray-600 text-sm">
                  Adaptamos nossos sistemas às especificidades do seu negócio.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">3</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Implementação</h3>
                <p className="text-gray-600 text-sm">
                  Instalação e configuração completa com treinamento da equipe.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">4</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Suporte</h3>
                <p className="text-gray-600 text-sm">
                  Acompanhamento contínuo e suporte técnico especializado.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-lg p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Precisa de uma Solução Personalizada?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e vamos desenvolver a solução perfeita para seu negócio.
            </p>
            <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold">
              <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer">
                Solicitar Orçamento
              </a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Services;