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
import { CreditCard, Coffee, QrCode, Truck, Link2, BarChart3, Bot, Receipt, Monitor, TrendingUp, Banknote, Building2, Tablet, Award, Calculator } from "lucide-react";

// URLs das imagens - altere aqui para trocar as imagens das soluções
const SOLUTION_IMAGES = {
  // Imagem principal para páginas específicas das soluções
  hero: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
  
  // Imagens dos cards das soluções na página principal
  cards: {
    'pdv-frente-caixa': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
    'mesas-comandas': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=200&fit=crop',
    'cardapio-digital': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop',
    'maquininhas-cartao': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop',
    'controle-motoboys': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop',
    'integracoes': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=200&fit=crop',
    'gestao-analise': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=200&fit=crop',
    'robo-whatsapp': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop',
    'nota-fiscal': 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=200&fit=crop',
    'auto-atendimento': 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=200&fit=crop',
    'marketing-vendas': 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=400&h=200&fit=crop',
    'pagamento-tef': 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=200&fit=crop',
    'franquias-filiais': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=200&fit=crop',
    'autoatendimento-tablet': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=200&fit=crop',
  }
};

const Solutions = () => {
  const location = useLocation();
  
  // Função para gerar mensagem personalizada do WhatsApp
  const getWhatsAppMessage = (solutionTitle: string, solutionKey: string) => {
    const message = `Olá! Tenho interesse em conhecer mais sobre a solução *${solutionTitle}* da MK Tecnologia. Gostaria de receber uma demonstração gratuita personalizada para meu negócio. Aguardo o contato de vocês!`;
    return `https://wa.me/5565993535079?text=${encodeURIComponent(message)}`;
  };

  // Dados específicos para cada solução
  const specificSolutions = {
    "pdv-frente-caixa": {
      title: "Frente de Caixa/PDV Premium",
      icon: Calculator,
      description: "Frente de Caixa web, rápido e prático. Automatize 100% seus pedidos com integração completa.",
      features: [
        "Acesse de qualquer dispositivo: Windows, navegador ou APP Android",
        "Todos pedidos num só lugar",
        "Realize pedidos: Delivery, Balcão, Senha, Agendamentos, Mesas, Comandas",
        "Integrações: Ifood, Aiqfome, Whatsapp",
        "100% integrado ao Whatsapp",
        "Aceite e impressão automática de pedidos",
        "Repetição de pedidos e Histórico de Compras",
        "Roteirização de pedidos e Gestão de Entregas",
        "Integrado com TEF/Pin Pads, Leitor Código Barras, Balanças",
        "Controle de crédito/fiado e histórico de clientes",
        "Fluxo de caixa por usuário",
        "Taxa de serviço, Mesas/Comandas",
        "Organize pedidos por data, tipo ou agendamentos"
      ],
      benefits: ["Automatização 100% dos pedidos", "Funciona em dispositivos antigos sem travamentos", "Gestão completa de entregas"],
      industries: ["Restaurantes", "Delivery", "Varejo", "Todos os segmentos"]
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
      description: "Cardápio digital completo com domínio próprio e recursos avançados de venda online.",
      features: [
        "Domínio Próprio (www.seurestaurante.com.br)",
        "Compra rápida (cliente não precisa se cadastrar)",
        "Pedido liberado somente após pagamento",
        "Pagamentos Pix e Cartões",
        "Programa de Fidelidade",
        "Cupons de Desconto",
        "Integrado com Whatsapp",
        "Facebook Pixel e Google Analytics",
        "Desconto p/ aniversariantes e primeira compra",
        "Personalize botões, textos e cores",
        "Banners para divulgar informações importantes"
      ],
      benefits: ["Vendas online 24h", "Programa de fidelidade integrado", "Analytics completo de vendas"],
      industries: ["Restaurantes", "Bares", "Lanchonetes", "Delivery"]
    },
    "maquininhas-cartao": {
      title: "Maquininhas de Cartão",
      icon: CreditCard,
      description: "Agilize o seu atendimento realizando pedidos, cobrança e emissão de notas fiscais rapidamente.",
      features: [
        "Realize pedidos, cobre e emita notas fiscais rapidamente",
        "Controle de mesas e comandas eletrônicas",
        "Pedidos balcão em segundos",
        "Solução rápida e leve",
        "Integrado com Stone, Cielo e outras bandeiras",
        "PDV completo dentro da máquina",
        "Agilidade no atendimento",
        "Suporte técnico especializado"
      ],
      benefits: ["Atendimento mais rápido", "Tudo integrado em um só equipamento", "Máxima praticidade operacional"],
      industries: ["Restaurantes", "Varejo", "Comércio", "Todos os segmentos"]
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
      title: "Equipamentos e Integrações",
      icon: Link2,
      description: "Diversas integrações que auxiliam seu atendimento e tornam sua rotina mais prática.",
      features: [
        "Marketplaces: Ifood e Aiqfome",
        "Pagamentos: TEF e Pin Pad",
        "Dados e Analytics: Facebook Pixel e Google Analytics",
        "Recursos que aumentam a produtividade",
        "Balanças de peso e Etiquetas de peso",
        "Impressoras térmicas",
        "Leitor de Código de Barras",
        "Equipamentos e periféricos completos"
      ],
      benefits: ["Aumento significativo da produtividade", "Integração total com marketplaces", "Analytics avançado para decisões"],
      industries: ["Restaurantes", "Varejo", "Supermercados", "Todos os segmentos"]
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
      description: "Centralize e padronize toda suas operações num único sistema.",
      features: [
        "Centralize e padronize todas suas operações",
        "Veja o andamento de lojas em segundos",
        "Todas soluções acessadas de qualquer lugar",
        "Portal do franqueador e do franqueado",
        "Veja e compare o faturamento em segundos",
        "Gestão centralizada total",
        "Controle unificado de todas as filiais",
        "Relatórios comparativos instantâneos"
      ],
      benefits: ["Controle total centralizado", "Padronização de processos", "Comparação de performance instantânea"],
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
                
                {/* Imagem demonstrativa - URL direta para facilitar alteração */}
                <div className="max-w-4xl mx-auto mb-8 relative">
                  <img 
                    src={SOLUTION_IMAGES.cards[solutionKey] || SOLUTION_IMAGES.cards['pdv-frente-caixa']} 
                    alt={`Demonstração ${currentSolution.title}`}
                    className="w-full h-64 md:h-80 object-contain bg-gray-50 rounded-xl shadow-2xl"
                  />
                  
                  {/* Ícones flutuantes para maquininhas de cartão na página específica */}
                  {solutionKey === 'maquininhas-cartao' && (
                    <>
                      <div className="absolute bottom-4 left-4 p-1 rounded-lg group/tooltip">
                        <img src="/lovable-uploads/a8ecfad8-8626-44ee-a7eb-afcfd88ca462.png" alt="Stone" className="w-8 h-8 object-contain" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                          Integrado com Stone
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-16 p-1 rounded-lg group/tooltip">
                        <img src="/lovable-uploads/76fb354f-89fa-4163-9772-a8f1fdb94668.png" alt="Cielo" className="w-8 h-8 object-contain" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                          Integrado com Cielo
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-28 p-1 rounded-lg group/tooltip">
                        <img src="/lovable-uploads/2a8e6032-1804-4f62-aa10-ae0ad095cab8.png" alt="PagBank" className="w-8 h-8 object-contain" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                          Integrado com PagBank
                        </div>
                      </div>
                    </>
                  )}
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
                    <CardTitle className="text-brand-black flex items-center gap-2 group-hover:text-brand-gold transition-colors duration-300">
                      <Award className="w-6 h-6 text-brand-gold group-hover:scale-110 transition-transform duration-300" />
                      Benefícios Garantidos
                    </CardTitle>
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
                  <a href={getWhatsAppMessage(currentSolution.title, solutionKey)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
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
                  
                  // Função para buscar imagem do card usando a constante SOLUTION_IMAGES
                  const getCardImage = (solutionKey: string) => {
                    return SOLUTION_IMAGES.cards[solutionKey as keyof typeof SOLUTION_IMAGES.cards] || SOLUTION_IMAGES.cards['pdv-frente-caixa'];
                  };
                  
                  return (
                    <Card key={key} className="border-brand-gold/20 hover:shadow-2xl hover:shadow-brand-gold/10 transition-all duration-500 hover:-translate-y-3 hover:scale-105 group bg-gradient-to-br from-white to-gray-50/50 backdrop-blur-sm overflow-hidden cursor-pointer">
                      <a href={`/solucoes/${key}`} className="block">
                         {/* Imagem demonstrativa */}
                         <div className="h-48 overflow-hidden relative">
                            <img 
                              src={getCardImage(key)} 
                              alt={`Demonstração ${solution.title}`}
                              className="w-full h-full object-contain bg-gray-50 group-hover:scale-110 transition-transform duration-500"
                            />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                           <div className="absolute top-4 right-4 bg-gradient-to-r from-brand-gold to-brand-gold-light p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                             <IconComponent className="w-5 h-5 text-brand-black" />
                           </div>
                           
                            {/* Ícones flutuantes para maquininhas de cartão */}
                            {key === 'maquininhas-cartao' && (
                              <>
                                 <div className="absolute bottom-3 left-3 p-0.5 rounded group/tooltip">
                                   <img src="/lovable-uploads/a8ecfad8-8626-44ee-a7eb-afcfd88ca462.png" alt="Stone" className="w-8 h-8 object-contain" />
                                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                                     Integrado com Stone
                                   </div>
                                 </div>
                                 <div className="absolute bottom-3 left-14 p-0.5 rounded group/tooltip">
                                   <img src="/lovable-uploads/76fb354f-89fa-4163-9772-a8f1fdb94668.png" alt="Cielo" className="w-8 h-8 object-contain" />
                                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                                     Integrado com Cielo
                                   </div>
                                 </div>
                                 <div className="absolute bottom-3 left-24 p-0.5 rounded group/tooltip">
                                   <img src="/lovable-uploads/2a8e6032-1804-4f62-aa10-ae0ad095cab8.png" alt="PagBank" className="w-8 h-8 object-contain" />
                                   <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-1.5 py-0.5 bg-gray-900 text-white text-xs rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap z-10">
                                     Integrado com PagBank
                                   </div>
                                 </div>
                              </>
                            )}
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