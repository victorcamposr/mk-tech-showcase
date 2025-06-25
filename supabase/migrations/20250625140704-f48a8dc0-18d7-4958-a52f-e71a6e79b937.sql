
-- Remover TODAS as políticas da tabela admin_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Admins can manage profiles" ON public.admin_profiles;
DROP POLICY IF EXISTS "Super admins can manage profiles" ON public.admin_profiles;

-- Remover a função is_admin com CASCADE para remover as dependências
DROP FUNCTION IF EXISTS public.is_admin(UUID) CASCADE;

-- Recriar a função is_admin de forma mais segura
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_profiles 
    WHERE admin_profiles.user_id = $1
    AND is_active = true
  );
$$;

-- Recriar políticas que foram removidas pelo CASCADE
CREATE POLICY "Admins can manage all posts" 
  ON public.blog_posts 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage solutions" 
  ON public.solutions 
  FOR ALL 
  USING (public.is_admin(auth.uid()));

-- Criar políticas simples sem recursão para admin_profiles
CREATE POLICY "Users can view own profile" 
  ON public.admin_profiles 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile" 
  ON public.admin_profiles 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" 
  ON public.admin_profiles 
  FOR UPDATE 
  USING (user_id = auth.uid());

-- Política específica para admins gerenciarem outros perfis
CREATE POLICY "Admins can view all profiles" 
  ON public.admin_profiles 
  FOR SELECT 
  USING (
    user_id = auth.uid() OR 
    public.is_admin(auth.uid())
  );

CREATE POLICY "Admins can manage profiles" 
  ON public.admin_profiles 
  FOR ALL 
  USING (public.is_admin(auth.uid()));
