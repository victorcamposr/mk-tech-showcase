
-- Inserir todas as soluções estáticas no banco de dados
INSERT INTO public.solutions (key, title, description, features, benefits, industries, icon_name, status, sort_order) VALUES
('pdv-frente-caixa', 'Frente de Caixa/PDV Premium', 'Frente de Caixa web, rápido e prático. Automatize 100% seus pedidos com integração completa.', 
 ARRAY['Acesse de qualquer dispositivo: Windows, navegador ou APP Android', 'Todos pedidos num só lugar', 'Realize pedidos: Delivery, Balcão, Senha, Agendamentos, Mesas, Comandas', 'Integrações: Ifood, Aiqfome, Whatsapp', '100% integrado ao Whatsapp', 'Aceite e impressão automática de pedidos', 'Repetição de pedidos e Histórico de Compras', 'Roteirização de pedidos e Gestão de Entregas', 'Integrado com TEF/Pin Pads, Leitor Código Barras, Balanças', 'Controle de crédito/fiado e histórico de clientes', 'Fluxo de caixa por usuário', 'Taxa de serviço, Mesas/Comandas', 'Organize pedidos por data, tipo ou agendamentos'],
 ARRAY['Automatização 100% dos pedidos', 'Funciona em dispositivos antigos sem travamentos', 'Gestão completa de entregas'],
 ARRAY['Restaurantes', 'Delivery', 'Varejo', 'Todos os segmentos'],
 'Calculator', 'active', 1),

('mesas-comandas', 'Mesas/Comandas - Garçons', 'Sistema completo para restaurantes, bares e lanchonetes com controle de mesas e comandas.',
 ARRAY['Controle de mesas em tempo real', 'Comandas digitais integradas', 'App para garçons com pedidos', 'Gestão de cardápio dinâmico', 'Divisão de contas automática', 'Controle de ocupação de mesas', 'Integração com delivery', 'Relatórios de performance'],
 ARRAY['Redução de 60% no tempo de pedidos', 'Aumento de 30% no faturamento', 'Melhor experiência do cliente'],
 ARRAY['Restaurantes', 'Bares', 'Lanchonetes', 'Pizzarias'],
 'Coffee', 'active', 2),

('cardapio-digital', 'Cardápio Digital', 'Cardápio digital completo com domínio próprio e recursos avançados de venda online.',
 ARRAY['Domínio Próprio (www.seurestaurante.com.br)', 'Compra rápida (cliente não precisa se cadastrar)', 'Pedido liberado somente após pagamento', 'Pagamentos Pix e Cartões', 'Programa de Fidelidade', 'Cupons de Desconto', 'Integrado com Whatsapp', 'Facebook Pixel e Google Analytics', 'Desconto p/ aniversariantes e primeira compra', 'Personalize botões, textos e cores', 'Banners para divulgar informações importantes'],
 ARRAY['Vendas online 24h', 'Programa de fidelidade integrado', 'Analytics completo de vendas'],
 ARRAY['Restaurantes', 'Bares', 'Lanchonetes', 'Delivery'],
 'QrCode', 'active', 3),

('maquininhas-cartao', 'Maquininhas de Cartão', 'Agilize o seu atendimento realizando pedidos, cobrança e emissão de notas fiscais rapidamente.',
 ARRAY['Realize pedidos, cobre e emita notas fiscais rapidamente', 'Controle de mesas e comandas eletrônicas', 'Pedidos balcão em segundos', 'Solução rápida e leve', 'Integrado com Stone, Cielo e outras bandeiras', 'PDV completo dentro da máquina', 'Agilidade no atendimento', 'Suporte técnico especializado'],
 ARRAY['Atendimento mais rápido', 'Tudo integrado em um só equipamento', 'Máxima praticidade operacional'],
 ARRAY['Restaurantes', 'Varejo', 'Comércio', 'Todos os segmentos'],
 'CreditCard', 'active', 4),

