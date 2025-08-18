import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Info } from 'lucide-react';

interface BookingAnalyticsSidebarProps {
  providerId: string;
}

/**
 * BookingAnalyticsSidebar
 * Displays booking analytics for a provider in a compact, visually secondary card.
 * - Fetches stats from Supabase (booking_statistics view)
 * - Shows rebooking rate, total bookings, unique customers, etc.
 * - Responsive: sidebar on desktop, collapsible below reviews on mobile
 */
export default function BookingAnalyticsSidebar({ providerId }: BookingAnalyticsSidebarProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!providerId) return;
    setLoading(true);
    setError(null);
    supabase
      .from('booking_statistics')
      .select('*')
      .eq('provider_id', providerId)
      .single()
      .then(({ data, error }) => {
        if (error) setError(error.message);
        setStats(data);
        setLoading(false);
      });
  }, [providerId]);

  // Hide sidebar if not enough data
  if (loading) return <div className="p-4 text-sm text-muted-foreground">Loading booking stats...</div>;
  if (error || !stats || stats.total_bookings < 5) {
    return (
      <Card className="bg-muted border-muted-foreground/10">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-400" /> Booking Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            {error ? `Error: ${error}` : 'Not enough booking data yet.'}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Helper for color coding retention
  const retentionColor = stats.customer_retention_rate >= 60
    ? 'bg-green-200 text-green-800'
    : stats.customer_retention_rate >= 30
    ? 'bg-blue-100 text-blue-800'
    : 'bg-gray-100 text-gray-600';

  return (
    <Card className="bg-muted border-muted-foreground/10 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Info className="h-4 w-4 text-gray-400" /> Booking Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm">🔄 Rebooking Rate</span>
          <span className="font-semibold">{stats.rebooking_rate?.toFixed(1)}%</span>
        </div>
        <Progress value={stats.rebooking_rate} className="h-2 bg-gray-200" />
        <div className="flex items-center justify-between">
          <span className="text-sm">👥 Unique Customers</span>
          <span className="font-semibold">{stats.unique_customers}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">📈 Total Bookings</span>
          <span className="font-semibold">{stats.total_bookings}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm">📅 Last Booked</span>
          <span className="font-semibold">{stats.last_updated ? new Date(stats.last_updated).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div className={`flex items-center justify-between rounded px-2 py-1 text-xs font-medium ${retentionColor}`}
             title="% of customers who booked more than once">
          <span>Retention</span>
          <span>{stats.customer_retention_rate?.toFixed(1)}%</span>
        </div>
      </CardContent>
    </Card>
  );
} 