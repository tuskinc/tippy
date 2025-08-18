
-- Create a dedicated schema for the postgis extension
CREATE SCHEMA IF NOT EXISTS extensions;

-- Grant usage rights to necessary roles 
GRANT USAGE ON SCHEMA extensions TO postgres, anon, authenticated, service_role;

-- Move postgis extension to the extensions schema
ALTER EXTENSION postgis SET SCHEMA extensions;

-- Update the function to have an explicit search path
CREATE OR REPLACE FUNCTION public.update_professional_ratings()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  UPDATE public.professionals
  SET 
    average_rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM public.reviews
      WHERE professional_id = NEW.professional_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM public.reviews
      WHERE professional_id = NEW.professional_id
    )
  WHERE id = NEW.professional_id;
  RETURN NEW;
END;
$function$;

-- Ensure that the trigger is recreated if it exists
DROP TRIGGER IF EXISTS update_ratings ON public.reviews;
CREATE TRIGGER update_ratings 
  AFTER INSERT OR UPDATE OR DELETE
  ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION public.update_professional_ratings();

-- Ensure all extensions are in the proper schema
DO $$
DECLARE
  ext text;
BEGIN
  FOR ext IN SELECT extname FROM pg_extension WHERE extnamespace = 'public'::regnamespace LOOP
    EXECUTE format('ALTER EXTENSION %I SET SCHEMA extensions', ext);
  END LOOP;
END $$;
