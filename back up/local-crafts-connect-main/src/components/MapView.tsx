import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTracking } from '@/context/TrackingContext';
import { Truck, MapPin, Navigation } from 'lucide-react';

interface MapViewProps {
  trackingSessionId?: string;
  jobId?: string;
  providerId?: string;
  customerId?: string;
  className?: string;
  mapboxAccessToken?: string;
}

interface LocationMarker {
  id: string;
  latitude: number;
  longitude: number;
  userType: 'PROVIDER' | 'CUSTOMER';
  timestamp: string;
  heading?: number | null;
}

export default function MapView({ 
  trackingSessionId, 
  jobId, 
  providerId,
  customerId,
  className,
  mapboxAccessToken = 'pk.eyJ1IjoicmFtemFua2luZyIsImEiOiJjbWFwNjR1MmUwY2R5MmtzOGF1bGdqb2M5In0.taPWddRuRptrxDYmL6tB7A' // Default token from the user's input
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const providerMarker = useRef<mapboxgl.Marker | null>(null);
  const customerMarker = useRef<mapboxgl.Marker | null>(null);
  const routeLine = useRef<mapboxgl.GeoJSONSource | null>(null);
  
  const [locations, setLocations] = useState<LocationMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  
  const { trackingState } = useTracking();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapInitialized) return;

    try {
      // Check if mapboxgl is available and a token is provided
      if (!mapboxAccessToken) {
        setError("Mapbox access token is required");
        return;
      }

      mapboxgl.accessToken = mapboxAccessToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        zoom: 12,
        center: [-122.4194, 37.7749], // Default center, will be updated
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      map.current.on('load', () => {
        // Add a route line source
        map.current?.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: []
            }
          }
        });

        // Add route line layer
        map.current?.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#4287f5',
            'line-width': 5,
            'line-opacity': 0.75
          }
        });

        routeLine.current = map.current?.getSource('route') as mapboxgl.GeoJSONSource;
        setMapInitialized(true);
      });

      return () => {
        map.current?.remove();
        map.current = null;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map');
    }
  }, [mapboxAccessToken]);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    if (trackingState.providerLocation && trackingState.customerLocation) {
      updateMarkers(trackingState.providerLocation, trackingState.customerLocation);
      updateRouteAndFitBounds(
        [trackingState.providerLocation.longitude, trackingState.providerLocation.latitude],
        [trackingState.customerLocation.longitude, trackingState.customerLocation.latitude]
      );
    } else {
      // For demo purposes, add some static locations if no real data is available
      if (!trackingSessionId && !jobId) {
        const demoProviderLocation = {
          id: 'provider-1',
          user_id: 'demo-provider',
          user_type: 'PROVIDER' as const,
          latitude: 37.7749,
          longitude: -122.4194,
          accuracy: 10,
          heading: 90,
          speed: 5,
          timestamp: new Date().toISOString(),
          job_id: 'demo-job'
        };
        
        const demoCustomerLocation = {
          id: 'customer-1',
          user_id: 'demo-customer',
          user_type: 'CUSTOMER' as const,
          latitude: 37.7848,
          longitude: -122.4294,
          accuracy: 10,
          heading: null,
          speed: null,
          timestamp: new Date().toISOString(),
          job_id: 'demo-job'
        };
        
        updateMarkers(demoProviderLocation, demoCustomerLocation);
        updateRouteAndFitBounds(
          [demoProviderLocation.longitude, demoProviderLocation.latitude],
          [demoCustomerLocation.longitude, demoCustomerLocation.latitude]
        );
      } else {
        fetchLocations();
      }
    }
  }, [trackingState.providerLocation, trackingState.customerLocation, mapInitialized]);

  const fetchLocations = async () => {
    try {
      setLoading(true);

      // Determine which query to use based on available params
      let query: any;
      
      if (jobId) {
        query = supabase
          .from('location_updates')
          .select('*')
          .eq('job_id', jobId)
          .order('timestamp', { ascending: false });
      } else if (trackingSessionId) {
        const { data: session } = await supabase
          .from('tracking_sessions')
          .select('*')
          .eq('id', trackingSessionId)
          .single();
          
        if (session && session.job_id) {
          query = supabase
            .from('location_updates')
            .select('*')
            .eq('job_id', session.job_id)
            .order('timestamp', { ascending: false });
        }
      }

      if (!query) {
        throw new Error('Insufficient parameters to fetch locations');
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw new Error(fetchError.message);

      if (data && data.length > 0) {
        // Group by user_type and get latest for each
        const providerData = data.find(item => item.user_type === 'PROVIDER');
        const customerData = data.find(item => item.user_type === 'CUSTOMER');
        
        if (providerData && customerData && map.current) {
          updateMarkers(providerData, customerData);
          updateRouteAndFitBounds(
            [providerData.longitude, providerData.latitude],
            [customerData.longitude, customerData.latitude]
          );
        }
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to load location data');
    } finally {
      setLoading(false);
    }
  };

  const updateMarkers = (providerData: any, customerData: any) => {
    if (!map.current) return;

    // Create or update provider marker
    if (!providerMarker.current) {
      // Create custom element for provider marker
      const providerElement = document.createElement('div');
      providerElement.className = 'provider-marker';
      providerElement.innerHTML = `
        <div class="flex items-center justify-center bg-blue-500 text-white rounded-full h-10 w-10 shadow-lg" style="transform: rotate(${providerData.heading || 0}deg)">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><path d="M4 13h16"/><path d="M16 18V9"/></svg>
        </div>
      `;
      
      providerMarker.current = new mapboxgl.Marker({
        element: providerElement,
        anchor: 'center'
      })
        .setLngLat([providerData.longitude, providerData.latitude])
        .addTo(map.current);
    } else {
      // Update existing marker with animation
      animateMarkerMovement(
        providerMarker.current,
        [providerData.longitude, providerData.latitude],
        providerData.heading
      );
    }

    // Create or update customer marker
    if (!customerMarker.current) {
      // Create custom element for customer marker
      const customerElement = document.createElement('div');
      customerElement.className = 'customer-marker';
      customerElement.innerHTML = `
        <div class="flex items-center justify-center bg-green-500 text-white rounded-full h-10 w-10 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
      `;
      
      customerMarker.current = new mapboxgl.Marker({
        element: customerElement,
        anchor: 'center'
      })
        .setLngLat([customerData.longitude, customerData.latitude])
        .addTo(map.current);
    } else {
      customerMarker.current.setLngLat([customerData.longitude, customerData.latitude]);
    }
  };

  // Animates the marker movement between positions
  const animateMarkerMovement = (
    marker: mapboxgl.Marker, 
    newPosition: [number, number],
    heading: number | null
  ) => {
    const currentPosition = marker.getLngLat();
    const startTime = performance.now();
    const duration = 1000; // Animation duration in milliseconds
    
    // Update marker element rotation for heading
    if (heading !== null) {
      const el = marker.getElement().querySelector('div') as HTMLElement;
      if (el) {
        el.style.transform = `rotate(${heading}deg)`;
      }
    }
    
    function animate(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Interpolate position
      const lng = currentPosition.lng + (newPosition[0] - currentPosition.lng) * progress;
      const lat = currentPosition.lat + (newPosition[1] - currentPosition.lat) * progress;
      
      marker.setLngLat([lng, lat]);
      
      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    }
    
    window.requestAnimationFrame(animate);
  };

  // Updates the route line and fits map bounds to show both markers
  const updateRouteAndFitBounds = async (
    providerPosition: [number, number],
    customerPosition: [number, number]
  ) => {
    if (!map.current || !routeLine.current) return;

    try {
      // For now, we'll just draw a straight line
      // In a production app, you would use the Mapbox Directions API to get a route
      const coordinates = [providerPosition, customerPosition];
      
      routeLine.current.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      });

      // Fit map to show both points with padding
      const bounds = new mapboxgl.LngLatBounds()
        .extend([providerPosition[0], providerPosition[1]])
        .extend([customerPosition[0], customerPosition[1]]);

      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000
      });
    } catch (error) {
      console.error('Error updating route:', error);
    }
  };

  if (error) {
    return (
      <Card className={`flex items-center justify-center ${className || ''}`}>
        <p className="text-red-500 p-4">{error}</p>
      </Card>
    );
  }

  return (
    <div className="relative">
      <div 
        ref={mapContainer} 
        className={`bg-muted rounded-lg ${className || 'h-64'}`}
      >
        {loading && !mapInitialized && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg">
            <p>Loading map...</p>
          </div>
        )}
      </div>
      
      {trackingState.eta !== null && trackingState.distance !== null && (
        <div className="absolute bottom-4 left-4 right-4 bg-white shadow-lg rounded-lg p-3 z-10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">ETA</p>
              <p className="text-xl font-bold">{trackingState.eta} min</p>
            </div>
            <div>
              <p className="text-sm font-medium">Distance</p>
              <p className="text-xl font-bold">
                {trackingState.distance < 1000 
                  ? `${Math.round(trackingState.distance)} m` 
                  : `${(trackingState.distance / 1000).toFixed(1)} km`}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-xl font-bold">{trackingState.trackingStatus}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
