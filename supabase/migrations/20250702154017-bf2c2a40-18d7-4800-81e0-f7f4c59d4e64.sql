
-- Criar tabela para armazenar dados fiscais
CREATE TABLE public.fiscal_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token_cupom_fiscal TEXT,
  arquivo_token_url TEXT,
  serie TEXT,
  ultimo_cupom_emitido TEXT,
  ultima_nfe TEXT,
  certificado_digital_url TEXT,
  senha_certificado TEXT,
  razao_social TEXT NOT NULL,
  nome_fantasia TEXT,
  endereco_rua TEXT NOT NULL,
  endereco_numero TEXT NOT NULL,
  endereco_complemento TEXT,
  endereco_cidade TEXT NOT NULL,
  endereco_estado TEXT NOT NULL,
  contador_nome TEXT,
  contador_crc TEXT,
  contador_telefone TEXT,
  email_empresarial TEXT NOT NULL,
  email_contador TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.fiscal_data ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para administradores
CREATE POLICY "Admins can view all fiscal data" 
  ON public.fiscal_data 
  FOR SELECT 
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert fiscal data" 
  ON public.fiscal_data 
  FOR INSERT 
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update fiscal data" 
  ON public.fiscal_data 
  FOR UPDATE 
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete fiscal data" 
  ON public.fiscal_data 
  FOR DELETE 
  USING (is_admin(auth.uid()));

-- Política para usuários visualizarem seus próprios dados
CREATE POLICY "Users can view own fiscal data" 
  ON public.fiscal_data 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fiscal data" 
  ON public.fiscal_data 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own fiscal data" 
  ON public.fiscal_data 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.fiscal_data
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