('controle-motoboys', 'Controle e Aplicativo para Motoboys', 'Sistema completo de gestão e controle de entregadores com aplicativo dedicado para otimizar suas entregas.',
 ARRAY['Rastreamento em tempo real dos entregadores', 'Gestão de rotas otimizadas automaticamente', 'App exclusivo para motoboys', 'Controle de entregas e status', 'Relatórios de performance detalhados', 'Notificações push em tempo real', 'Histórico completo de entregas', 'Integração com sistemas de delivery'],
 ARRAY['Redução de 40% no tempo de entrega', 'Maior controle operacional', 'Aumento da satisfação do cliente'],
 ARRAY['Delivery', 'E-commerce', 'Restaurantes', 'Distribuidoras'],
 'Truck', 'active', 5),

('integracoes', 'Equipamentos e Integrações', 'Diversas integrações que auxiliam seu atendimento e tornam sua rotina mais prática.',
 ARRAY['Marketplaces: Ifood e Aiqfome', 'Pagamentos: TEF e Pin Pad', 'Dados e Analytics: Facebook Pixel e Google Analytics', 'Recursos que aumentam a produtividade', 'Balanças de peso e Etiquetas de peso', 'Impressoras térmicas', 'Leitor de Código de Barras', 'Equipamentos e periféricos completos'],
 ARRAY['Aumento significativo da produtividade', 'Integração total com marketplaces', 'Analytics avançado para decisões'],
 ARRAY['Restaurantes', 'Varejo', 'Supermercados', 'Todos os segmentos'],
 'Link2', 'active', 6),

('gestao-analise', 'Gestão e Análise para Food Service', 'Análises avançadas e gestão inteligente especialmente desenvolvida para o setor alimentício.',
 ARRAY['Dashboard analítico completo', 'Relatórios de vendas em tempo real', 'Controle de custos e margem', 'Previsão de demanda inteligente', 'Análise de cardápio e rentabilidade', 'Controle de desperdício', 'Métricas de performance', 'Alertas automáticos personalizados'],
 ARRAY['Decisões baseadas em dados precisos', 'Redução de 30% no desperdício', 'Aumento de 25% no lucro'],
 ARRAY['Restaurantes', 'Food Service', 'Bares', 'Lanchonetes'],
 'BarChart3', 'active', 7),

('robo-whatsapp', 'Robô de WhatsApp', 'Automatize o atendimento ao cliente com nosso robô inteligente para WhatsApp Business.',
 ARRAY['Atendimento automatizado 24 horas', 'Respostas personalizadas inteligentes', 'Integração direta com vendas', 'Analytics detalhado de conversas', 'Catálogo de produtos integrado', 'Agendamento automático', 'Transferência para atendente humano', 'Campanhas de marketing automatizadas'],
 ARRAY['Atendimento constante 24/7', 'Aumento de 50% na conversão', 'Redução de 70% nos custos'],
 ARRAY['Todos os segmentos', 'E-commerce', 'Serviços', 'Varejo'],
 'Bot', 'active', 8),

('nota-fiscal', 'Nota Fiscal e Cupom Fiscal', 'Emissão automática de documentos fiscais com total conformidade legal e integração completa.',
 ARRAY['NFe, NFCe e SAT automáticos', 'Cupom fiscal eletrônico', 'Certificado digital integrado', 'Backup automático seguro', 'Contingência offline', 'Envio automático por email', 'Controle de status SEFAZ', 'Relatórios fiscais completos'],
 ARRAY['100% de conformidade fiscal', 'Processo totalmente automatizado', 'Máxima segurança de dados'],
 ARRAY['Comércio', 'Serviços', 'Indústria', 'Todos os segmentos'],
 'Receipt', 'active', 9),

('auto-atendimento', 'Auto Atendimento', 'Soluções completas de autoatendimento para otimizar o fluxo de clientes e reduzir filas.',
 ARRAY['Interface touchscreen intuitiva', 'Suporte a múltiplos idiomas', 'Integração com sistemas de pagamento', 'Catálogo de produtos interativo', 'Suporte remoto em tempo real', 'Personalização total da interface', 'Relatórios de uso detalhados', 'Atualizações automáticas'],
 ARRAY['Redução de 80% nas filas', 'Experiência moderna e eficiente', 'Economia de 60% em pessoal'],
 ARRAY['Varejo', 'Restaurantes', 'Serviços', 'Fast food'],
 'Monitor', 'active', 10),

