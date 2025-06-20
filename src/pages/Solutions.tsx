import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ColoredServiceIcon, { getServiceColors } from "@/components/ColoredServiceIcon";
import SimpleIcon from "@/components/SimpleIcon";
import CheckBullet from "@/components/CheckBullet";
import InteractiveDashboard from "@/components/InteractiveDashboard";
import SEO from "@/components/SEO";
import StructuredData from "@/components/StructuredData";
import { ScrollReveal } from "@/components/ScrollReveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Coffee, QrCode, Truck, Link2, BarChart3, Bot, Receipt, Monitor, TrendingUp, Banknote, Building2, Tablet } from "lucide-react";

const Solutions = () => {
  const location = useLocation();
  
  // Dados específicos para cada solução
  const specificSolutions = {
    "pdv-frente-caixa": {
      title: "PDV/Frente de Caixa Premium",
      icon: CreditCard,
      description: "Sistema completo de ponto de venda com tecnologia de ponta para otimizar suas vendas e controle de caixa.",
      features: [
        "Interface touchscreen otimizada",
        "Vendas rápidas com código de barras",
        "Múltiplas formas de pagamento (PIX, cartão, dinheiro)",
        "Controle de vendedores e comissões",
        "Relatórios de vendas em tempo real",
        "Integração com balanças e gavetas",
        "Backup automático na nuvem",
        "Suporte a múltiplas lojas"
      ],
      benefits: ["Aumento de 40% na velocidade de atendimento", "Redução de erros em 95%", "Controle total de vendas"],
      industries: ["Varejo", "Supermercados", "Farmácias", "Lojas de conveniência"]
    },
    "mesas-comandas": {
      title: "Mesas/Comandas - Garçons",
      icon: Coffee,
      description: "Sistema completo para restaurantes, bares e lanchonetes com controle de mesas e comandas.",
      features: [
        "Controle de mesas em tempo real",
        "Comandas digitais integradas",
        "App para garçons com pedidos",
        "Gestão de cardápio dinâmico",
        "Divisão de contas automática",
        "Controle de ocupação de mesas",
        "Integração com delivery",
        "Relatórios de performance"
      ],
      benefits: ["Redução de 60% no tempo de pedidos", "Aumento de 30% no faturamento", "Melhor experiência do cliente"],
      industries: ["Restaurantes", "Bares", "Lanchonetes", "Pizzarias"]
    },
    "cardapio-digital": {
      title: "Cardápio Digital",
      icon: QrCode,
      description: "Cardápio digital interativo com QR Code para melhorar a experiência do cliente.",
      features: [
        "QR Code personalizado por mesa",
        "Cardápio responsivo e interativo",
        "Fotos em alta qualidade dos pratos",
        "Descrições detalhadas e ingredientes",
        "Preços atualizados em tempo real",
        "Promoções e ofertas especiais",
        "Múltiplos idiomas",
        "Analytics de preferências"
      ],
      benefits: ["Economia de 80% em impressões", "Atualização instantânea", "Experiência moderna"],
      industries: ["Restaurantes", "Bares", "Cafeterias", "Food trucks"]
    },
    "maquininhas-cartao": {
      title: "Maquininhas de Cartão",
      icon: CreditCard,
      description: "Soluções completas de pagamento com as melhores taxas do mercado.",
      features: [
        "Taxas competitivas do mercado",
        "Recebimento em 1 dia útil",
        "Máquinas modernas e seguras",
        "Aceita todos os cartões",
        "PIX integrado",
        "Vendas por aproximação (NFC)",
        "App para acompanhamento",
        "Suporte técnico 24h"
      ],
      benefits: ["Menores taxas do mercado", "Recebimento rápido", "Tecnologia de ponta"],
      industries: ["Todos os segmentos", "Comércio em geral"]
    },
    "controle-motoboys": {
      title: "Controle e Aplicativo para Motoboys",
      icon: Truck,
      description: "Sistema completo de gestão e controle de entregadores com aplicativo dedicado para otimizar suas entregas.",
      features: [
        "Rastreamento em tempo real dos entregadores",
        "Gestão de rotas otimizadas automaticamente",
        "App exclusivo para motoboys",
        "Controle de entregas e status",
        "Relatórios de performance detalhados",
        "Notificações push em tempo real",
        "Histórico completo de entregas",
        "Integração com sistemas de delivery"
      ],
      benefits: ["Redução de 40% no tempo de entrega", "Maior controle operacional", "Aumento da satisfação do cliente"],
      industries: ["Delivery", "E-commerce", "Restaurantes", "Farmácias"]
    },
    "integracoes": {
      title: "Integrações",
      icon: Link2,
      description: "Conecte todos os seus sistemas com nossas soluções de integração avançada e APIs robustas.",
      features: [
        "APIs REST modernas e seguras",
        "Integração com ERPs populares",
        "Sincronização automática de dados",
        "Conectividade total entre sistemas",
        "Webhooks para atualizações em tempo real",
        "Documentação completa para desenvolvedores",
        "Suporte técnico especializado",
        "Monitoramento de integrações 24/7"
      ],
      benefits: ["Dados unificados em tempo real", "Processos 100% automatizados", "Máxima eficiência operacional"],
      industries: ["Todos os segmentos", "E-commerce", "Varejo", "Indústria"]
    },
    "gestao-analise": {
      title: "Gestão e Análise para Food Service",
      icon: BarChart3,
      description: "Análises avançadas e gestão inteligente especialmente desenvolvida para o setor alimentício.",
      features: [
        "Dashboard analítico completo",
        "Relatórios de vendas em tempo real",
        "Controle de custos e margem",
        "Previsão de demanda inteligente",
        "Análise de cardápio e rentabilidade",
        "Controle de desperdício",
        "Métricas de performance",
        "Alertas automáticos personalizados"
      ],
      benefits: ["Decisões baseadas em dados precisos", "Redução de 30% no desperdício", "Aumento de 25% no lucro"],
      industries: ["Restaurantes", "Food Service", "Bares", "Lanchonetes"]
    },
    "robo-whatsapp": {
      title: "Robô de WhatsApp",
      icon: Bot,
      description: "Automatize o atendimento ao cliente com nosso robô inteligente para WhatsApp Business.",
      features: [
        "Atendimento automatizado 24 horas",
        "Respostas personalizadas inteligentes",
        "Integração direta com vendas",
        "Analytics detalhado de conversas",
        "Catálogo de produtos integrado",
        "Agendamento automático",
        "Transferência para atendente humano",
        "Campanhas de marketing automatizadas"
      ],
      benefits: ["Atendimento constante 24/7", "Aumento de 50% na conversão", "Redução de 70% nos custos"],
      industries: ["Todos os segmentos", "E-commerce", "Serviços", "Varejo"]
    },
    "nota-fiscal": {
      title: "Nota Fiscal e Cupom Fiscal",
      icon: Receipt,
      description: "Emissão automática de documentos fiscais com total conformidade legal e integração completa.",
      features: [
        "NFe, NFCe e SAT automáticos",
        "Cupom fiscal eletrônico",
        "Certificado digital integrado",
        "Backup automático seguro",
        "Contingência offline",
        "Envio automático por email",
        "Controle de status SEFAZ",
        "Relatórios fiscais completos"
      ],
      benefits: ["100% de conformidade fiscal", "Processo totalmente automatizado", "Máxima segurança de dados"],
      industries: ["Comércio", "Serviços", "Indústria", "Todos os segmentos"]
    },
    "auto-atendimento": {
      title: "Auto Atendimento",
      icon: Monitor,
      description: "Soluções completas de autoatendimento para otimizar o fluxo de clientes e reduzir filas.",
      features: [
        "Interface touchscreen intuitiva",
        "Suporte a múltiplos idiomas",
        "Integração com sistemas de pagamento",
        "Catálogo de produtos interativo",
        "Suporte remoto em tempo real",
        "Personalização total da interface",
        "Relatórios de uso detalhados",
        "Atualizações automáticas"
      ],
      benefits: ["Redução de 80% nas filas", "Experiência moderna e eficiente", "Economia de 60% em pessoal"],
      industries: ["Varejo", "Restaurantes", "Serviços", "Fast food"]
    },
    "marketing-vendas": {
      title: "Marketing e Aumento de Vendas",
      icon: TrendingUp,
      description: "Estratégias digitais avançadas e ferramentas inteligentes para alavancar suas vendas.",
      features: [
        "Campanhas automatizadas personalizadas",
        "CRM integrado completo",
        "Analytics avançado de vendas",
        "Promoções inteligentes automáticas",
        "Email marketing profissional",
        "Programa de fidelidade digital",
        "Segmentação avançada de clientes",
        "ROI detalhado de campanhas"
      ],
      benefits: ["Aumento médio de 45% nas vendas", "Fidelização de 70% dos clientes", "ROI 300% mensurável"],
      industries: ["Todos os segmentos", "E-commerce", "Varejo", "Serviços"]
    },
    "pagamento-tef": {
      title: "Soluções em Pagamento - TEF",
      icon: Banknote,
      description: "Transferência eletrônica de fundos totalmente integrada ao seu sistema de vendas.",
      features: [
        "TEF integrado ao sistema",
        "Suporte a múltiplas bandeiras",
        "Transações 100% seguras",
        "Relatórios financeiros detalhados",
        "Conciliação automática",
        "PIX empresarial integrado",
        "Parcelamento inteligente",
        "Monitoramento em tempo real"
      ],
      benefits: ["Máxima praticidade no pagamento", "Segurança bancária garantida", "Gestão financeira centralizada"],
      industries: ["Varejo", "Serviços", "Comércio", "Restaurantes"]
    },
    "franquias-filiais": {
      title: "Franquias e Filiais",
      icon: Building2,
      description: "Gestão centralizada e inteligente para redes de franquias e múltiplas filiais.",
      features: [
        "Gestão centralizada total",
        "Relatórios unificados em tempo real",
        "Controle de estoque integrado",
        "Padronização de todos os processos",
        "Monitoramento de performance por unidade",
        "Comunicação interna integrada",
        "Compliance automático",
        "Dashboard executivo completo"
      ],
      benefits: ["Controle total da rede", "Padronização operacional 100%", "Crescimento escalável garantido"],
      industries: ["Franquias", "Redes de varejo", "Múltiplas filiais", "Grandes empresas"]
    },
    "autoatendimento-tablet": {
      title: "Autoatendimento Tablet Mesa",
      icon: Tablet,
      description: "Tablets interativos nas mesas para pedidos diretos e experiência única do cliente.",
      features: [
        "Tablets fixos em cada mesa",
        "Pedidos diretos sem garçom",
        "Cardápio interativo com fotos",
        "Pagamento integrado na mesa",
        "Customização de pedidos",
        "Chamada de garçom integrada",
        "Jogos e entretenimento",
        "Feedback direto do cliente"
      ],
      benefits: ["Experiência única e moderna", "Agilidade de 70% no atendimento", "Redução de 50% nos custos operacionais"],
      industries: ["Restaurantes", "Cafeterias", "Fast food", "Bares"]
    }
  };

  // Detectar qual solução específica está sendo visualizada
  const currentPath = location.pathname;
  const isSpecificSolution = currentPath.includes('/solucoes/');
  const solutionKey = currentPath.split('/solucoes/')[1] as keyof typeof specificSolutions;
  const currentSolution = specificSolutions[solutionKey];

  // Se for uma solução específica, renderizar conteúdo personalizado
  if (isSpecificSolution && currentSolution) {
    const IconComponent = currentSolution.icon;
    
    return (
      <div className="min-h-screen bg-background">
        <SEO 
          title={currentSolution.title}
          description={currentSolution.description}
          keywords={`${currentSolution.title}, automação comercial, Pontes e Lacerda`}
        />
        <Header />
        
        <main className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Hero Section */}
            <ScrollReveal animation="fade-in">
              <div className="text-center mb-16">
                <div className="flex justify-center mb-6">
                  <div className="bg-gradient-to-r from-brand-gold to-brand-gold-light p-4 rounded-full">
                    <IconComponent className="w-12 h-12 text-brand-black" />
                  </div>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-brand-black mb-6">
                  {currentSolution.title}
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                  {currentSolution.description}
                </p>
                
                {/* Imagem demonstrativa */}
                <div className="max-w-4xl mx-auto mb-8">
                  <img 
                    src="https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop" 
                    alt={`Demonstração ${currentSolution.title}`}
                    className="w-full h-64 md:h-80 object-cover rounded-xl shadow-2xl"
                  />
                </div>
              </div>
            </ScrollReveal>

            {/* Recursos */}
            <ScrollReveal animation="fade-up" delay={100}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <Card className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-brand-black flex items-center gap-2 group-hover:text-brand-gold transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
                      Principais Recursos
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentSolution.features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <CheckBullet />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-brand-black group-hover:text-brand-gold transition-colors duration-300">Benefícios Garantidos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentSolution.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                          <CheckBullet />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <h4 className="font-semibold text-brand-black mb-2 group-hover:text-brand-gold transition-colors duration-300">Ideal para:</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentSolution.industries.map((industry, index) => (
                          <span key={index} className="bg-brand-gold/10 text-brand-black text-sm px-3 py-1 rounded-full group-hover:bg-brand-gold/20 transition-colors duration-300">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollReveal>

            {/* CTA */}
            <ScrollReveal animation="fade-up" delay={200}>
              <div className="text-center bg-gradient-to-r from-brand-black to-brand-black-light rounded-2xl p-12">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Interessado em {currentSolution.title}?
                </h2>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                  Entre em contato conosco e receba uma demonstração gratuita personalizada para seu negócio.
                </p>
                <Button asChild className="bg-brand-gold hover:bg-brand-gold-dark text-brand-black font-semibold group">
                  <a href="https://wa.me/5565993535079" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <SimpleIcon type="whatsapp-black" className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Solicitar Demonstração
                  </a>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  // Benefícios para a página geral

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

          {/* Soluções do Dropdown */}
          <ScrollReveal animation="fade-up" delay={200}>
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-brand-black text-center mb-12">
                Todas as Nossas <span className="text-brand-gold">Soluções</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Object.entries(specificSolutions).map(([key, solution], index) => {
                  const IconComponent = solution.icon;
                  const colors = getServiceColors('automation');
                  
                  // Função para mapear imagens demonstrativas para cada solução
                  const getCardImage = (solutionKey: string) => {
                    const imageMap: { [key: string]: string } = {
                      'pdv-frente-caixa': 'photo-1461749280684-dccba630e2f6', // monitor showing programming
                      'mesas-comandas': 'photo-1605810230434-7631ac76ec81', // group with video screens
                      'cardapio-digital': 'photo-1486312338219-ce68d2c6f44d', // person using MacBook Pro
                      'maquininhas-cartao': 'photo-1488590528505-98d2b5aba04b', // turned on laptop
                      'controle-motoboys': 'photo-1531297484001-80022131f5a1', // laptop on surface
                      'integracoes': 'photo-1487058792275-0ad4aaf24ca7', // colorful code on monitor
                      'gestao-analise': 'photo-1605810230434-7631ac76ec81', // group with displays
                      'robo-whatsapp': 'photo-1486312338219-ce68d2c6f44d', // person using MacBook
                      'nota-fiscal': 'photo-1461749280684-dccba630e2f6', // monitor programming
                      'auto-atendimento': 'photo-1488590528505-98d2b5aba04b', // laptop computer
                      'marketing-vendas': 'photo-1487058792275-0ad4aaf24ca7', // colorful code
                      'pagamento-tef': 'photo-1531297484001-80022131f5a1', // laptop surface
                      'franquias-filiais': 'photo-1605810230434-7631ac76ec81', // group displays
                      'autoatendimento-tablet': 'photo-1486312338219-ce68d2c6f44d', // MacBook Pro
                    };
                    return `https://images.unsplash.com/${imageMap[solutionKey] || 'photo-1461749280684-dccba630e2f6'}?w=400&h=200&fit=crop`;
                  };
                  
                  return (
                    <Card key={key} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden cursor-pointer">
                      <a href={`/solucoes/${key}`} className="block">
                        {/* Imagem demonstrativa */}
                        <div className="h-48 overflow-hidden relative">
                          <img 
                            src={getCardImage(key)} 
                            alt={`Demonstração ${solution.title}`}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-gold to-brand-gold-light p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                            <IconComponent className="w-5 h-5 text-brand-black" />
                          </div>
                        </div>
                        
                        <CardHeader className="pb-4">
                          <div className="mb-3">
                            <CardTitle className="text-lg font-bold text-brand-black group-hover:text-brand-gold transition-colors duration-300">
                              {solution.title}
                            </CardTitle>
                          </div>
                          <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300 text-sm"
                             style={{
                               display: '-webkit-box',
                               WebkitLineClamp: 3,
                               WebkitBoxOrient: 'vertical',
                               overflow: 'hidden'
                             }}>
                            {solution.description}
                          </p>
                        </CardHeader>
                        <CardContent>
                          <div className="mb-4">
                            <h4 className="font-semibold text-brand-black mb-2 text-sm">Principais Recursos:</h4>
                            <ul className="space-y-1">
                              {solution.features.slice(0, 4).map((feature, featureIndex) => (
                                <li key={featureIndex} className="flex items-start text-sm text-gray-600">
                                  <CheckBullet />
                                   <span className="group-hover:text-gray-700 transition-colors duration-300"
                                         style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                     {feature}
                                   </span>
                                </li>
                              ))}
                              {solution.features.length > 4 && (
                                <li className="text-xs text-brand-gold font-medium ml-6">
                                  +{solution.features.length - 4} recursos adicionais
                                </li>
                              )}
                            </ul>
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex flex-wrap gap-1">
                              {solution.industries.slice(0, 3).map((industry, industryIndex) => (
                                <span key={industryIndex} className="bg-brand-gold/10 text-brand-black text-xs px-2 py-1 rounded group-hover:bg-brand-gold/20 transition-colors duration-300">
                                  {industry}
                                </span>
                              ))}
                              {solution.industries.length > 3 && (
                                <span className="text-xs text-gray-500 px-2 py-1">
                                  +{solution.industries.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-brand-gold font-medium group-hover:text-brand-gold-dark transition-colors duration-300">
                              Clique para ver detalhes
                            </span>
                            <div className="w-6 h-6 rounded-full bg-brand-gold/10 flex items-center justify-center group-hover:bg-brand-gold group-hover:scale-110 transition-all duration-300">
                              <svg className="w-3 h-3 text-brand-gold group-hover:text-brand-black transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </CardContent>
                      </a>
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