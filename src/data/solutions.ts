import { CreditCard, Coffee, QrCode, Truck, Link2, BarChart3, Bot, Receipt, Monitor, TrendingUp, Banknote, Building2, Tablet, Calculator, Fuel } from "lucide-react";

// URLs das imagens - altere aqui para trocar as imagens das soluções
export const SOLUTION_IMAGES = {
  // Imagem principal para páginas específicas das soluções
  hero: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
  
  // Imagens dos cards das soluções na página principal
  cards: {
    'pdv-frente-caixa': '/lovable-uploads/onpdv.png',
    'mesas-comandas': '/lovable-uploads/gestaomesa.png',
    'cardapio-digital': '/lovable-uploads/cardapio.png',
    'maquininhas-cartao': '/lovable-uploads/maquina.png',
    'controle-motoboys': '/lovable-uploads/gestaomotoboy.jpg',
    'integracoes': '/lovable-uploads/integracoes.jpeg',
    'gestao-analise': '/lovable-uploads/gestaoanalikse.jpeg',
    'robo-whatsapp': '/lovable-uploads/whatsapp.jpg',
    'nota-fiscal': '/lovable-uploads/nfe.png',
    'auto-atendimento': '/lovable-uploads/qualseupedido.jpg',
    'marketing-vendas': '/lovable-uploads/marketing.jpeg',
    'pagamento-tef': '/lovable-uploads/tef.jpeg',
    'franquias-filiais': '/lovable-uploads/franquias.jpeg',
    'autoatendimento-tablet': '/lovable-uploads/tabletmesa.png',
    'sistema-revendas-gas-agua': '/lovable-uploads/maia.jpg',
  }
};

// Dados específicos para cada solução
export const specificSolutions = {
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
    industries: ["Delivery", "E-commerce", "Restaurantes", "Distribuidoras"]
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
  },
  "sistema-revendas-gas-agua": {
    title: "Sistema para Revendas de Gás e Água",
    icon: Fuel,
    description: "Gestão eficiente para você e sua revenda. Sistema online, com suas informações seguras e disponíveis a qualquer momento e em qualquer lugar.",
    features: [
      "Sistema online com informações seguras disponíveis 24/7",
      "Controle de estoque em tempo real pelo celular",
      "Aplicativo exclusivo para entregadores",
      "Dashboard de gestão completo",
      "Aplicativo próprio com sua marca, cor e logo",
      "Localização do entregador mais próximo",
      "Fechamento de caixa diário simplificado",
      "Gestão financeira completa (contas a pagar/receber, DRE)",
      "Mapa de calor das vendas",
      "Rastreamento em tempo real dos entregadores",
      "Aplicativo para emissão de notas na rua",
      "Controle exclusivo da portaria",
      "Mais de 50 relatórios disponíveis",
      "Disque gás e água com teleatendimento Bina",
      "Relatórios de preço médio e previsão de compra",
      "Emissão de NFe, NFCe, CTE e boletos bancários"
    ],
    benefits: [
      "Aumento significativo da produtividade operacional",
      "Controle total em tempo real de toda operação",
      "Redução de tempo de entrega com otimização de rotas",
      "Gestão financeira automatizada e precisa"
    ],
    industries: ["Revendas de Gás", "Distribuidoras de Água", "Delivery de Bebidas", "Logística"]
  }
};

// Benefícios para a página geral
export const benefits = [
  { title: "Aumento da Eficiência", description: "Automatize processos manuais e reduza o tempo gasto em tarefas repetitivas.", iconType: "efficiency" as const },
  { title: "Controle Total", description: "Tenha visibilidade completa de todos os aspectos do seu negócio em tempo real.", iconType: "control" as const },
  { title: "Redução de Custos", description: "Elimine erros, evite perdas e otimize recursos com nossas soluções inteligentes.", iconType: "cost-reduction" as const },
  { title: "Crescimento Sustentável", description: "Sistemas escaláveis que crescem junto com seu negócio.", iconType: "growth" as const }
];
