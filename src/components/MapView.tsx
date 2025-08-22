/* eslint-disable react-hooks/exhaustive-deps */
import { useCallback, useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useTracking } from '@/context/TrackingContext';

import axios from 'axios';
// Remove: import { PostgrestFilterBuilder } from '@supabase/supabase-js';

// Provider interface: no index signature
interface Provider {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  // Add more fields as needed
}

// ProviderEta interface: no index signature
interface ProviderEta extends Provider {
  providerId: string;
  eta: number | null;
  distance: number | null;
}

interface LocationUpdate {
  id: string;
  user_id: string;
  user_type: 'PROVIDER' | 'CUSTOMER';
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number | null;
  timestamp: string;
  job_id?: string | null;
}

// 1. Re-add MapViewProps interface
interface MapViewProps {
  trackingSessionId?: string;
  jobId?: string;
  className?: string;
  mapboxAccessToken?: string;
}

// 2. Re-add MapboxDirectionsResponse interface
interface MapboxDirectionsResponse {
  routes: Array<{
    duration: number;
    distance: number;
    geometry: {
      coordinates: [number, number][];
    };
  }>;
}

export default function MapView({ 
  trackingSessionId, 
  jobId, 
  className,
  mapboxAccessToken = 'pk.eyJ1IjoicmFtemFua2luZyIsImEiOiJjbWF5NDJpYXIwNG05MnZyMGZhdTZwYTMzIn0.2iCcjmocpG4aAnbQ9jyCuQ' // Updated token from user
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const providerMarker = useRef<mapboxgl.Marker | null>(null);
  const customerMarker = useRef<mapboxgl.Marker | null>(null);
  const routeLine = useRef<mapboxgl.GeoJSONSource | null>(null);
  
    
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);
  const [userLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [nearbyProviders, setNearbyProviders] = useState<Provider[]>([]);
  const [providerEtas, setProviderEtas] = useState<ProviderEta[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);
  
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

  const fetchLocations = useCallback(async () => {
    if (!jobId && !trackingSessionId) return;
    try {
      setLoading(true);

      // Determine which query to use based on available params
      let query: any; // eslint-disable-line @typescript-eslint/no-explicit-any
      
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
        const providerData = (data as LocationUpdate[]).find((item: LocationUpdate) => item.user_type === 'PROVIDER');
        const customerData = (data as LocationUpdate[]).find((item: LocationUpdate) => item.user_type === 'CUSTOMER');
        
        if (providerData && customerData && map.current) {
          updateMarkers(providerData || null, customerData || null);
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
  }, [jobId, trackingSessionId]);

  useEffect(() => {
    if (jobId || trackingSessionId) {
      const interval = setInterval(fetchLocations, 5000); // Poll every 5 seconds
      fetchLocations(); // Initial fetch
      return () => clearInterval(interval);
    }
  }, [jobId, trackingSessionId, fetchLocations]);

  const updateMarkers = useCallback((providerData: LocationUpdate | null, customerData: LocationUpdate | null) => {
    if (!map.current) return;

    if (providerData) {
    if (!providerMarker.current) {
      const providerElement = document.createElement('div');
        providerElement.className = 'w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white';
        providerElement.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>`;

      providerMarker.current = new mapboxgl.Marker({
        element: providerElement,
        anchor: 'center'
      })
        .setLngLat([providerData.longitude, providerData.latitude])
          .addTo(map.current!);
    } else {
      animateMarkerMovement(
        providerMarker.current,
        [providerData.longitude, providerData.latitude]
      );
      }
    }

    if (customerData) {
    if (!customerMarker.current) {
      const customerElement = document.createElement('div');
        customerElement.className = 'w-4 h-4 bg-green-500 rounded-full border-2 border-white';

      customerMarker.current = new mapboxgl.Marker({
        element: customerElement,
        anchor: 'center'
      })
        .setLngLat([customerData.longitude, customerData.latitude])
          .addTo(map.current!);
    } else {
      customerMarker.current.setLngLat([customerData.longitude, customerData.latitude]);
    }
    }
  }, [mapInitialized]);

  const animateMarkerMovement = useCallback(
    (
    marker: mapboxgl.Marker, 
    newPosition: [number, number]
  ) => {
    const currentPosition = marker.getLngLat();
    const startTime = performance.now();
    const duration = 1000; // Animation duration in milliseconds
    
    function animate(time: number) {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const lng = currentPosition.lng + (newPosition[0] - currentPosition.lng) * progress;
      const lat = currentPosition.lat + (newPosition[1] - currentPosition.lat) * progress;
      
      marker.setLngLat([lng, lat]);
      
      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    }
    
    window.requestAnimationFrame(animate);
    },
    []
  );

  const updateRouteAndFitBounds = useCallback(
    async (
    providerPosition: [number, number],
    customerPosition: [number, number]
  ) => {
    if (!map.current || !routeLine.current) return;
    try {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${providerPosition[0]},${providerPosition[1]};${customerPosition[0]},${customerPosition[1]}?geometries=geojson&access_token=${mapboxAccessToken}`;
        const res = await axios.get<MapboxDirectionsResponse>(url);
      const route = res.data.routes[0];
      const coordinates = route ? route.geometry.coordinates : [providerPosition, customerPosition];
      routeLine.current.setData({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates
        }
      });
      const bounds = new mapboxgl.LngLatBounds();
      coordinates.forEach((coord: [number, number]) => bounds.extend(coord));
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        duration: 1000
      });
    } catch (error) {
      console.error('Error updating route:', error);
    }
    },
    [mapInitialized, mapboxAccessToken]
  );

  const fetchProviderEtas = useCallback(async (providers: Provider[]) => {
    if (!userLocation) return;
    const results = await Promise.all(providers.map(async (provider: Provider) => {
      try {
        const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${provider.longitude},${provider.latitude};${userLocation.lng},${userLocation.lat}?access_token=${mapboxAccessToken}`;
        const res = await axios.get<MapboxDirectionsResponse>(url);
        const route = res.data.routes[0];
        return {
          providerId: provider.id,
          eta: Math.round(route.duration / 60), // minutes
          distance: route.distance, // meters
          ...provider
        };
      } catch {
        return { providerId: provider.id, eta: null, distance: null, ...provider };
      }
    }));
    setProviderEtas(results.filter(r => r !== null) as ProviderEta[]);
  }, [userLocation, mapboxAccessToken]);

  const fetchNearbyProviders = useCallback(async () => {
    try {
      setLoading(true);
      // 3. Remove type arguments from supabase.rpc and cast data as Provider[]
      const { data } = await supabase.rpc(
        'get_nearby_providers',
        {
          user_lat: userLocation!.lat,
          user_lng: userLocation!.lng,
          radius_km: 10
        }
      );
      setNearbyProviders((data as Provider[]) ?? []);
      fetchProviderEtas((data as Provider[]) ?? []);
    } catch (err) {
      setError('Failed to fetch nearby providers');
    } finally {
      setLoading(false);
    }
  }, [userLocation, trackingSessionId, jobId, fetchProviderEtas]);

  // Ensure fetchNearbyProviders is only called inside this useEffect:
  useEffect(() => {
    if (userLocation && !trackingSessionId && !jobId) {
      fetchNearbyProviders();
    }
  }, [userLocation, trackingSessionId, jobId, fetchNearbyProviders]);

  useEffect(() => {
    if (selectedProviderId && userLocation && nearbyProviders.length > 0) {
      const provider = nearbyProviders.find(p => p.id === selectedProviderId);
      if (provider) {
        updateRouteAndFitBounds(
          [provider.longitude, provider.latitude],
          [userLocation.lng, userLocation.lat]
        );
      }
    }
  }, [selectedProviderId, userLocation, nearbyProviders, updateRouteAndFitBounds]);

  if (error) {
    return (
      <Card className={`flex items-center justify-center ${className || ''}`}>
        <p className="text-red-500 p-4">{error}</p>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Map container: must be empty for Mapbox */}
      <div 
        ref={mapContainer} 
        className={`min-h-[400px] bg-muted rounded-lg ${className || 'h-64'} outline-none focus:ring-2 focus:ring-blue-500`}
        tabIndex={0}
        aria-label="Map view showing providers and your location"
      />
      {/* Loading overlay: absolutely positioned over the map */}
        {loading && !mapInitialized && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 rounded-lg pointer-events-none">
            <p>Loading map...</p>
          </div>
        )}
      {/* Sidebar for provider ETAs */}
      {(!trackingSessionId && !jobId && providerEtas.length > 0) && (
        <aside className="absolute top-4 right-4 w-80 bg-white shadow-lg rounded-lg p-4 z-20 max-h-[80vh] overflow-y-auto" aria-label="Nearby providers">
          <h3 className="text-lg font-semibold mb-3">Nearby Providers</h3>
          {providerEtas.map((provider: ProviderEta) => (
            <div
              key={provider.providerId}
              className={`p-2 rounded-lg mb-2 cursor-pointer ${selectedProviderId === provider.providerId ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
              onClick={() => setSelectedProviderId(provider.providerId)}
              tabIndex={0}
              aria-label={`Provider ${provider.name}, ETA ${provider.eta !== null ? provider.eta + ' min' : 'N/A'}`}
              onKeyDown={e => { if (e.key === 'Enter') setSelectedProviderId(provider.providerId); }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{provider.name}</span>
                <span className="text-xs text-gray-500">{provider.eta !== null ? `${provider.eta} min` : 'N/A'}</span>
              </div>
              <div className="text-xs text-gray-500">{provider.distance !== null ? `${(provider.distance / 1000).toFixed(1)} km` : ''}</div>
            </div>
          ))}
        </aside>
      )}
      {/* Map legend/help button */}
      <button
        className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg p-2 z-30 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Show map legend"
        onClick={() => toast({ title: 'Map Legend', description: 'Green: You\'re here. Blue: Provider. Red: Selected provider.' })}
      >
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      </button>
      {/* Bottom panel for tracking session */}
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
