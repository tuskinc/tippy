import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { serviceCategories } from "@/data/serviceCategories";
import { serviceDetails, ServiceDetail as ServiceDetailType } from "@/data/serviceDetails";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

const ServiceDetailPage = () => {
  const { categorySlug, serviceSlug } = useParams<{ categorySlug: string; serviceSlug?: string }>();
  const [category, setCategory] = useState<typeof serviceCategories[0] | null>(null);
  const [service, setService] = useState<ServiceDetailType | null>(null);
  const [categoryServices, setCategoryServices] = useState<ServiceDetailType[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    const foundCategory = serviceCategories.find(cat => cat.slug === categorySlug);
    setCategory(foundCategory || null);
    
    if (foundCategory) {
      const services = serviceDetails.filter(svc => svc.categoryId === foundCategory.id);
      setCategoryServices(services);
      
      if (serviceSlug) {
        const foundService = services.find(svc => svc.slug === serviceSlug);
        setService(foundService || null);
      } else {
        setService(null);
      }
    } else {
      setCategoryServices([]);
      setService(null);
    }
  }, [categorySlug, serviceSlug]);

  const handleBookService = () => {
    if (service) {
      navigate('/professionals', { 
        state: { 
          serviceName: service.name,
          serviceId: service.id
        }
      });
    }
  };
  
  if (!category) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        <div className="container mx-auto py-16 px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Service Category Not Found</h1>
          <p className="mb-8">We couldn't find the service category you're looking for.</p>
          <Button asChild>
            <Link to="/services">Browse All Services</Link>
          </Button>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (serviceSlug && service) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navigation />
        
        <div className="bg-gray-50 py-3 border-b">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-gray-500">
              <Link to="/" className="hover:text-gray-700">Home</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to="/services" className="hover:text-gray-700">Services</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <Link to={`/services/${category.slug}`} className="hover:text-gray-700">{category.name}</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span className="text-gray-900 font-medium">{service.name}</span>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto py-12 px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <Badge className="mb-4">{category.name}</Badge>
              <h1 className="text-3xl font-bold mb-4">Tippy: {category.name}</h1>
              <p className="text-lg mb-6">{service.description}</p>
            </div>
            <div className="flex space-x-4">
              <Button className="w-full" size="lg" onClick={handleBookService}>
                Book This Service
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                Get a Quote
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <div className="bg-gray-50 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-bold mb-4">What to expect</h2>
                <ul className="space-y-3">
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>Professional service providers with verified qualifications</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>Satisfaction guaranteed or your money back</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-brand-600">✓</span>
                    <span>Real-time tracking of service provider arrival</span>
                  </li>
                </ul>
              </div>
              
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">How it works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-100 text-brand-600 mb-3">1</div>
                    <h3 className="font-medium mb-2">Book your service</h3>
                    <p className="text-sm text-gray-500">Select a time that works for you and book instantly</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-100 text-brand-600 mb-3">2</div>
                    <h3 className="font-medium mb-2">Get matched with a pro</h3>
                    <p className="text-sm text-gray-500">We'll connect you with a qualified service provider</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-brand-100 text-brand-600 mb-3">3</div>
                    <h3 className="font-medium mb-2">Service completed</h3>
                    <p className="text-sm text-gray-500">Your pro arrives and completes the job to your satisfaction</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-bold mb-4">Frequently asked questions</h2>
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium mb-1">How much does this service typically cost?</h3>
                    <p className="text-sm text-gray-500">Prices vary depending on the project scope and provider. You'll receive exact quotes after booking.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium mb-1">Are the service providers background checked?</h3>
                    <p className="text-sm text-gray-500">Yes, all our providers undergo thorough background checks and verification processes.</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium mb-1">What if I'm not satisfied with the service?</h3>
                    <p className="text-sm text-gray-500">We offer a satisfaction guarantee. If you're not happy, we'll work to make it right or provide a refund.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold mb-6">Need help?</h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Need help choosing?</h3>
                    <p className="text-sm text-gray-500 mb-3">Not sure if this is the right service for you? Our team is here to help.</p>
                    <Button variant="link" className="p-0 h-auto">Contact Customer Support</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {categoryServices.length > 1 && (
          <div className="bg-gray-50 py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6">Other {category.name} Services</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categoryServices
                  .filter(s => s.id !== service.id)
                  .slice(0, 4)
                  .map(relatedService => (
                    <Card key={relatedService.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <h4 className="font-medium mb-2">{relatedService.name}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{relatedService.description}</p>
                        <Link 
                          to={`/services/${category.slug}/${relatedService.slug}`}
                          className="text-sm text-brand-600 hover:text-brand-800 font-medium"
                        >
                          View details →
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="bg-gray-50 py-3 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">Home</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <Link to="/services" className="hover:text-gray-700">Services</Link>
            <ChevronRight className="h-4 w-4 mx-1" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </div>
        </div>
      </div>
      
      <div 
        className={`py-16 px-4 text-center ${category.color.split(' ').shift()} bg-opacity-20`}
      >
        <div className="container mx-auto">
          <div 
            className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4 ${category.color}`}
            dangerouslySetInnerHTML={{ __html: category.icon }}
          />
          <h1 className="text-3xl font-bold mb-4">Tippy: {category.name}</h1>
          <p className="max-w-2xl mx-auto text-lg">{category.description}</p>
        </div>
      </div>
      
      <div className="container mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold mb-6">{category.name} Services</h2>
        
        {categoryServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categoryServices.map(service => (
              <Card key={service.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <h3 className="font-medium text-lg mb-2">{service.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Button asChild>
                    <Link to={`/services/${category.slug}/${service.slug}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="mb-6">No services found in this category.</p>
            <Button asChild>
              <Link to="/services">Browse All Services</Link>
            </Button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ServiceDetailPage;
