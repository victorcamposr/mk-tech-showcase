-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_empresa TEXT NOT NULL,
  responsavel TEXT NOT NULL,
  telefone TEXT,
  celular TEXT,
  cnpj TEXT NOT NULL,
  inscricao_estadual TEXT,
  email TEXT NOT NULL,
  data_vencimento_cobranca INTEGER NOT NULL, -- Day of month (1-31)
  asaas_customer_id TEXT, -- ID from Asaas integration
  status_pagamento TEXT NOT NULL DEFAULT 'regular', -- 'regular', 'pendente', 'inadimplente'
  ultima_cobranca_automatica TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Admins can view all customers" 
ON public.customers 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update customers" 
ON public.customers 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete customers" 
ON public.customers 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create payment history table
CREATE TABLE public.customer_payment_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  data_pagamento TIMESTAMP WITH TIME ZONE,
  valor DECIMAL(10,2),
  status TEXT NOT NULL, -- 'pago', 'pendente', 'vencido', 'cancelado'
  asaas_payment_id TEXT, -- ID from Asaas integration
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for payment history
ALTER TABLE public.customer_payment_history ENABLE ROW LEVEL SECURITY;

-- Create policies for payment history
CREATE POLICY "Admins can view all payment history" 
ON public.customer_payment_history 
FOR SELECT 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can create payment history" 
ON public.customer_payment_history 
FOR INSERT 
WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update payment history" 
ON public.customer_payment_history 
FOR UPDATE 
USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete payment history" 
ON public.customer_payment_history 
FOR DELETE 
USING (is_admin(auth.uid()));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
BEFORE UPDATE ON public.customers
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_customer_payment_history_updated_at
BEFORE UPDATE ON public.customer_payment_history
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create indexes for better performance
CREATE INDEX idx_customers_cnpj ON public.customers(cnpj);
CREATE INDEX idx_customers_status ON public.customers(status_pagamento);
CREATE INDEX idx_customers_vencimento ON public.customers(data_vencimento_cobranca);
CREATE INDEX idx_payment_history_customer ON public.customer_payment_history(customer_id);
CREATE INDEX idx_payment_history_status ON public.customer_payment_history(status);