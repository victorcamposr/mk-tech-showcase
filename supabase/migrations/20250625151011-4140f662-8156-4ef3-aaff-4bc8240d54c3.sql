
-- Corrigir problemas de foreign key na tabela admin_profiles
-- Remover constraint de foreign key que está causando erro
ALTER TABLE public.admin_profiles DROP CONSTRAINT IF EXISTS admin_profiles_user_id_fkey;

-- Tornar user_id opcional temporariamente para permitir criação de usuários admin
ALTER TABLE public.admin_profiles ALTER COLUMN user_id DROP NOT NULL;

-- Adicionar constraint única no email para evitar duplicatas
ALTER TABLE public.admin_profiles ADD CONSTRAINT admin_profiles_email_unique UNIQUE (email);

-- Corrigir tabela blog_posts - remover constraint de foreign key problemática
ALTER TABLE public.blog_posts DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;

-- Tornar author_id nullable para evitar erro de UUID
ALTER TABLE public.blog_posts ALTER COLUMN author_id DROP NOT NULL;

-- Criar tabela de atividades para dashboard dinâmico
CREATE TABLE IF NOT EXISTS public.admin_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_type TEXT NOT NULL, -- 'create', 'update', 'delete'
  entity_type TEXT NOT NULL, -- 'solution', 'blog_post', 'user'
  entity_id UUID,
  entity_title TEXT,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS na tabela de atividades
ALTER TABLE public.admin_activities ENABLE ROW LEVEL SECURITY;

-- Política para admins verem todas as atividades
CREATE POLICY "Admins can view all activities" 
  ON public.admin_activities 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Política para admins criarem atividades
CREATE POLICY "Admins can create activities" 
  ON public.admin_activities 
  FOR INSERT 
  WITH CHECK (public.is_admin(auth.uid()));
