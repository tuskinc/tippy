import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MapView from '@/components/MapView';
import LocationTracker from '@/components/LocationTracker';
import TrackingStatusPanel from '@/components/TrackingStatusPanel';
import LocationSharingPermissions from '@/components/LocationSharingPermissions';
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, MapPin, Calendar } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { TrackingProvider } from '@/context/TrackingContext';
import { Booking, Customer, Professional, Service } from '@/integrations/supabase/types.d';

type BookingDetails = Booking & {
  service: Pick<Service, 'name'>;
  professional: Pick<Professional, 'name'>;
  customer: Pick<Customer, 'name' | 'address' | 'city' | 'state' | 'zip_code'>;
};

interface JobDetails {
  id: string;
  status: string;
  scheduled_time: string;
  address: string;
  service: { name: string };
  provider: { name: string };
  customer: { name: string };
}

export default function TrackingMap() {
  const { trackingSessionId, jobId } = useParams<{ trackingSessionId?: string; jobId?: string }>();
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
  const [providerId, setProviderId] = useState<string | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [userType, setUserType] = useState<'PROVIDER' | 'CUSTOMER'>('CUSTOMER');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);

  // In a real app, you'd fetch the actual session data and determine user type
  useEffect(() => {
    const fetchSessionAndUserType = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const currentUserId = session?.user?.id;
        
        if (!currentUserId) {
          setError('You must be logged in to view tracking information.');
          return;
        }

        const bookingId = jobId || trackingSessionId;
        if (!bookingId) {
          setError('No booking ID provided for tracking.');
          setLoading(false);
          return;
        }

        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select(`
            id,
            customer_id,
            professional_id,
            status,
            scheduled_at,
            service:services(name),
            professional:professionals(name),
            customer:customers(name, address, city, state, zip_code)
          `)
          .eq('id', bookingId)
          .single();

        if (bookingError) throw bookingError;

        if (!bookingData) {
          setError('Booking not found.');
          setLoading(false);
          return;
        }
        
        const typedBookingData = bookingData as unknown as BookingDetails;

        const { customer } = typedBookingData;
        const addressParts = [customer.address, customer.city, customer.state, customer.zip_code].filter(Boolean);
        const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : 'Address not available';

        const jobDetailsData = {
          id: typedBookingData.id,
          status: typedBookingData.status,
          scheduled_time: typedBookingData.scheduled_at,
          address: fullAddress,
          service: { name: typedBookingData.service?.name || 'Service' },
          provider: { name: typedBookingData.professional?.name || 'Provider' },
          customer: { name: typedBookingData.customer?.name || 'Customer' }
        };

        setJobDetails(jobDetailsData);
        setProviderId(typedBookingData.professional_id);
        setCustomerId(typedBookingData.customer_id);

        if (currentUserId === typedBookingData.professional_id) {
          setUserType('PROVIDER');
        } else if (currentUserId === typedBookingData.customer_id) {
          setUserType('CUSTOMER');
        } else {
          setError('You are not authorized to view this tracking session.');
        }

      } catch (err) {
        console.error('Error fetching session data:', err);
        if (err instanceof Error) {
          setError(`Failed to load tracking session data: ${err.message}`);
        } else {
          setError('An unknown error occurred while fetching session data.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessionAndUserType();
  }, [jobId, trackingSessionId]);

  // Set up page title and content based on tracking role
  const pageTitle = userType === 'PROVIDER' ? 'Customer Location' : 'Service Provider Location';

  if (!jobId && !trackingSessionId) {
    // Handle case where no ID is in the URL.
    // The useEffect hook will also set an error, but this is a quicker feedback.
    return (
        <>
            <Navigation />
            <div className="container py-8 min-h-screen">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <p>No tracking session or job ID specified in the URL.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <Footer />
        </>
    );
  }

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
        <h1 className="text-2xl font-bold mb-6">Tippy: {pageTitle}</h1>
        
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
              trackingSessionId={trackingSessionId}
              jobId={jobId}
              providerId={providerId || undefined}
              customerId={customerId || undefined}
              className="h-[500px] shadow-md"
              mapboxAccessToken={mapboxToken}
            />
            
            {userType === 'PROVIDER' && (
              <LocationTracker 
                jobId={jobId!} 
                userType="PROVIDER" 
              />
            )}
            
            {userType === 'CUSTOMER' && (
              <TrackingStatusPanel 
                trackingSessionId={trackingSessionId!} 
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
                    jobId={jobId!} 
                    userType="CUSTOMER" 
                  />
                )}
                
                {userType === 'PROVIDER' && (
                  <TrackingStatusPanel 
                    trackingSessionId={trackingSessionId!} 
                  />
                )}
              </TabsContent>
              
              <TabsContent value="permissions" className="pt-2">
                <LocationSharingPermissions
                  jobId={jobId!}
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
