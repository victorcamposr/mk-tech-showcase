
-- Criar tabela para os projetos em destaque do portfólio
CREATE TABLE public.portfolio_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  results TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para as estatísticas do portfólio
CREATE TABLE public.portfolio_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  value INTEGER NOT NULL,
  suffix TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para os depoimentos
CREATE TABLE public.portfolio_testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  company TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar triggers para updated_at
CREATE TRIGGER handle_updated_at_portfolio_projects
  BEFORE UPDATE ON public.portfolio_projects
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_portfolio_stats
  BEFORE UPDATE ON public.portfolio_stats
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_portfolio_testimonials
  BEFORE UPDATE ON public.portfolio_testimonials
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Inserir dados iniciais das estatísticas
INSERT INTO public.portfolio_stats (key, label, value, suffix, sort_order) VALUES
('companies', 'Empresas Atendidas', 100, '+', 1),
('segments', 'Segmentos', 15, '+', 2),
('experience', 'Anos de Experiência', 5, '+', 3),
('support', 'Suporte Disponível', 24, '/7', 4);

-- Inserir dados iniciais dos projetos
INSERT INTO public.portfolio_projects (title, category, description, results, sort_order) VALUES
('Supermercado Central', 'Varejo Alimentício', 'Implementação completa de sistema PDV com controle de estoque, emissão fiscal e gestão financeira para rede de supermercados.', ARRAY['Redução de 40% no tempo de fechamento', 'Controle preciso de estoque', 'Integração com balanças', 'Relatórios gerenciais'], 1),
('Loja Fashion Style', 'Moda e Vestuário', 'Automação comercial para loja de roupas com controle de grades, cores, tamanhos e sazonalidade.', ARRAY['Gestão de grades completa', 'Controle de sazonalidade', 'Relatórios de vendas', 'Sistema de fidelidade'], 2),
('Restaurante Sabor & Arte', 'Alimentação', 'Sistema para restaurante com controle de mesas, comanda eletrônica e integração com delivery.', ARRAY['Comanda eletrônica', 'Controle de mesas', 'Integração delivery', 'Gestão de cardápio'], 3),
('Auto Peças Rondon', 'Autopeças', 'Sistema especializado para autopeças com catálogo integrado, compatibilidade de peças e gestão de orçamentos.', ARRAY['Catálogo de 50mil+ peças', 'Compatibilidade automática', 'Orçamentos digitais', 'Controle de garantias'], 4),
('Distribuidora Água Cristal', 'Distribuição', 'Sistema completo para distribuidora de água com controle de rotas, gestão de entregadores e aplicativo mobile.', ARRAY['Gestão de rotas otimizada', 'App para entregadores', 'Controle de estoque', 'Emissão automática de NF'], 5),
('Padaria Doce Vida', 'Panificação', 'Sistema de gestão para padaria com controle de produção, validades e vendas integradas.', ARRAY['Controle de produção', 'Gestão de validades', 'PDV integrado', 'Relatórios de vendas'], 6);

-- Inserir dados iniciais dos depoimentos
INSERT INTO public.portfolio_testimonials (content, author, company, rating, sort_order) VALUES
('A MK Tecnologia transformou nosso negócio. O sistema é intuitivo e o suporte excepcional.', 'João Silva', 'Supermercado Central', 5, 1),
('Sistema perfeito para moda. O controle de grades e relatórios são fantásticos.', 'Maria Santos', 'Loja Fashion Style', 5, 2),
('Implementaram nosso sistema de autopeças com catálogo completo. A busca por compatibilidade de peças ficou automática e nossos vendedores são muito mais produtivos.', 'Carlos Oliveira', 'Auto Peças Rondon', 5, 3),
('O sistema para nossa distribuidora é perfeito. Controle de rotas, app para entregadores e gestão completa. Aumentamos nossa produtividade em 60%.', 'Roberto Lima', 'Distribuidora Água Cristal', 5, 4),
('Excelente solução para nossa padaria. O controle de produção e validades facilitou muito nosso trabalho diário.', 'Ana Costa', 'Padaria Doce Vida', 5, 5);
