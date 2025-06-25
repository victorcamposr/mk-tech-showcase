
-- Criar enum para roles de usuários
CREATE TYPE public.user_role AS ENUM ('admin', 'super_admin');

-- Tabela de perfis de usuários administrativos
CREATE TABLE public.admin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Tabela de posts do blog
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  author_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  tags TEXT[] DEFAULT '{}',
  meta_title TEXT,
  meta_description TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de soluções (migrar do front-end)
CREATE TABLE public.solutions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  industries TEXT[] NOT NULL DEFAULT '{}',
  icon_name TEXT NOT NULL,
  card_image_url TEXT,
  hero_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;

-- Função de segurança para verificar se o usuário é admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_profiles 
    WHERE admin_profiles.user_id = is_admin.user_id 
    AND is_active = true
  );
$$;

-- Políticas RLS para admin_profiles
CREATE POLICY "Admins can view all profiles" 
  ON public.admin_profiles 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Super admins can manage profiles" 
  ON public.admin_profiles 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_profiles 
      WHERE user_id = auth.uid() 
      AND role = 'super_admin' 
      AND is_active = true
    )
  );

CREATE POLICY "Users can view own profile" 
  ON public.admin_profiles 
  FOR SELECT 
  USING (user_id = auth.uid());

-- Políticas RLS para blog_posts
CREATE POLICY "Anyone can view published posts" 
  ON public.blog_posts 
  FOR SELECT 
  USING (status = 'published');

CREATE POLICY "Admins can manage all posts" 
  ON public.blog_posts 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Políticas RLS para solutions
CREATE POLICY "Anyone can view active solutions" 
  ON public.solutions 
  FOR SELECT 
  USING (status = 'active');

CREATE POLICY "Admins can manage solutions" 
  ON public.solutions 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER handle_admin_profiles_updated_at
  BEFORE UPDATE ON public.admin_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_solutions_updated_at
  BEFORE UPDATE ON public.solutions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Inserir dados iniciais das soluções existentes
INSERT INTO public.solutions (key, title, description, features, benefits, industries, icon_name, sort_order) VALUES
('pdv-frente-caixa', 'Frente de Caixa/PDV Premium', 'Frente de Caixa web, rápido e prático. Automatize 100% seus pedidos com integração completa.', 
 ARRAY['Acesse de qualquer dispositivo: Windows, navegador ou APP Android', 'Todos pedidos num só lugar', 'Realize pedidos: Delivery, Balcão, Senha, Agendamentos, Mesas, Comandas', 'Integrações: Ifood, Aiqfome, Whatsapp', '100% integrado ao Whatsapp', 'Aceite e impressão automática de pedidos', 'Repetição de pedidos e Histórico de Compras', 'Roteirização de pedidos e Gestão de Entregas', 'Integrado com TEF/Pin Pads, Leitor Código Barras, Balanças', 'Controle de crédito/fiado e histórico de clientes', 'Fluxo de caixa por usuário', 'Taxa de serviço, Mesas/Comandas', 'Organize pedidos por data, tipo ou agendamentos'],
 ARRAY['Automatização 100% dos pedidos', 'Funciona em dispositivos antigos sem travamentos', 'Gestão completa de entregas'],
 ARRAY['Restaurantes', 'Delivery', 'Varejo', 'Todos os segmentos'],
 'Calculator', 1),

('mesas-comandas', 'Mesas/Comandas - Garçons', 'Sistema completo para restaurantes, bares e lanchonetes com controle de mesas e comandas.',
 ARRAY['Controle de mesas em tempo real', 'Comandas digitais integradas', 'App para garçons com pedidos', 'Gestão de cardápio dinâmico', 'Divisão de contas automática', 'Controle de ocupação de mesas', 'Integração com delivery', 'Relatórios de performance'],
 ARRAY['Redução de 60% no tempo de pedidos', 'Aumento de 30% no faturamento', 'Melhor experiência do cliente'],
 ARRAY['Restaurantes', 'Bares', 'Lanchonetes', 'Pizzarias'],
 'Coffee', 2),

