
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { UserType } from '@/integrations/supabase/types.d';
import { useAuth } from '@/components/AuthProvider';

interface LocationTrackingProps {
  jobId?: string;
  userType: UserType;
  enabled: boolean;
}

interface Position {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    heading?: number | null;
    speed?: number | null;
  };
  timestamp: number;
}

export function useLocationTracking({ jobId, userType, enabled }: LocationTrackingProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [position, setPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [watchId, setWatchId] = useState<number | null>(null);
  const { user } = useAuth();
  
  const saveLocationToDb = useCallback(async (pos: Position) => {
    try {
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const userId = user.id;
      
      const locationData = {
        user_id: userId,
        user_type: userType,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        heading: pos.coords.heading || null,
        speed: pos.coords.speed || null,
        timestamp: new Date().toISOString(),
        job_id: jobId || null
      };

      const { error: dbError } = await supabase
        .from('location_updates')
        .insert(locationData);

      if (dbError) {
        console.error('Error saving location:', dbError);
      }
    } catch (err) {
      console.error('Failed to save location:', err);
    }
  }, [jobId, userType, user]);

  const onSuccess = useCallback((pos: Position) => {
    setPosition(pos);
    setError(null);
    saveLocationToDb(pos);
  }, [saveLocationToDb]);

  const onError = useCallback((err: GeolocationPositionError) => {
    let message = 'Unknown error';
    if (err.code === 1) {
      message = 'Permission denied. Please enable location services.';
    } else if (err.code === 2) {
      message = 'Position unavailable. Please check your device settings.';
    } else if (err.code === 3) {
      message = 'Location request timed out. Please try again.';
    }
    
    setError(message);
    toast({
      variant: "destructive",
      title: "Location Error",
      description: message,
    });
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }
    
    if (watchId !== null) {
      return; // Already tracking
    }
    
    try {
      const id = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        {
          enableHighAccuracy: true,
          maximumAge: 10000, // 10 seconds
          timeout: 5000 // 5 seconds
        }
      );
      
      setWatchId(id);
      setIsTracking(true);
      toast({
        title: "Location Tracking Started",
        description: "Your location is now being shared",
      });
    } catch (err) {
      console.error('Error starting tracking:', err);
      setError('Failed to start location tracking');
    }
  }, [watchId, onSuccess, onError]);

  const stopTracking = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsTracking(false);
      toast({
        title: "Location Tracking Stopped",
        description: "Your location is no longer being shared",
      });
    }
  }, [watchId]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);
  
  // Handle enabled state changes
  useEffect(() => {
    if (enabled && !isTracking) {
      startTracking();
    } else if (!enabled && isTracking) {
      stopTracking();
    }
  }, [enabled, isTracking, startTracking, stopTracking]);

  return {
    isTracking,
    position,
    error,
    startTracking,
    stopTracking
  };
}
