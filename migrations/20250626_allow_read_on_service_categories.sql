-- Enable Row Level Security if not enabled, and create a policy for public read access.

-- 1. Enable RLS for the table
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;

-- 2. Create a policy that allows public read access
CREATE POLICY "Allow public read access to service categories" 
ON public.service_categories
FOR SELECT
USING (true);
