
-- Criar tabela para banners da home
CREATE TABLE public.home_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  image_url TEXT NOT NULL,
  link_url TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.home_banners ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS para administradores
CREATE POLICY "Admins can view all home banners" ON public.home_banners
  FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can insert home banners" ON public.home_banners
  FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update home banners" ON public.home_banners
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete home banners" ON public.home_banners
  FOR DELETE USING (public.is_admin(auth.uid()));

-- Permitir que usuários não autenticados vejam banners ativos (para o frontend público)
CREATE POLICY "Anyone can view active home banners" ON public.home_banners
  FOR SELECT USING (status = 'active');

-- Criar trigger para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.home_banners
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
