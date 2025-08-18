
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, Navigation, User, MapPin, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TrackingStatusPanelProps {
  trackingSessionId?: string;
  className?: string;
}

export default function TrackingStatusPanel({ trackingSessionId, className }: TrackingStatusPanelProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingSession = async () => {
      try {
        if (!trackingSessionId) {
          // For demo, use dummy data if no session ID is provided
          setSession({
            status: 'ACTIVE',
            initial_eta: 1200, // 20 minutes in seconds
            start_time: new Date(Date.now() - 5 * 60 * 1000).toISOString() // Started 5 minutes ago
          });
          setLoading(false);
          return;
        }

        setLoading(true);
        // Using any type to bypass type checking issues
        const { data, error: fetchError } = await supabase
          .from('tracking_sessions')
          .select('*')
          .eq('id', trackingSessionId)
          .single();

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        setSession(data);
      } catch (err) {
        console.error('Error fetching tracking session:', err);
        setError('Failed to load tracking session data');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load tracking information",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingSession();

    // Subscribe to real-time updates for this session
    const subscription = supabase
      .channel(`tracking-${trackingSessionId}`)
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'tracking_sessions',
        filter: `id=eq.${trackingSessionId}`
      }, (payload) => {
        setSession(payload.new);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [trackingSessionId]);

  const formatTimeRemaining = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getStatusBadge = () => {
    if (!session) return <Badge>Unknown</Badge>;

    switch (session.status) {
      case 'ACTIVE':
        return <Badge className="bg-blue-500">En Route</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'CANCELLED':
        return <Badge className="bg-red-500">Cancelled</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  // Calculate estimated time remaining
  const getTimeRemaining = () => {
    if (!session || !session.initial_eta || !session.start_time) return 'Calculating...';
    
    const startTime = new Date(session.start_time).getTime();
    const currentTime = Date.now();
    const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
    const remainingSeconds = Math.max(0, session.initial_eta - elapsedSeconds);
    
    return formatTimeRemaining(remainingSeconds);
  };
  
  const handleContactProvider = () => {
    toast({
      title: "Contact Initiated",
      description: "Connecting you with the service provider...",
    });
  };

  if (loading) {
    return (
      <Card className={`animate-pulse ${className || ''}`}>
        <CardContent className="p-6">
          <p className="text-center py-8">Loading tracking status...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <p className="text-red-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 w-full"
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Service Provider Status</h3>
          {getStatusBadge()}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Estimated Time</p>
              <p className="font-medium">{getTimeRemaining()}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Navigation className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">
                {session?.status === 'ACTIVE' ? 'On the way to your location' : 
                 session?.status === 'COMPLETED' ? 'Service completed' : 'Status unknown'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <User className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Service Provider</p>
              <p className="font-medium">John Craftsman</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Service Location</p>
              <p className="font-medium">123 Main Street, Anytown</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-2 mt-6">
          <Button 
            onClick={handleContactProvider}
            className="w-full"
            variant={session?.status === 'COMPLETED' ? "secondary" : "default"}
          >
            {session?.status === 'COMPLETED' ? 
              <><Check className="h-4 w-4 mr-2" /> Service Completed</> : 
              'Contact Provider'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
