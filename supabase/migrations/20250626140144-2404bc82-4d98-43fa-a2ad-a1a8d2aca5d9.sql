
-- Add title column to service_cards table
ALTER TABLE public.service_cards ADD COLUMN title TEXT NOT NULL DEFAULT '';

-- Update the default value to empty string and remove the default after adding the column
ALTER TABLE public.service_cards ALTER COLUMN title DROP DEFAULT;
