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
        
        let query;
        
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
          const formattedData = data.map((item: any) => item.professional);
          setProfessionals(formattedData);
        } else {
          // Otherwise get all professionals
          const { data, error } = await supabase
            .from('professionals')
            .select('*');

          if (error) throw error;
          
          setProfessionals(data);
        }
      } catch (error: any) {
        console.error('Error fetching professionals:', error);
        setError(error.message || 'Failed to fetch professionals');
      } finally {
        setLoading(false);
      }
    };

    fetchProfessionals();
  }, [serviceId]);

  return { professionals, loading, error };
}
