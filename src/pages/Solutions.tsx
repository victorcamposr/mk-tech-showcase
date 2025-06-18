import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColoredServiceIcon, { getServiceColors } from "@/components/ColoredServiceIcon";
import SimpleIcon from "@/components/SimpleIcon";
import CheckBullet from "@/components/CheckBullet";
import TitleWithIcon from "@/components/TitleWithIcon";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
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
      iconType: "automation" as const
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
      iconType: "inventory" as const
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
      iconType: "fiscal" as const
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
      iconType: "financial" as const
    }
  ];

  const benefits = [
    { title: "Aumento da Eficiência", description: "Automatize processos manuais e reduza o tempo gasto em tarefas repetitivas.", iconType: "efficiency" as const },
    { title: "Controle Total", description: "Tenha visibilidade completa de todos os aspectos do seu negócio em tempo real.", iconType: "control" as const },
    { title: "Redução de Custos", description: "Elimine erros, evite perdas e otimize recursos com nossas soluções inteligentes.", iconType: "cost-reduction" as const },
    { title: "Crescimento Sustentável", description: "Sistemas escaláveis que crescem junto com seu negócio.", iconType: "growth" as const }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Soluções em Automação Comercial"
        description="Conheça nossas soluções completas: PDV, gestão de estoque inteligente, emissão fiscal e gestão financeira. Tecnologia de ponta para todos os segmentos empresariais em Pontes e Lacerda, MT."
        keywords="soluções automação comercial, PDV completo, gestão estoque inteligente, emissão fiscal, gestão financeira, tecnologia empresarial, Pontes e Lacerda"
      />
      <StructuredData 
        type="breadcrumb" 
        data={{
          items: [
            { name: "Início", url: "/" },
            { name: "Soluções", url: "/solucoes" }
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
              Nossas <span className="text-brand-gold">Soluções</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tecnologia de ponta para transformar e automatizar seu negócio
            </p>
          </div>
        </ScrollReveal>

          {/* Benefícios */}
          <ScrollReveal animation="fade-up" delay={100}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            {benefits.map((benefit, index) => {
              const colors = getServiceColors(benefit.iconType);
              return (
              <Card key={index} className={`${colors.border} hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm text-center`}>
                <CardContent className="p-8">
                  <div className="flex justify-center mb-4">
                    <ColoredServiceIcon type={benefit.iconType} className="group-hover:animate-pulse" />
                  </div>
                  <h3 className={`text-lg font-semibold text-brand-black mb-2 ${colors.hoverText} transition-colors duration-300`}>{benefit.title}</h3>
                  <p className="text-gray-600 text-sm group-hover:text-gray-700 transition-colors duration-300">{benefit.description}</p>
                </CardContent>
              </Card>
              );
            })}
            </div>
          </ScrollReveal>

          {/* Dashboard Interativo */}
          <ScrollReveal animation="fade-up" delay={150}>
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-brand-black mb-4">
                  Tecnologia Preditiva em Ação
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Veja como nossa IA analisa dados em tempo real para impulsionar seu negócio
                </p>
              </div>
              <InteractiveDashboard />
            </div>
          </ScrollReveal>

          {/* Soluções */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mb-16">
            <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
              Soluções Completas por Segmento
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {solutions.map((solution, index) => {
                const getCardImage = (title: string) => {
                  switch(title) {
                    case "PDV Completo":
                      return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop";
                    case "Gestão de Estoque Inteligente":
                      return "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=200&fit=crop";
                    case "Emissão Fiscal Completa":
                      return "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=200&fit=crop";
                    case "Gestão Financeira":
                      return "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop";
                    default:
                      return null;
                  }
                };
                
                return (
                <Card key={index} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden">
                  {getCardImage(solution.title) && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={getCardImage(solution.title)!} 
                        alt={solution.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="text-brand-black mb-4">
                      <TitleWithIcon>{solution.title}</TitleWithIcon>
                    </CardTitle>
                    <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{solution.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <h4 className="font-semibold text-brand-black mb-2">Principais Recursos:</h4>
                      <ul className="space-y-1">
                        {solution.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                            <CheckBullet />
                            <span className="group-hover:text-gray-700 transition-colors duration-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-2">
                        {solution.industries.map((industry, industryIndex) => (
                          <span key={industryIndex} className="bg-brand-gold/10 text-brand-black text-xs px-2 py-1 rounded">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
                })}
            </div>
            </div>
          </ScrollReveal>

          {/* CTA */}
          <ScrollReveal animation="fade-up" delay={300}>
            <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-2xl p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pronto para Automatizar seu Negócio?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Entre em contato conosco e descubra qual solução é perfeita para sua empresa.
            </p>
            <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
              <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <SimpleIcon type="whatsapp-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Falar no WhatsApp
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

export default Solutions;