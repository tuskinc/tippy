
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, MapPin, Wifi, WifiOff, Navigation, Clock } from 'lucide-react';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { UserType } from '@/integrations/supabase/types.d';
import { useTracking } from '@/context/TrackingContext';
import { formatDistanceToNow } from 'date-fns';

interface LocationTrackerProps {
  jobId?: string;
  userType: UserType;
  className?: string;
}

export default function LocationTracker({ jobId, userType, className }: LocationTrackerProps) {
  const [enabled, setEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  
  const { trackingState } = useTracking();
  
  const { 
    isTracking, 
    position, 
    error,
    startTracking, 
    stopTracking 
  } = useLocationTracking({
    jobId,
    userType,
    enabled
  });

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle toggling tracking
  useEffect(() => {
    if (enabled && !isTracking) {
      startTracking();
    } else if (!enabled && isTracking) {
      stopTracking();
    }
  }, [enabled, isTracking, startTracking, stopTracking]);

  // Update last update time when position changes
  useEffect(() => {
    if (position) {
      setLastUpdateTime(new Date());
    }
  }, [position]);

  const getStatusColor = () => {
    if (!isOnline) return "text-red-500";
    if (enabled) return "text-green-500";
    return "text-yellow-500";
  };

  const getAccuracyPercentage = () => {
    if (!position?.coords.accuracy) return 0;
    // Lower is better for accuracy
    const accuracy = position.coords.accuracy;
    if (accuracy <= 5) return 100; // Excellent (≤5m)
    if (accuracy <= 10) return 80; // Very Good (5-10m)
    if (accuracy <= 20) return 60; // Good (10-20m)
    if (accuracy <= 50) return 40; // Moderate (20-50m)
    if (accuracy <= 100) return 20; // Poor (50-100m)
    return 10; // Very Poor (>100m)
  };

  return (
    <div className={`border rounded-lg p-4 ${className || ''}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-brand-500" />
          <h3 className="font-medium">Location Sharing</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isOnline ? (
            <Wifi className={`h-4 w-4 ${getStatusColor()}`} />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          <span className={getStatusColor()}>
            {isOnline ? (enabled ? "Tracking" : "Ready") : "Offline"}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-4">
        <Switch
          id="location-sharing"
          checked={enabled}
          onCheckedChange={setEnabled}
          disabled={!isOnline}
        />
        <Label htmlFor="location-sharing">
          {enabled ? "Location sharing is active" : "Location sharing is disabled"}
        </Label>
      </div>
      
      {position && enabled && (
        <div className="space-y-4 mb-4">
          <div className="bg-muted p-3 rounded-md text-sm">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium">GPS Accuracy</p>
              <span className="text-xs">{position.coords.accuracy.toFixed(1)}m</span>
            </div>
            <Progress value={getAccuracyPercentage()} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="text-xs text-muted-foreground mb-1">Coordinates</p>
              <p className="font-mono text-xs">
                {position.coords.latitude.toFixed(6)}, {position.coords.longitude.toFixed(6)}
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-md text-sm">
              <p className="text-xs text-muted-foreground mb-1">Speed</p>
              <p className="font-medium">
                {position.coords.speed 
                  ? `${(position.coords.speed * 3.6).toFixed(1)} km/h` 
                  : 'Not available'}
              </p>
            </div>
            
            {position.coords.heading !== null && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="flex items-center space-x-1">
                  <Navigation className="h-3 w-3" />
                  <p className="text-xs text-muted-foreground">Heading</p>
                </div>
                <p className="font-medium">{position.coords.heading.toFixed(0)}°</p>
              </div>
            )}
            
            {lastUpdateTime && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <p className="text-xs text-muted-foreground">Last Update</p>
                </div>
                <p className="font-medium">
                  {formatDistanceToNow(lastUpdateTime, { addSuffix: true })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {userType === 'PROVIDER' && trackingState.trackingStatus !== 'IDLE' && (
        <div className="bg-muted p-3 rounded-md mb-4 text-sm">
          <p className="font-medium mb-2">Current Job Status</p>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-medium">{trackingState.trackingStatus}</span>
            </div>
            {trackingState.eta !== null && (
              <div className="flex justify-between">
                <span>ETA:</span>
                <span className="font-medium">{trackingState.eta} min</span>
              </div>
            )}
            {trackingState.distance !== null && (
              <div className="flex justify-between">
                <span>Distance:</span>
                <span className="font-medium">
                  {trackingState.distance < 1000 
                    ? `${Math.round(trackingState.distance)} m` 
                    : `${(trackingState.distance / 1000).toFixed(1)} km`}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-destructive/20 p-3 rounded-md mb-4 text-sm flex items-start space-x-2">
          <AlertCircle className="h-4 w-4 mt-0.5 text-destructive" />
          <p className="text-destructive">{error}</p>
        </div>
      )}
      
      <Button 
        variant={enabled ? "destructive" : "default"} 
        onClick={() => setEnabled(!enabled)}
        disabled={!isOnline}
        className="w-full"
      >
        {enabled ? "Stop Sharing Location" : "Start Sharing Location"}
      </Button>
      
      {userType === 'PROVIDER' && trackingState.trackingStatus === 'TRAVELING' && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button 
            variant="outline"
            onClick={() => {
              // In a real app, this would launch the native maps app with navigation
              if (position) {
                const { latitude, longitude } = position.coords;
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${trackingState.customerLocation?.latitude},${trackingState.customerLocation?.longitude}`);
              }
            }}
            className="flex items-center justify-center"
            disabled={!trackingState.customerLocation}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Navigate
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => {
              // Update status to ARRIVED
              const tracking = require('@/context/TrackingContext').useTracking();
              tracking.updateTrackingStatus('ARRIVED');
            }}
          >
            Mark as Arrived
          </Button>
        </div>
      )}
    </div>
  );
}
