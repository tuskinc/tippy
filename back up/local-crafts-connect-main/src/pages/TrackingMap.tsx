
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MapView from '@/components/MapView';
import LocationTracker from '@/components/LocationTracker';
import TrackingStatusPanel from '@/components/TrackingStatusPanel';
import LocationSharingPermissions from '@/components/LocationSharingPermissions';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, MapPin, Navigation as NavIcon, Clock, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { TrackingProvider } from '@/context/TrackingContext';
import { formatDistance } from 'date-fns';

export default function TrackingMap() {
  const { trackingSessionId, jobId } = useParams<{ trackingSessionId?: string; jobId?: string }>();
  const [mapboxToken, setMapboxToken] = useState<string>('pk.eyJ1IjoibG92YWJsZWRlbW8iLCJhIjoiY2xzcnJ3NG5nMHFsNjJrbzZ1ZWNoa280MiJ9.WFyZ3oaA-UYQasd4DL2VHA'); // Replace with actual token from env
  const [providerId, setProviderId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userType, setUserType] = useState<'PROVIDER' | 'CUSTOMER'>('CUSTOMER');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<any>(null);

  // For demo purposes, we're hardcoding a tracking session if none is provided
  const activeTrackingSessionId = trackingSessionId || 'demo-tracking-session';
  const activeJobId = jobId || 'demo-job-id';

  // In a real app, you'd fetch the actual session data and determine user type
  useEffect(() => {
    const fetchSessionAndUserType = async () => {
      try {
        setLoading(true);

        // Get current user
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;
        
        if (!currentUserId) {
          setError('You must be logged in to view tracking information');
          return;
        }

        // In a real app, fetch the actual tracking session
        // For demo purposes, we're setting some values
        setProviderId('demo-provider-id');
        setCustomerId('demo-customer-id');
        
        // Determine if the current user is a provider or customer
        // For demo, we're defaulting to CUSTOMER
        setUserType('CUSTOMER');

        // Fetch job details if available
        if (jobId) {
          // For demo purposes, we're using mock data since the 'jobs' table doesn't exist
          const mockJobData = {
            id: jobId,
            status: 'SCHEDULED',
            scheduled_time: new Date().toISOString(),
            address: '123 Main St, Anytown',
            service: {
              name: 'Plumbing Repair'
            },
            provider: {
              name: 'John Doe'
            },
            customer: {
              name: 'Jane Smith'
            }
          };
          
          setJobDetails(mockJobData);
        }
      } catch (err) {
        console.error('Error fetching session data:', err);
        setError('Failed to load tracking session data');
      } finally {
        setLoading(false);
      }
    };

    // Use a default token for the demo
    // In production, fetch this from your environment variables
    setMapboxToken('pk.eyJ1IjoibG92YWJsZWRlbW8iLCJhIjoiY2xzcnJ3NG5nMHFsNjJrbzZ1ZWNoa280MiJ9.WFyZ3oaA-UYQasd4DL2VHA');
    
    fetchSessionAndUserType();
  }, [trackingSessionId, jobId]);

  // Set up page title and content based on tracking role
  const pageTitle = userType === 'PROVIDER' ? 'Customer Location' : 'Service Provider Location';

  if (error) {
    return (
      <>
        <Navigation />
        <div className="container py-8 min-h-screen">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  if (loading) {
    return (
      <>
        <Navigation />
        <div className="container py-8 min-h-screen">
          <p className="text-center">Loading tracking information...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <TrackingProvider>
      <Navigation />
      <div className="container py-8">
        <h1 className="text-2xl font-bold mb-6">{pageTitle}</h1>
        
        {jobDetails && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{jobDetails.service.name}</h2>
                  <div className="flex items-center mt-1 text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span className="text-sm mr-4">
                      {new Date(jobDetails.scheduled_time).toLocaleString()}
                    </span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{jobDetails.address}</span>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <Badge variant={
                    jobDetails.status === 'SCHEDULED' ? 'outline' :
                    jobDetails.status === 'IN_PROGRESS' ? 'secondary' :
                    jobDetails.status === 'COMPLETED' ? 'default' : 'destructive'
                  }>
                    {jobDetails.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <MapView
              trackingSessionId={activeTrackingSessionId}
              jobId={activeJobId}
              providerId={providerId || undefined}
              customerId={customerId || undefined}
              className="h-[500px] shadow-md"
              mapboxAccessToken={mapboxToken}
            />
            
            {userType === 'PROVIDER' && (
              <LocationTracker 
                jobId={activeJobId} 
                userType="PROVIDER" 
              />
            )}
            
            {userType === 'CUSTOMER' && (
              <TrackingStatusPanel 
                trackingSessionId={activeTrackingSessionId} 
              />
            )}
          </div>
          
          <div className="space-y-6">
            <Tabs defaultValue="location">
              <TabsList className="grid grid-cols-2">
                <TabsTrigger value="location">Location</TabsTrigger>
                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="location" className="pt-2">
                {userType === 'CUSTOMER' && (
                  <LocationTracker 
                    jobId={activeJobId} 
                    userType="CUSTOMER" 
                  />
                )}
                
                {userType === 'PROVIDER' && (
                  <TrackingStatusPanel 
                    trackingSessionId={activeTrackingSessionId} 
                  />
                )}
              </TabsContent>
              
              <TabsContent value="permissions" className="pt-2">
                <LocationSharingPermissions
                  jobId={activeJobId}
                  granteeId={userType === 'CUSTOMER' ? providerId || '' : customerId || ''}
                />
              </TabsContent>
            </Tabs>
            
            <Card>
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">About Location Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Location data is only shared during active sessions and requires explicit permission from both parties.
                  Your privacy is important, and all location data is encrypted and stored securely.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </TrackingProvider>
  );
}
