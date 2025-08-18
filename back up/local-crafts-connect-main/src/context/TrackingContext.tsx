
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export interface LocationUpdate {
  id: string;
  user_id: string;
  user_type: 'PROVIDER' | 'CUSTOMER';
  latitude: number;
  longitude: number;
  accuracy: number;
  heading: number | null;
  speed: number | null;
  timestamp: string;
  job_id: string | null;
}

interface TrackingState {
  providerLocation: LocationUpdate | null;
  customerLocation: LocationUpdate | null;
  isTracking: boolean;
  eta: number | null; // ETA in minutes
  distance: number | null; // Distance in meters
  trackingStatus: 'TRAVELING' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'IDLE';
  arrivalTime: string | null;
}

interface TrackingContextType {
  trackingState: TrackingState;
  startTracking: (jobId: string) => void;
  stopTracking: () => void;
  updateTrackingStatus: (status: TrackingState['trackingStatus']) => void;
  hasArrived: boolean;
  isNearby: boolean;
}

const initialTrackingState: TrackingState = {
  providerLocation: null,
  customerLocation: null,
  isTracking: false,
  eta: null,
  distance: null,
  trackingStatus: 'IDLE',
  arrivalTime: null,
};

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export const TrackingProvider = ({ children }: { children: ReactNode }) => {
  const [trackingState, setTrackingState] = useState<TrackingState>(initialTrackingState);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [subscription, setSubscription] = useState<any>(null);

  // Computed values
  const hasArrived = trackingState.trackingStatus === 'ARRIVED' || 
                     trackingState.trackingStatus === 'IN_PROGRESS';
  const isNearby = !!trackingState.distance && trackingState.distance < 300; // Within 300 meters

  // Calculate ETA and distance when provider location changes
  useEffect(() => {
    if (trackingState.providerLocation && trackingState.customerLocation) {
      calculateETAAndDistance();
    }
  }, [trackingState.providerLocation, trackingState.customerLocation]);

  // Start tracking a job
  const startTracking = (jobId: string) => {
    setCurrentJobId(jobId);
    setTrackingState({
      ...trackingState,
      isTracking: true,
      trackingStatus: 'TRAVELING',
    });
    
    subscribeToLocationUpdates(jobId);
  };

  // Stop tracking
  const stopTracking = () => {
    if (subscription) {
      supabase.removeChannel(subscription);
    }
    
    setTrackingState(initialTrackingState);
    setCurrentJobId(null);
  };

  // Update tracking status
  const updateTrackingStatus = (status: TrackingState['trackingStatus']) => {
    setTrackingState({
      ...trackingState,
      trackingStatus: status,
    });
  };

  // Subscribe to real-time location updates
  const subscribeToLocationUpdates = (jobId: string) => {
    try {
      const channel = supabase
        .channel(`tracking-${jobId}`)
        .on('postgres_changes', { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'location_updates',
          filter: `job_id=eq.${jobId}`
        }, (payload) => {
          const locationUpdate = payload.new as LocationUpdate;
          
          if (locationUpdate.user_type === 'PROVIDER') {
            setTrackingState(prev => ({
              ...prev,
              providerLocation: locationUpdate,
            }));
          } else if (locationUpdate.user_type === 'CUSTOMER') {
            setTrackingState(prev => ({
              ...prev,
              customerLocation: locationUpdate,
            }));
          }
        })
        .subscribe();

      setSubscription(channel);
      
      // Also fetch the most recent locations
      fetchMostRecentLocations(jobId);
    } catch (error) {
      console.error('Error subscribing to location updates:', error);
      toast({
        title: 'Error',
        description: 'Failed to subscribe to location updates',
        variant: 'destructive',
      });
    }
  };

  // Fetch the most recent locations for the job
  const fetchMostRecentLocations = async (jobId: string) => {
    try {
      // Get provider location
      const { data: providerData, error: providerError } = await supabase
        .from('location_updates')
        .select('*')
        .eq('job_id', jobId)
        .eq('user_type', 'PROVIDER')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (providerError) throw providerError;
      
      // Get customer location
      const { data: customerData, error: customerError } = await supabase
        .from('location_updates')
        .select('*')
        .eq('job_id', jobId)
        .eq('user_type', 'CUSTOMER')
        .order('timestamp', { ascending: false })
        .limit(1);

      if (customerError) throw customerError;

      // Ensure the type is correct when updating state
      const typedProviderData = providerData && providerData.length > 0 ? 
        {
          ...providerData[0],
          user_type: providerData[0].user_type as 'PROVIDER' | 'CUSTOMER'
        } : null;
        
      const typedCustomerData = customerData && customerData.length > 0 ? 
        {
          ...customerData[0],
          user_type: customerData[0].user_type as 'PROVIDER' | 'CUSTOMER'
        } : null;

      setTrackingState(prev => ({
        ...prev,
        providerLocation: typedProviderData,
        customerLocation: typedCustomerData,
      }));
    } catch (error) {
      console.error('Error fetching recent locations:', error);
    }
  };

  // Calculate ETA and distance
  const calculateETAAndDistance = () => {
    try {
      if (!trackingState.providerLocation || !trackingState.customerLocation) {
        return;
      }

      const { latitude: providerLat, longitude: providerLng, speed } = trackingState.providerLocation;
      const { latitude: customerLat, longitude: customerLng } = trackingState.customerLocation;
      
      // Calculate distance in meters using Haversine formula
      const R = 6371e3; // Earth's radius in meters
      const φ1 = (providerLat * Math.PI) / 180;
      const φ2 = (customerLat * Math.PI) / 180;
      const Δφ = ((customerLat - providerLat) * Math.PI) / 180;
      const Δλ = ((customerLng - providerLng) * Math.PI) / 180;

      const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      // Calculate ETA in minutes
      let eta = null;
      if (speed && speed > 0) {
        // If we have speed, use it for ETA (speed is in m/s)
        eta = distance / speed / 60;
      } else {
        // Fallback: assume average urban travel speed (15 km/h = 4.17 m/s)
        eta = distance / 4.17 / 60;
      }

      // Round ETA to nearest minute, with minimum of 1 minute
      const roundedEta = Math.max(1, Math.round(eta));
      
      // Calculate arrival time
      const now = new Date();
      const arrivalTime = new Date(now.getTime() + roundedEta * 60000).toISOString();

      setTrackingState(prev => ({
        ...prev,
        eta: roundedEta,
        distance,
        arrivalTime,
      }));

      // Check if provider has arrived (within 50 meters)
      if (distance < 50 && trackingState.trackingStatus === 'TRAVELING') {
        updateTrackingStatus('ARRIVED');
        toast({
          title: 'Provider has arrived',
          description: 'The service provider has arrived at your location',
        });
      }
    } catch (error) {
      console.error('Error calculating ETA:', error);
    }
  };

  const value = {
    trackingState,
    startTracking,
    stopTracking,
    updateTrackingStatus,
    hasArrived,
    isNearby,
  };

  return (
    <TrackingContext.Provider value={value}>
      {children}
    </TrackingContext.Provider>
  );
};

export const useTracking = () => {
  const context = useContext(TrackingContext);
  if (context === undefined) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
};
