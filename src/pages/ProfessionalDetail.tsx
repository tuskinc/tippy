import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Professional, Service } from '@/integrations/supabase/types.d';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Phone, Mail, Calendar, Star, Briefcase } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ReviewsList from '@/components/ReviewsList';
import BookingAnalyticsSidebar from '@/components/BookingAnalyticsSidebar';

const ProfessionalDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [professional, setProfessional] = useState<Professional | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    const fetchProfessionalDetails = async () => {
      try {
        setLoading(true);
        
        const { data: professionalData, error: professionalError } = await supabase
          .from('professionals')
          .select('*')
          .eq('id', id)
          .single();
        
        if (professionalError) throw professionalError;
        
        const { data: servicesData, error: servicesError } = await supabase
          .from('professional_services')
          .select(`
            service:services(*)
          `)
          .eq('professional_id', id)
          .eq('is_available', true);
        
        if (servicesError) throw servicesError;
        
        setProfessional(professionalData);
        setServices(servicesData.map(item => item.service));
      } catch (error: any) {
        console.error('Error fetching professional details:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to load professional details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfessionalDetails();
  }, [id]);

  const handleBookService = (serviceId: string) => {
    navigate(`/booking?professional=${id}&service=${serviceId}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <div className="container mx-auto py-12 px-4 flex-1">
          <div className="text-center">Loading professional details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <div className="container mx-auto py-12 px-4 flex-1">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Professional Not Found</h1>
            <p className="mb-8">We couldn't find the professional you're looking for.</p>
            <Button asChild>
              <Link to="/professionals">Browse All Professionals</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center mb-6">
                  <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-200 mb-4">
                    {professional.profile_image_url ? (
                      <img
                        src={professional.profile_image_url}
                        alt={professional.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-brand-100 text-4xl font-bold text-brand-600">
                        {professional.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-bold text-center">{professional.name}</h1>
                  
                  <div className="flex items-center mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(professional.average_rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-transparent text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 font-medium">
                      {professional.average_rating.toFixed(1)} ({professional.review_count} reviews)
                    </span>
                  </div>
                  
                  {professional.is_verified && (
                    <div className="mt-2 bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      Verified Professional
                    </div>
                  )}
                </div>
                
                <div className="space-y-4">
                  {professional.bio && (
                    <div>
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-sm text-gray-600">{professional.bio}</p>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="font-medium mb-2">Contact Information</h3>
                    <div className="space-y-2">
                      {professional.email && (
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{professional.email}</span>
                        </div>
                      )}
                      {professional.phone && (
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{professional.phone}</span>
                        </div>
                      )}
                      {professional.city && professional.state && (
                        <div className="flex items-center text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {professional.city}, {professional.state}
                            {professional.zip_code && ` ${professional.zip_code}`}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Booking Analytics Sidebar: only show if professional has an id */}
            {professional.id && (
              <div className="mt-6">
                <BookingAnalyticsSidebar providerId={professional.id} />
              </div>
            )}
          </div>
          
          <div className="md:w-2/3">
            <Tabs defaultValue="services">
              <TabsList className="mb-4">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services">
                <h2 className="text-xl font-bold mb-4">Available Services</h2>
                {services.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    This professional has no available services at the moment.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {services.map((service) => (
                      <Card key={service.id} className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          {service.image_url && (
                            <div className="md:w-1/4 h-40 md:h-auto">
                              <img
                                src={service.image_url}
                                alt={service.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </div>
                          )}
                          <CardContent className={`p-6 ${service.image_url ? 'md:w-3/4' : 'w-full'}`}>
                            <h3 className="text-lg font-bold mb-2">{service.name}</h3>
                            {service.description && (
                              <p className="text-sm text-gray-600 mb-4">{service.description}</p>
                            )}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mt-4">
                              <div className="mb-3 sm:mb-0">
                                {service.price_range && (
                                  <div className="text-sm">
                                    <span className="font-medium">Price Range:</span> {service.price_range}
                                  </div>
                                )}
                                {service.estimated_duration && (
                                  <div className="text-sm flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    <span>{service.estimated_duration} minutes</span>
                                  </div>
                                )}
                              </div>
                              <Button onClick={() => handleBookService(service.id)}>
                                Book Now
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Client Reviews</h2>
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-medium">
                      {professional.average_rating.toFixed(1)} ({professional.review_count} reviews)
                    </span>
                  </div>
                </div>
                
                {id && <ReviewsList professionalId={id} />}

                <div className="mt-8 p-6 border-2 border-dashed rounded-lg text-center">
                  <h3 className="text-lg font-semibold mb-2">Have you worked with {professional.name}?</h3>
                  <p className="text-muted-foreground mb-4">
                    Leave a review after a completed booking to share your experience with the community.
                  </p>
                  <Button asChild>
                    <Link to="/bookings">Go to My Bookings</Link>
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfessionalDetail;
