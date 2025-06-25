
-- Criar tipos enum para roles e status
CREATE TYPE public.user_role AS ENUM ('admin', 'super_admin');
CREATE TYPE public.post_status AS ENUM ('draft', 'published', 'archived');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role user_role NOT NULL DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de posts do blog
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    excerpt TEXT,
    featured_image TEXT,
    status post_status NOT NULL DEFAULT 'draft',
    author_id UUID REFERENCES public.profiles(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de soluções (migrar do frontend)
CREATE TABLE public.solutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    benefits TEXT[] NOT NULL DEFAULT '{}',
    industries TEXT[] NOT NULL DEFAULT '{}',
    icon_name TEXT NOT NULL,
    image_url TEXT,
    active BOOLEAN NOT NULL DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para updated_at
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER blog_posts_updated_at BEFORE UPDATE ON public.blog_posts
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER solutions_updated_at BEFORE UPDATE ON public.solutions
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        'admin'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Função de segurança para verificar role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = user_id;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solutions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
    FOR SELECT USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

CREATE POLICY "Super admins can manage profiles" ON public.profiles
    FOR ALL USING (public.get_user_role(auth.uid()) = 'super_admin');

-- Políticas RLS para blog_posts
CREATE POLICY "Everyone can read published posts" ON public.blog_posts
    FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage blog posts" ON public.blog_posts
    FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- Políticas RLS para solutions
CREATE POLICY "Everyone can read active solutions" ON public.solutions
    FOR SELECT USING (active = true);

CREATE POLICY "Admins can manage solutions" ON public.solutions
    FOR ALL USING (public.get_user_role(auth.uid()) IN ('admin', 'super_admin'));

-- Inserir soluções existentes do frontend
INSERT INTO public.solutions (key, title, description, features, benefits, industries, icon_name, active, sort_order) VALUES
('pdv-frente-caixa', 'PDV Frente de Caixa', 'Sistema completo de ponto de venda com interface intuitiva e recursos avançados para agilizar o atendimento ao cliente.', 
 ARRAY['Interface touch screen otimizada', 'Leitura de código de barras', 'Integração com balanças', 'Controle de estoque em tempo real', 'Múltiplas formas de pagamento'], 
 ARRAY['Atendimento 3x mais rápido', 'Redução de erros de caixa', 'Controle total de vendas', 'Relatórios em tempo real'], 
 ARRAY['Supermercados', 'Lojas de conveniência', 'Farmácias', 'Padarias'], 'Monitor', true, 1),

('mesas-comandas', 'Controle de Mesas e Comandas', 'Gerencie mesas, comandas e pedidos de forma digital com acompanhamento em tempo real do status dos pratos.', 
 ARRAY['Controle visual de mesas', 'Comandas digitais', 'Status de pedidos em tempo real', 'Integração com cozinha', 'Divisão de contas'], 
 ARRAY['Redução de 80% no tempo de atendimento', 'Eliminação de erros de pedidos', 'Maior satisfação do cliente', 'Otimização do fluxo de trabalho'], 
 ARRAY['Restaurantes', 'Bares', 'Lanchonetes', 'Pizzarias'], 'Utensils', true, 2),

('cardapio-digital', 'Cardápio Digital', 'Cardápio interativo com QR Code que permite aos clientes visualizar pratos, preços e fazer pedidos diretamente pelo celular.', 
 ARRAY['QR Code para acesso rápido', 'Cardápio interativo', 'Fotos dos pratos em alta resolução', 'Pedidos pelo celular', 'Atualizações em tempo real'], 
 ARRAY['Redução de custos com impressão', 'Atualizações instantâneas', 'Experiência moderna ao cliente', 'Pedidos sem contato físico'], 
 ARRAY['Restaurantes', 'Cafeterias', 'Food trucks', 'Bares'], 'Smartphone', true, 3),

('maquininhas-cartao', 'Integração com Maquininhas', 'Conecte diversas maquininhas de cartão ao sistema para processar pagamentos de forma automática e segura.', 
 ARRAY['Integração com múltiplas operadoras', 'Processamento automático', 'Conciliação de vendas', 'Relatórios de transações', 'Segurança PCI DSS'], 
 ARRAY['Agilidade no fechamento de vendas', 'Redução de erros manuais', 'Controle financeiro preciso', 'Conciliação automática'], 
 ARRAY['Varejo', 'Restaurantes', 'Farmácias', 'Postos de gasolina'], 'CreditCard', true, 4),

('controle-motoboys', 'Controle de Motoboys', 'Sistema de gestão completa para deliveries com rastreamento em tempo real e controle de entregas.', 
 ARRAY['Rastreamento GPS em tempo real', 'Controle de entregas', 'Cálculo automático de fretes', 'Histórico de entregas', 'Comunicação integrada'], 
 ARRAY['Redução de 50% no tempo de entrega', 'Maior satisfação do cliente', 'Controle total da operação', 'Otimização de rotas'], 
 ARRAY['Restaurantes', 'Farmácias', 'E-commerce', 'Supermercados'], 'Bike', true, 5);
