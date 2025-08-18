import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import MapView from "@/components/MapView";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, MapPin, Clock } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { featuredProviders } from "@/data/featuredProviders";

const ProfessionalsListing = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [professionals, setProfessionals] = useState(featuredProviders);
  const [viewMode, setViewMode] = useState("list");
  const mapboxToken = "pk.eyJ1IjoicmFtemFua2luZyIsImEiOiJjbWFwNjR1MmUwY2R5MmtzOGF1bGdqb2M5In0.taPWddRuRptrxDYmL6tB7A";
  
  // Extract the service name from location state or query params
  const serviceName = location.state?.serviceName || new URLSearchParams(location.search).get("service") || "";

  useEffect(() => {
    // In a real app, we would fetch professionals based on the service and user location
    // For now, we'll filter the demo data if a service is specified
    if (serviceName) {
      const filteredPros = featuredProviders.filter(pro => 
        pro.service.toLowerCase().includes(serviceName.toLowerCase())
      );
      
      if (filteredPros.length > 0) {
        setProfessionals(filteredPros);
      } else {
        // If no exact matches, we'll just show all professionals
        toast({
          title: "Limited Results",
          description: `We couldn't find exact matches for "${serviceName}". Showing all available professionals.`,
        });
      }
    }
  }, [serviceName]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Header */}
      <section className="bg-brand-500 text-white py-8 px-4">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {serviceName ? `Professional ${serviceName} Providers Near You` : "Service Professionals Near You"}
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
              {professionals.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {professionals.map((professional) => (
                    <Card key={professional.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="relative md:w-1/3 h-64 md:h-auto bg-gray-200">
                          <img
                            src={professional.coverImage}
                            alt={`${professional.name}'s service`}
                            className="w-full h-full object-cover"
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
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 text-sm font-medium">{professional.rating}</span>
                              <span className="ml-1 text-xs text-gray-500">({professional.reviewCount} reviews)</span>
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
                              {professional.tags.map((tag) => (
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
                                <Button variant="outline" size="sm">
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
                    {professionals.map((pro) => (
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

export default ProfessionalsListing;