('marketing-vendas', 'Marketing e Aumento de Vendas', 'Estratégias digitais avançadas e ferramentas inteligentes para alavancar suas vendas.',
 ARRAY['Campanhas automatizadas personalizadas', 'CRM integrado completo', 'Analytics avançado de vendas', 'Promoções inteligentes automáticas', 'Email marketing profissional', 'Programa de fidelidade digital', 'Segmentação avançada de clientes', 'ROI detalhado de campanhas'],
 ARRAY['Aumento médio de 45% nas vendas', 'Fidelização de 70% dos clientes', 'ROI 300% mensurável'],
 ARRAY['Todos os segmentos', 'E-commerce', 'Varejo', 'Serviços'],
 'TrendingUp', 'active', 11),

('pagamento-tef', 'Soluções em Pagamento - TEF', 'Transferência eletrônica de fundos totalmente integrada ao seu sistema de vendas.',
 ARRAY['TEF integrado ao sistema', 'Suporte a múltiplas bandeiras', 'Transações 100% seguras', 'Relatórios financeiros detalhados', 'Conciliação automática', 'PIX empresarial integrado', 'Parcelamento inteligente', 'Monitoramento em tempo real'],
 ARRAY['Máxima praticidade no pagamento', 'Segurança bancária garantida', 'Gestão financeira centralizada'],
 ARRAY['Varejo', 'Serviços', 'Comércio', 'Restaurantes'],
 'Banknote', 'active', 12),

('franquias-filiais', 'Franquias e Filiais', 'Centralize e padronize toda suas operações num único sistema.',
 ARRAY['Centralize e padronize todas suas operações', 'Veja o andamento de lojas em segundos', 'Todas soluções acessadas de qualquer lugar', 'Portal do franqueador e do franqueado', 'Veja e compare o faturamento em segundos', 'Gestão centralizada total', 'Controle unificado de todas as filiais', 'Relatórios comparativos instantâneos'],
 ARRAY['Controle total centralizado', 'Padronização de processos', 'Comparação de performance instantânea'],
 ARRAY['Franquias', 'Redes de varejo', 'Múltiplas filiais', 'Grandes empresas'],
 'Building2', 'active', 13),

('autoatendimento-tablet', 'Autoatendimento Tablet Mesa', 'Tablets interativos nas mesas para pedidos diretos e experiência única do cliente.',
 ARRAY['Tablets fixos em cada mesa', 'Pedidos diretos sem garçom', 'Cardápio interativo com fotos', 'Pagamento integrado na mesa', 'Customização de pedidos', 'Chamada de garçom integrada', 'Jogos e entretenimento', 'Feedback direto do cliente'],
 ARRAY['Experiência única e moderna', 'Agilidade de 70% no atendimento', 'Redução de 50% nos custos operacionais'],
 ARRAY['Restaurantes', 'Cafeterias', 'Fast food', 'Bares'],
 'Tablet', 'active', 14),

('sistema-revendas-gas-agua', 'Sistema para Revendas de Gás e Água', 'Gestão eficiente para você e sua revenda. Sistema online, com suas informações seguras e disponíveis a qualquer momento e em qualquer lugar.',
 ARRAY['Sistema online com informações seguras disponíveis 24/7', 'Controle de estoque em tempo real pelo celular', 'Aplicativo exclusivo para entregadores', 'Dashboard de gestão completo', 'Aplicativo próprio com sua marca, cor e logo', 'Localização do entregador mais próximo', 'Fechamento de caixa diário simplificado', 'Gestão financeira completa (contas a pagar/receber, DRE)', 'Mapa de calor das vendas', 'Rastreamento em tempo real dos entregadores', 'Aplicativo para emissão de notas na rua', 'Controle exclusivo da portaria', 'Mais de 50 relatórios disponíveis', 'Disque gás e água com teleatendimento Bina', 'Relatórios de preço médio e previsão de compra', 'Emissão de NFe, NFCe, CTE e boletos bancários'],
 ARRAY['Aumento significativo da produtividade operacional', 'Controle total em tempo real de toda operação', 'Redução de tempo de entrega com otimização de rotas', 'Gestão financeira automatizada e precisa'],
 ARRAY['Revendas de Gás', 'Distribuidoras de Água', 'Delivery de Bebidas', 'Logística'],
 'Fuel', 'active', 15)

-- Inserir apenas se não existir (evitar duplicatas)
ON CONFLICT (key) DO NOTHING;
