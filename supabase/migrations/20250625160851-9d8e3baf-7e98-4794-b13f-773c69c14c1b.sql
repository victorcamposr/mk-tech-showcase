
-- Create a table for contact messages
CREATE TABLE public.contacts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT NOT NULL,
  read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger for updated_at
CREATE TRIGGER handle_updated_at_contacts 
  BEFORE UPDATE ON public.contacts 
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Enable RLS (though we might make it accessible to admins only)
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all contacts
CREATE POLICY "Admins can view all contacts" 
  ON public.contacts 
  FOR SELECT 
  USING (public.is_admin(auth.uid()));

-- Create policy to allow anonymous users to insert contacts (from contact form)
CREATE POLICY "Anyone can create contacts" 
  ON public.contacts 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for admins to update contacts (mark as read)
CREATE POLICY "Admins can update contacts" 
  ON public.contacts 
  FOR UPDATE 
  USING (public.is_admin(auth.uid()));
