
-- Inserir o primeiro usuário administrador
-- Primeiro, crie o usuário via interface do Supabase Auth ou use o código acima
-- Depois execute este SQL para criar o perfil admin

-- Exemplo de inserção de perfil admin (substitua pelo user_id real após criar o usuário)
-- INSERT INTO public.admin_profiles (
--   user_id, 
--   email, 
--   name, 
--   role, 
--   is_active
-- ) VALUES (
--   'SEU_USER_ID_AQUI', -- Substitua pelo ID do usuário criado
--   'admin@mktecnologia.com',
--   'Administrador',
--   'admin',
--   true
-- );

-- Para verificar se existe algum perfil admin ativo:
SELECT * FROM public.admin_profiles WHERE is_active = true;

-- Para listar todos os usuários auth (apenas para referência):
-- SELECT id, email, created_at FROM auth.users;
