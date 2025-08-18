
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ServiceCategory } from '@/integrations/supabase/types.d';

export function useServiceCategories() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('service_categories')
          .select('*')
          .order('name');

        if (error) {
          throw error;
        }

        setCategories(data);
      } catch (error: any) {
        console.error('Error fetching service categories:', error);
        setError(error.message || 'Failed to fetch service categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}
