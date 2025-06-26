
-- Políticas para portfolio_projects
CREATE POLICY "Admins can insert portfolio projects" ON public.portfolio_projects
FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update portfolio projects" ON public.portfolio_projects
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete portfolio projects" ON public.portfolio_projects
FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

-- Políticas para portfolio_testimonials
CREATE POLICY "Admins can insert portfolio testimonials" ON public.portfolio_testimonials
FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update portfolio testimonials" ON public.portfolio_testimonials
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete portfolio testimonials" ON public.portfolio_testimonials
FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

-- Políticas para portfolio_stats
CREATE POLICY "Admins can update portfolio stats" ON public.portfolio_stats
FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid()));

-- Habilitar RLS nas tabelas (caso não estejam habilitadas)
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_stats ENABLE ROW LEVEL SECURITY;
