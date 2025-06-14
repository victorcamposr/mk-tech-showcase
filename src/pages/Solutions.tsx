import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Solutions = () => {
  const solutions = [
    {
      title: "PDV Completo",
      description: "Sistema de ponto de venda robusto e intuitivo para qualquer tipo de negócio.",
      features: [
        "Interface touch screen otimizada",
        "Vendas rápidas com código de barras",
        "Múltiplas formas de pagamento",
        "Controle de vendedores e comissões",
        "Relatórios de vendas em tempo real",
        "Integração com balanças e gavetas"
      ],
      industries: ["Varejo", "Supermercados", "Farmácias", "Lojas"],
      icon: "💻"
    },
    {
      title: "Gestão de Estoque Inteligente",
      description: "Controle total do seu estoque com tecnologia avançada e alertas automáticos.",
      features: [
        "Controle de entrada e saída automático",
        "Alertas de estoque mínimo e máximo",
        "Gestão de validade e lotes",
        "Inventário com código de barras",
        "Relatórios de giro de estoque",
        "Integração com fornecedores"
      ],
      industries: ["Todos os segmentos"],
      icon: "📊"
    },
    {
      title: "Emissão Fiscal Completa",
      description: "Solução completa para emissão de documentos fiscais com total conformidade.",
      features: [
        "NFe, NFCe e Cupom Fiscal",
        "Certificado digital integrado",
        "Contingência offline automática",
        "Envio automático por email",
        "Controle de status SEFAZ",
        "Backup automático de XMLs"
      ],
      industries: ["Comércio", "Indústria", "Serviços"],
      icon: "📄"
    },
    {
      title: "Gestão Financeira",
      description: "Controle completo das finanças com fluxo de caixa e análises detalhadas.",
      features: [
        "Fluxo de caixa em tempo real",
        "Contas a pagar e receber",
        "Controle de vencimentos",
        "Conciliação bancária",
        "Relatórios gerenciais",
        "Análise de rentabilidade"
      ],
      industries: ["Empresas de todos os portes"],
      icon: "💰"
    },
    {
      title: "Automação para Farmácias",
      description: "Sistema especializado para farmácias com controles específicos do setor.",
      features: [
        "Controle de medicamentos controlados",
        "Gestão de validade e lotes",
        "Integração com PBM e convênios",
        "Controle de prescrições",
        "Relatórios ANVISA",
        "Sistema de fidelidade"
      ],
      industries: ["Farmácias", "Drogarias"],
      icon: "💊"
    },
    {
      title: "Soluções para Restaurantes",
      description: "Sistema completo para gestão de restaurantes e estabelecimentos alimentícios.",
      features: [
        "Comanda eletrônica",
        "Controle de mesas",
        "Gestão de cardápio digital",
        "Integração com delivery",
        "Controle de ingredientes",
        "Análise de pratos mais vendidos"
      ],
      industries: ["Restaurantes", "Lanchonetes", "Pizzarias"],
      icon: "🍽️"
    }
  ];

  const benefits = [
    {
      title: "Aumento da Eficiência",
      description: "Automatize processos manuais e reduza o tempo gasto em tarefas repetitivas.",
      icon: "⚡"
    },
    {
      title: "Controle Total",
      description: "Tenha visibilidade completa de todos os aspectos do seu negócio em tempo real.",
      icon: "🎯"
    },
    {
      title: "Redução de Custos",
      description: "Elimine erros, evite perdas e otimize recursos com nossas soluções inteligentes.",
      icon: "💵"
    },
    {
      title: "Crescimento Sustentável",
      description: "Sistemas escaláveis que crescem junto com seu negócio.",
      icon: "📈"
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
              Nossas <span className="text-brand-gold">Soluções</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia de ponta para transformar e automatizar seu negócio
            </p>
          </div>

          {/* Benefícios */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{benefit.icon}</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Soluções */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              Soluções Completas por Segmento
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {solutions.map((solution, index) => (
                <Card key={index} className="border-brand-gold/20 hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-brand-gold rounded-full flex items-center justify-center mr-4">
                        <span className="text-2xl">{solution.icon}</span>
                      </div>
                      <CardTitle className="text-brand-black">{solution.title}</CardTitle>
                    </div>
                    <p className="text-gray-600">{solution.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold text-brand-black mb-2">Principais Recursos:</h4>
                      <ul className="space-y-1">
                        {solution.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-brand-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-2">
                        {solution.industries.map((industry, industryIndex) => (
                          <span 
                            key={industryIndex}
                            className="bg-brand-gold/10 text-brand-black text-xs px-2 py-1 rounded"
                          >
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Processo de Implementação */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              Como Implementamos Suas Soluções
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">1</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Diagnóstico</h3>
                <p className="text-gray-600 text-sm">
                  Análise completa dos processos atuais e necessidades específicas.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">2</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Proposta</h3>
                <p className="text-gray-600 text-sm">
                  Desenvolvimento de proposta técnica personalizada.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">3</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Instalação</h3>
                <p className="text-gray-600 text-sm">
                  Implementação e configuração de todo o sistema.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">4</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Treinamento</h3>
                <p className="text-gray-600 text-sm">
                  Capacitação completa da equipe para uso do sistema.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-brand-black">5</span>
                </div>
                <h3 className="text-lg font-semibold text-brand-black mb-2">Go Live</h3>
                <p className="text-gray-600 text-sm">
                  Acompanhamento na entrada em produção e suporte contínuo.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-lg p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para Automatizar seu Negócio?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e descubra qual solução é perfeita para sua empresa. 
              Oferecemos consultoria gratuita e demonstração sem compromisso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold">
                <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer">
                  💬 Falar no WhatsApp
                </a>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-brand-black">
                <a href="/contato">
                  📧 Solicitar Proposta
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Solutions;