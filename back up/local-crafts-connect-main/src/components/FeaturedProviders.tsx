
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin } from "lucide-react";
import { featuredProviders } from "@/data/featuredProviders";

const FeaturedProviders = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">Featured Service Providers</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Discover our top-rated professionals with verified credentials and exceptional customer satisfaction
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProviders.map((provider) => (
            <Card key={provider.id} className="overflow-hidden">
              <div className="relative h-48 bg-gray-200">
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
              
              <CardContent className="pt-6 pb-4 px-6">
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
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {provider.location}
                  </div>
                  <p className="mt-2 text-sm line-clamp-2">{provider.description}</p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    {provider.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="bg-gray-50">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="font-medium">
                      From ${provider.hourlyRate}/hr
                    </span>
                    <Button size="sm" variant="outline">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-10">
          <Button asChild variant="default" size="lg">
            <a href="/providers">Browse All Providers</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProviders;
