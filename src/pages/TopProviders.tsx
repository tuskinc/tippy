import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';

const TopProviders = () => {
  const [providers, setProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProviders();
  }, []);

  // Fetch top providers using the get_top_providers function
  const fetchTopProviders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_top_providers', {
        min_bookings: 5,
        limit_count: 10
      });
      if (error) throw error;
      setProviders(data || []);
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to load top providers', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      <div className="container mx-auto py-8 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-6">Tippy: Top Providers Leaderboard</h1>
        {loading ? (
          <div>Loading top providers...</div>
        ) : providers.length === 0 ? (
          <div>No top providers found.</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {providers.map((provider, idx) => (
              <Card key={provider.provider_id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <span className="text-xl font-bold">#{idx + 1}</span>
                    <Avatar>
                      {provider.provider_avatar ? (
                        <AvatarImage src={provider.provider_avatar} alt={provider.provider_name} />
                      ) : (
                        <AvatarFallback>{provider.provider_name?.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <span>{provider.provider_name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2">
                    <div><strong>Total Bookings:</strong> {provider.total_bookings}</div>
                    <div><strong>Rebooking Rate:</strong> {provider.rebooking_rate}%</div>
                    <div><strong>Average Rating:</strong> {provider.average_rating?.toFixed(2) ?? 'N/A'}</div>
                    <div><strong>Review Count:</strong> {provider.review_count}</div>
                    <div><strong>Trust Score:</strong> {provider.trust_score?.toFixed(2) ?? 'N/A'}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TopProviders; 