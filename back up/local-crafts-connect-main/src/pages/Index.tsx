
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import ServiceCategoryCard from "@/components/ServiceCategoryCard";
import { Search, MapPin } from "lucide-react";
import { serviceCategories } from "@/data/serviceCategories";
import FeaturedProviders from "@/components/FeaturedProviders";
import HowItWorks from "@/components/HowItWorks";
import TestimonialSection from "@/components/TestimonialSection";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Hero Section */}
      <section className="hero-pattern relative px-4 py-20 md:py-32">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block text-gray-900">Find Local Service</span>
            <span className="block text-brand-500">Professionals Near You</span>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-gray-600 md:text-xl">
            Connect with trusted local professionals for all your service needs, right in your neighborhood.
          </p>
          
          <div className="mt-10 max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 p-2 bg-white rounded-lg shadow-lg">
              <div className="flex-1 flex items-center px-3 border rounded-md">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <Input 
                  type="text" 
                  placeholder="What service do you need?" 
                  className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center px-3 border rounded-md">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />
                <Input 
                  type="text" 
                  placeholder="Your location" 
                  className="border-none focus-visible:ring-0 focus-visible:ring-offset-0" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="shrink-0">
                Search
              </Button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Popular Services */}
      <section className="py-16 px-4" id="services">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Popular Service Categories</h2>
          <div className="services-grid">
            {serviceCategories.slice(0, 8).map((category) => (
              <ServiceCategoryCard key={category.id} category={category} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/services">View All Service Categories</Link>
            </Button>
          </div>
        </div>
      </section>
      
      {/* Featured Professionals */}
      <FeaturedProviders />
      
      {/* How It Works */}
      <HowItWorks />
      
      {/* Testimonials */}
      <TestimonialSection />
      
      {/* CTA Section */}
      <section className="bg-brand-50 py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 mb-8">
            Join thousands of customers and service providers on our platform.
            Start offering your services or find professionals near you today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" variant="default">
              <Link to="/register">Join as Customer</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/register/provider">Register as Service Provider</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
