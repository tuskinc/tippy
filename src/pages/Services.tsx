
import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceCategoryCard from "@/components/ServiceCategoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";
import { serviceDetails, ServiceDetail } from "@/data/serviceDetails";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchFromUrl = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(searchFromUrl);
  const [activeTab, setActiveTab] = useState("categories");
  const { toast } = useToast();
  
  // Update search query when URL parameter changes
  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
      
      // Show a toast notification if search query is present
      if (searchFromUrl.trim() !== "") {
        toast({
          title: "Searching for",
          description: `"${searchFromUrl}"`,
        });
      }
    }
  }, [searchFromUrl, toast]);
  
  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ search: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
  };
  
  const filteredCategories = useMemo(() => {
    return serviceCategories.filter(category => 
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);
  
  const filteredServices = useMemo(() => {
    return serviceDetails.filter(service => 
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // If we have search results in services but not in categories, automatically switch to services tab
  useEffect(() => {
    if (searchQuery && filteredCategories.length === 0 && filteredServices.length > 0) {
      setActiveTab("services");
    }
  }, [filteredCategories.length, filteredServices.length, searchQuery]);

  const groupedServices = useMemo(() => {
    const groups: Record<string, ServiceDetail[]> = {};
    
    filteredServices.forEach(service => {
      if (!groups[service.categoryId]) {
        groups[service.categoryId] = [];
      }
      groups[service.categoryId].push(service);
    });
    
    return groups;
  }, [filteredServices]);
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Header */}
      <section className="bg-brand-500 text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Tippy: Browse All Services</h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
            Discover professional services for all your needs. From home repairs to personal care, our providers have you covered.
          </p>
          
          <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white text-black pr-24"
            />
            <Button 
              type="submit" 
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8"
              size="sm"
            >
              Search
            </Button>
          </form>
        </div>
      </section>
      
      {/* Content Tabs */}
      <div className="container mx-auto mt-8 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="services">All Services</TabsTrigger>
          </TabsList>
          
          {/* Categories Tab */}
          <TabsContent value="categories">
            {filteredCategories.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-8">
                  {searchQuery ? `Search Results (${filteredCategories.length})` : 'All Service Categories'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                  {filteredCategories.map((category) => (
                    <ServiceCategoryCard key={category.id} category={category} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">No categories found</h2>
                <p className="text-gray-600 mb-6">We couldn't find any service categories matching your search.</p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSearchParams({});
                }}>
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
          
          {/* All Services Tab */}
          <TabsContent value="services">
            {filteredServices.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold mb-8">
                  {searchQuery ? `Search Results (${filteredServices.length})` : 'All Services'}
                </h2>
                
                {Object.entries(groupedServices).map(([categoryId, services]) => {
                  const category = serviceCategories.find(c => c.id === categoryId);
                  return (
                    <div key={categoryId} className="mb-12">
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-xl font-semibold">{category?.name || 'Other Services'}</h3>
                        <Badge variant="outline" className="text-xs">
                          {services.length} {services.length === 1 ? 'service' : 'services'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {services.map(service => (
                          <Card key={service.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                              <h4 className="font-medium mb-2">{service.name}</h4>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                              <div className="mt-4">
                                <Link 
                                  to={`/services/${category?.slug}/${service.slug}`}
                                  className="text-sm text-brand-600 hover:text-brand-800 font-medium"
                                >
                                  View details →
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold mb-4">No services found</h2>
                <p className="text-gray-600 mb-6">We couldn't find any services matching your search.</p>
                <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* CTA Section */}
      <section className="bg-gray-50 py-16 px-4 mt-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Don't see what you're looking for?</h2>
          <p className="max-w-2xl mx-auto text-gray-600 mb-8">
            If you can't find the service you need, or you're a professional who wants to offer a service not listed here, let us know.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="default" size="lg">Request a Service</Button>
            <Button variant="outline" size="lg">Contact Support</Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Services;
