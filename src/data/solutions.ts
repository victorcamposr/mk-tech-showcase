import { CreditCard, Coffee, QrCode, Truck, Link2, BarChart3, Bot, Receipt, Monitor, TrendingUp, Banknote, Building2, Tablet, Calculator } from "lucide-react";

// URLs das imagens - altere aqui para trocar as imagens das soluções
export const SOLUTION_IMAGES = {
  // Imagem principal para páginas específicas das soluções
  hero: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop',
  
  // Imagens dos cards das soluções na página principal
  cards: {
    'pdv-frente-caixa': 'https://media.discordapp.net/attachments/1383147272442744954/1385703039301849158/df8aa13f-f327-44cd-a2f7-dcb05da3ae90.png?ex=68570805&is=6855b685&hm=5d0b5aa92f60247f9695a224633991a2904da267aebce5179cf3d93b783c10e2&=&format=webp&quality=lossless&width=1376&height=917',
    'mesas-comandas': 'https://media.discordapp.net/attachments/1383147272442744954/1385660144771141683/ChatGPT_Image_20_de_jun._de_2025_13_37_47.png?ex=6856e012&is=68558e92&hm=aa64526918f6004b6c6f93f9ce1c09c0a6a4c228b429e0f18bb78b2badc13252&=&format=webp&quality=lossless&width=1376&height=917',
    'cardapio-digital': 'https://media.discordapp.net/attachments/1383147272442744954/1385658129722769448/Screenshot_19.png?ex=6856de32&is=68558cb2&hm=b673c16367892300f41b9de26b7bbb583014971ccf24b8ef908100db2d978605&=&format=webp&quality=lossless&width=1872&height=769',
    'maquininhas-cartao': 'https://media.discordapp.net/attachments/1383147272442744954/1385726446844117083/ChatGPT_Image_20_de_jun._de_2025_18_02_02.png?ex=68571dd2&is=6855cc52&hm=573d77523cec2a384e9691e7268cb7800e944153c00713da84f0fc6c6905cabe&=&format=webp&quality=lossless&width=1376&height=917',
    'controle-motoboys': 'https://media.discordapp.net/attachments/1383147272442744954/1385729208592109820/SISFOOD-Gestao-Motoboys.jpg?ex=68572064&is=6855cee4&hm=b629d57f05372dc0a46333b991ba85b7b417dc7f2b47eda4099719eb867f319e&=&format=webp',
    'integracoes': 'https://plus.unsplash.com/premium_photo-1683492749168-ee69f4d90193?q=80&w=784&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'gestao-analise': 'https://images.unsplash.com/photo-1556155092-490a1ba16284?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'robo-whatsapp': 'https://media.discordapp.net/attachments/1383147272442744954/1385710369183629322/eyestetix-studio-Gj3OsJseh9c-unsplash.jpg?ex=68570ed9&is=6855bd59&hm=d0df4d057e151faae35e447f583d9de628a55d4e0e855e8e61308836d187796f&=&format=webp&width=960&height=960',
    'nota-fiscal': 'https://www.tagplus.com.br/assets/pages/nota_fiscal_eletronica/nfe-icn-c2461c11f3235898d3d43449c301e6250f88fd43d427e117c419136ec1fb63c9.png',
    'auto-atendimento': 'https://media.discordapp.net/attachments/1383147272442744954/1385703229165277304/ChatGPT_Image_20_de_jun._de_2025_16_17_31.png?ex=68570832&is=6855b6b2&hm=c8497efb45c5c1689ab321e242717f7e337e32a0fae419e7c74bc42caaeb95c9&=&format=webp&quality=lossless&width=640&height=960',
    'marketing-vendas': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1115&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'pagamento-tef': 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    'franquias-filiais': 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=400&h=200&fit=crop',
    'autoatendimento-tablet': 'https://media.discordapp.net/attachments/1383147272442744954/1385727954843205844/ChatGPT_Image_20_de_jun._de_2025_18_08_00.png?ex=68571f3a&is=6855cdba&hm=2a4bcc2da747a04cbbec281a736c8034ae5ff34cfdb8b8ebc76319479e34e41f&=&format=webp&quality=lossless&width=1376&height=917',
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

// Benefícios para a página geral
export const benefits = [
  { title: "Aumento da Eficiência", description: "Automatize processos manuais e reduza o tempo gasto em tarefas repetitivas.", iconType: "efficiency" as const },
  { title: "Controle Total", description: "Tenha visibilidade completa de todos os aspectos do seu negócio em tempo real.", iconType: "control" as const },
  { title: "Redução de Custos", description: "Elimine erros, evite perdas e otimize recursos com nossas soluções inteligentes.", iconType: "cost-reduction" as const },
  { title: "Crescimento Sustentável", description: "Sistemas escaláveis que crescem junto com seu negócio.", iconType: "growth" as const }
];