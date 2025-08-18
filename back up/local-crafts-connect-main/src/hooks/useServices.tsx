
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/integrations/supabase/types.d';

export function useServices(categoryId?: string) {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        let query = supabase.from('services').select('*');
        
        if (categoryId) {
          query = query.eq('category_id', categoryId);
        }
        
        const { data, error } = await query.order('name');

        if (error) {
          throw error;
        }

        setServices(data);
      } catch (error: any) {
        console.error('Error fetching services:', error);
        setError(error.message || 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId]);

  return { services, loading, error };
}
