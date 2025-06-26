
-- Criar tabela para cards de serviços
CREATE TABLE public.service_cards (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_url text NOT NULL,
  description text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  status text NOT NULL DEFAULT 'active'::text CHECK (status IN ('active', 'inactive')),
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Adicionar trigger para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.service_cards
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Comentários para documentação
COMMENT ON TABLE public.service_cards IS 'Cards de serviços exibidos na página pública de serviços';
COMMENT ON COLUMN public.service_cards.logo_url IS 'URL da imagem do logo do serviço';
COMMENT ON COLUMN public.service_cards.description IS 'Descrição do serviço';
COMMENT ON COLUMN public.service_cards.phone IS 'Telefone de contato';
COMMENT ON COLUMN public.service_cards.email IS 'E-mail de contato';
COMMENT ON COLUMN public.service_cards.status IS 'Status do card (active/inactive)';
COMMENT ON COLUMN public.service_cards.sort_order IS 'Ordem de exibição dos cards';
