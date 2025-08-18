
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  MapPin, 
  Filter, 
  Star, 
  Clock,
  ChevronDown,
  Map as MapIcon
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { featuredProviders } from "@/data/featuredProviders";

const Providers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("New York, NY");
  const [sortOrder, setSortOrder] = useState("rating");
  const [viewMode, setViewMode] = useState("list");
  
  // Filter providers based on search query
  const filteredProviders = featuredProviders.filter(provider => 
    provider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    provider.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Sort providers based on selected sort order
  const sortedProviders = [...filteredProviders].sort((a, b) => {
    switch (sortOrder) {
      case "rating":
        return b.rating - a.rating;
      case "price-low":
        return a.hourlyRate - b.hourlyRate;
      case "price-high":
        return b.hourlyRate - a.hourlyRate;
      default:
        return 0;
    }
  });
  
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Search Header */}
      <section className="bg-brand-500 text-white py-12 px-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-6 text-center">Find Service Professionals</h1>
          
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search service or provider name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white text-black w-full"
                />
              </div>
              
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 bg-white text-black w-full md:w-60"
                />
              </div>
              
              <Button className="bg-accent2-600 hover:bg-accent2-700">
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      {/* Filter Bar */}
      <div className="bg-gray-50 border-b py-4 px-4 sticky top-16 z-30">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-700">
              <span className="font-medium">{sortedProviders.length}</span> service providers found
            </p>
            
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <h4 className="font-medium mb-2">Rating</h4>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <input type="checkbox" id="rating-4plus" className="mr-2" />
                        <label htmlFor="rating-4plus" className="text-sm flex items-center">
                          <div className="flex">
                            {[...Array(4)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="h-4 w-4 text-gray-300" />
                          </div>
                          <span className="ml-1">& up</span>
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="rating-3plus" className="mr-2" />
                        <label htmlFor="rating-3plus" className="text-sm flex items-center">
                          <div className="flex">
                            {[...Array(3)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                            {[...Array(2)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-gray-300" />
                            ))}
                          </div>
                          <span className="ml-1">& up</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="border-t my-2 pt-2">
                      <h4 className="font-medium mb-2">Price Range</h4>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <input type="checkbox" id="price-economy" className="mr-2" />
                          <label htmlFor="price-economy" className="text-sm">$0 - $50/hr</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="price-standard" className="mr-2" />
                          <label htmlFor="price-standard" className="text-sm">$50 - $100/hr</label>
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="price-premium" className="mr-2" />
                          <label htmlFor="price-premium" className="text-sm">$100+/hr</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t my-2 pt-2">
                      <h4 className="font-medium mb-2">Verification</h4>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <input type="checkbox" id="verified-only" className="mr-2" />
                          <label htmlFor="verified-only" className="text-sm">Verified Providers Only</label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button size="sm" className="w-full">Apply Filters</Button>
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Sort By
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                    <DropdownMenuRadioItem value="rating">Highest Rated</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-low">Price: Low to High</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="price-high">Price: High to Low</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="hidden md:flex border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
                <Button
                  variant={viewMode === "map" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-l-none"
                  onClick={() => setViewMode("map")}
                >
                  <MapIcon className="h-4 w-4 mr-2" />
                  Map
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 py-8 px-4">
        <div className="container mx-auto">
          <Tabs value={viewMode} onValueChange={setViewMode} className="md:hidden mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <TabsContent value="list" className="mt-0">
            {sortedProviders.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {sortedProviders.map((provider) => (
                  <Card key={provider.id} className="overflow-hidden">
                    <div className="flex flex-col md:flex-row">
                      <div className="relative md:w-1/3 h-64 md:h-auto bg-gray-200">
                        <img
                          src={provider.coverImage}
                          alt={`${provider.name}'s service`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          {provider.verified && (
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
                              <AvatarImage src={provider.avatar} alt={provider.name} />
                              <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <h3 className="font-medium">{provider.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {provider.service}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-sm font-medium">{provider.rating}</span>
                            <span className="ml-1 text-xs text-gray-500">({provider.reviewCount} reviews)</span>
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center text-sm text-muted-foreground mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            {provider.location}
                            <span className="mx-2">•</span>
                            <Clock className="h-4 w-4 mr-1" />
                            {provider.responseTime}
                          </div>
                          <p className="mt-2">{provider.description}</p>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {provider.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="bg-gray-50">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-3 sm:mb-0">
                              <span className="block text-xl font-medium">
                                ${provider.hourlyRate}/hr
                              </span>
                              <span className="text-sm text-gray-500">
                                {provider.availability}
                              </span>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm">
                                Contact
                              </Button>
                              <Button size="sm">View Profile</Button>
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
                <h3 className="text-xl font-medium mb-2">No providers found</h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria to find more service providers.
                </p>
                <Button onClick={() => setSearchQuery("")} className="mt-4">
                  Clear Search
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="map" className="mt-0">
            <div className="bg-gray-200 rounded-lg map-pattern h-[600px] flex items-center justify-center">
              <div className="text-center p-8 bg-white/90 rounded-lg shadow-lg">
                <MapIcon className="h-12 w-12 text-brand-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium mb-2">Map View Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  We're working on implementing an interactive map to help you find service providers near you.
                </p>
                <Button onClick={() => setViewMode("list")}>
                  Switch to List View
                </Button>
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Providers;