('cardapio-digital', 'Cardápio Digital', 'Cardápio digital completo com domínio próprio e recursos avançados de venda online.',
 ARRAY['Domínio Próprio (www.seurestaurante.com.br)', 'Compra rápida (cliente não precisa se cadastrar)', 'Pedido liberado somente após pagamento', 'Pagamentos Pix e Cartões', 'Programa de Fidelidade', 'Cupons de Desconto', 'Integrado com Whatsapp', 'Facebook Pixel e Google Analytics', 'Desconto p/ aniversariantes e primeira compra', 'Personalize botões, textos e cores', 'Banners para divulgar informações importantes'],
 ARRAY['Vendas online 24h', 'Programa de fidelidade integrado', 'Analytics completo de vendas'],
 ARRAY['Restaurantes', 'Bares', 'Lanchonetes', 'Delivery'],
 'QrCode', 3);

-- Inserir mais soluções (continuando com as demais)
INSERT INTO public.solutions (key, title, description, features, benefits, industries, icon_name, sort_order) VALUES
('maquininhas-cartao', 'Maquininhas de Cartão', 'Agilize o seu atendimento realizando pedidos, cobrança e emissão de notas fiscais rapidamente.',
 ARRAY['Realize pedidos, cobre e emita notas fiscais rapidamente', 'Controle de mesas e comandas eletrônicas', 'Pedidos balcão em segundos', 'Solução rápida e leve', 'Integrado com Stone, Cielo e outras bandeiras', 'PDV completo dentro da máquina', 'Agilidade no atendimento', 'Suporte técnico especializado'],
 ARRAY['Atendimento mais rápido', 'Tudo integrado em um só equipamento', 'Máxima praticidade operacional'],
 ARRAY['Restaurantes', 'Varejo', 'Comércio', 'Todos os segmentos'],
 'CreditCard', 4),

('controle-motoboys', 'Controle e Aplicativo para Motoboys', 'Sistema completo de gestão e controle de entregadores com aplicativo dedicado para otimizar suas entregas.',
 ARRAY['Rastreamento em tempo real dos entregadores', 'Gestão de rotas otimizadas automaticamente', 'App exclusivo para motoboys', 'Controle de entregas e status', 'Relatórios de performance detalhados', 'Notificações push em tempo real', 'Histórico completo de entregas', 'Integração com sistemas de delivery'],
 ARRAY['Redução de 40% no tempo de entrega', 'Maior controle operacional', 'Aumento da satisfação do cliente'],
 ARRAY['Delivery', 'E-commerce', 'Restaurantes', 'Distribuidoras'],
 'Truck', 5),

('sistema-revendas-gas-agua', 'Sistema para Revendas de Gás e Água', 'Gestão eficiente para você e sua revenda. Sistema online, com suas informações seguras e disponíveis a qualquer momento e em qualquer lugar.',
 ARRAY['Sistema online com informações seguras disponíveis 24/7', 'Controle de estoque em tempo real pelo celular', 'Aplicativo exclusivo para entregadores', 'Dashboard de gestão completo', 'Aplicativo próprio com sua marca, cor e logo', 'Localização do entregador mais próximo', 'Fechamento de caixa diário simplificado', 'Gestão financeira completa (contas a pagar/receber, DRE)', 'Mapa de calor das vendas', 'Rastreamento em tempo real dos entregadores', 'Aplicativo para emissão de notas na rua', 'Controle exclusivo da portaria', 'Mais de 50 relatórios disponíveis', 'Disque gás e água com teleatendimento Bina', 'Relatórios de preço médio e previsão de compra', 'Emissão de NFe, NFCe, CTE e boletos bancários'],
 ARRAY['Aumento significativo da produtividade operacional', 'Controle total em tempo real de toda operação', 'Redução de tempo de entrega com otimização de rotas', 'Gestão financeira automatizada e precisa'],
 ARRAY['Revendas de Gás', 'Distribuidoras de Água', 'Delivery de Bebidas', 'Logística'],
 'Fuel', 15);
