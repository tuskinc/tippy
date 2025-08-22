import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Professional } from '@/integrations/supabase/types.d';

export function useProfessionals(serviceId?: string) {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        setLoading(true);
        
        if (serviceId) {
          // If serviceId is provided, get professionals offering that service
          const { data, error } = await supabase
            .from('professional_services')
            .select(`
              professional:professionals(*)
            `)
            .eq('service_id', serviceId)
            .eq('is_available', true);

          if (error) throw error;
          
          // Format data to extract professionals from the join query
          const formattedData = (data ?? []).map((item: { professional: Professional }) => item.professional);
          setProfessionals(formattedData);
        } else {
          // Otherwise get all professionals
          const { data, error } = await supabase
            .from('professionals')
            .select('*');

          if (error) throw error;
          
          setProfessionals(data);
        }
      } catch (error) {
        const err = error as Error;
        console.error('Error fetching professionals:', err);
        setError(err.message || 'Failed to fetch professionals');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [serviceId]);

  return { professionals, loading, error };
}
