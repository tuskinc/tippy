import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MapView from "@/components/MapView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Clock, Repeat } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Types
interface BookingStats { total_rebookings: number; rebooking_rate: number; }
interface RawProfile {
  user_id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  service_category: string;
  location: string;
  hourly_rate: number;
  verified: boolean;
  booking_statistics: BookingStats[];
}

interface Professional {
  id: string;
  name: string;
  avatar: string;
  service: string;
  rating: number;
  reviewCount: number;
  location: string;
  responseTime: string;
  description: string;
  tags: string[];
  hourlyRate: number;
  availability: string;
  coverImage: string;
  verified: boolean;
  total_rebookings: number;
  rebooking_rate: number;
}

// React Query client (move to App.tsx for global use in a real app)
const queryClient = new QueryClient();

// Custom hook to fetch professionals with React Query
function useProfessionals(serviceName: string) {
  return useQuery<Professional[]>({
    queryKey: ['professionals', serviceName],
    queryFn: async () => {
    let query = supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        avatar_url,
        business_name,
        service_category,
        location,
        hourly_rate,
        verified,
        booking_statistics (
          total_rebookings,
          rebooking_rate
        )
      `)
      .eq('user_type', 'PROVIDER');
    if (serviceName) {
      query = query.ilike('service_category', `%${serviceName}%`);
    }
    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data || []).map((pro: RawProfile) => ({
      id: pro.user_id,
      name: `${pro.first_name} ${pro.last_name}`,
      avatar: pro.avatar_url,
      service: pro.service_category,
      rating: 4.5,
      reviewCount: 50,
      location: pro.location,
      responseTime: "Responds in 2 hours",
      description: `Licensed professional for ${pro.service_category}.`,
      tags: ["Licensed", "Residential"],
      hourlyRate: pro.hourly_rate,
      availability: "Available today",
      coverImage: 'https://via.placeholder.com/400x300.png',
      verified: pro.verified,
      total_rebookings: pro.booking_statistics[0]?.total_rebookings || 0,
      rebooking_rate: pro.booking_statistics[0]?.rebooking_rate || 0
    }));
  },
  });
}

const ProfessionalsListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const serviceName = location.state?.serviceName || new URLSearchParams(location.search).get("service") || "";
  const [viewMode, setViewMode] = useState("list");
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';
  // Use React Query for professionals
  const { data: professionals = [], isLoading, error } = useProfessionals(serviceName);

  if (isLoading) return <div className="text-center py-12">Loading professionals...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error loading professionals: {error.message}</div>;

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Header */}
      <section className="bg-brand-500 text-white py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {serviceName ? `Tippy: Professional ${serviceName} Providers Near You` : "Tippy: Service Professionals Near You"}
          </h1>
          <p className="max-w-3xl text-brand-50">
            Choose from our highly-rated professionals ready to help with your service needs
          </p>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <Tabs defaultValue={viewMode} onValueChange={setViewMode} className="mb-6">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list" className="mt-0">
              {isLoading ? (
                 <div className="text-center py-12">Loading professionals...</div>
              ) : professionals.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {professionals.map((professional: Professional) => (
                    <Card key={professional.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-1/3 h-64 md:h-auto bg-gray-200">
                          <img
                            src={professional.coverImage}
                            alt={`${professional.name}'s service`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute top-4 right-4">
                            {professional.verified && (
                              <Badge variant="secondary" className="bg-white">
                                Verified Pro
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <CardContent className="p-6 md:w-2/3">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center">
                              <Avatar className="h-12 w-12 border-2 border-white shadow">
                                <AvatarImage src={professional.avatar} alt={professional.name} />
                                <AvatarFallback>{professional.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="ml-3">
                                <h3 className="font-medium">{professional.name}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {professional.service}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="flex items-center justify-end">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-sm font-medium">{professional.rating}</span>
                              <span className="ml-1 text-xs text-gray-500">({professional.reviewCount} reviews)</span>
                              </div>
                              <div className="flex items-center justify-end mt-1 text-xs text-muted-foreground">
                                <Repeat className="h-3 w-3 mr-1 text-green-600"/>
                                <span>{professional.total_rebookings} re-bookings</span>
                                <span className="mx-1">·</span>
                                <span>{`${(professional.rebooking_rate * 100).toFixed(0)}% rate`}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-4">
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {professional.location}
                              <span className="mx-2">•</span>
                              <Clock className="h-4 w-4 mr-1" />
                              {professional.responseTime}
                            </div>
                            <p className="mt-2">{professional.description}</p>
                            
                            <div className="mt-4 flex flex-wrap gap-2">
                              {professional.tags.map((tag: string) => (
                                <Badge key={tag} variant="outline" className="bg-gray-50">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                              <div className="mb-3 sm:mb-0">
                                <span className="block text-xl font-medium">
                                  ${professional.hourlyRate}/hr
                                </span>
                                <span className="text-sm text-gray-500">
                                  {professional.availability}
                                </span>
                              </div>
                              
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm" onClick={() => navigate(`/messages/${professional.id}`)}>
                                  Contact
                                </Button>
                                <Button size="sm">Book Now</Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No professionals found</h3>
                  <p className="text-gray-600 mb-4">
                    We couldn't find any service providers for this service in your area.
                  </p>
                  <Button onClick={() => navigate("/services")}>
                    Browse All Services
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="map" className="mt-0">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Map View */}
                <div className="h-[70vh]">
                  <MapView 
                    mapboxAccessToken={mapboxToken}
                    className="h-full"
                  />
                </div>
                
                {/* Professionals List - Condensed */}
                <div className="p-4 border-t">
                  <h3 className="font-medium mb-4">Nearby Professionals</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {professionals.map((pro: Professional) => (
                      <div key={pro.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={pro.avatar} alt={pro.name} />
                          <AvatarFallback>{pro.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{pro.name}</div>
                          <div className="text-xs text-gray-500">{pro.location}</div>
                        </div>
                        <div className="text-sm font-medium">${pro.hourlyRate}/hr</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

// Wrap ProfessionalsListing with QueryClientProvider for React Query
export default function ProfessionalsListingWithQuery() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProfessionalsListing />
    </QueryClientProvider>
  );
}
