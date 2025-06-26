
-- Create service_cards table to store service cards information
CREATE TABLE IF NOT EXISTS public.service_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  logo_url TEXT NOT NULL,
  description TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trigger to automatically update updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.service_cards 
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
