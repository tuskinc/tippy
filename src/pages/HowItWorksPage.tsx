
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Search, Calendar, Star, MapPin, CheckCircle, MessageSquare } from "lucide-react";

const HowItWorksPage = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      {/* Header */}
      <section className="bg-brand-500 text-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-6">How Tippy Works</h1>
          <p className="max-w-2xl mx-auto text-lg opacity-90">
            Find, book, and receive quality services from local professionals in just a few simple steps
          </p>
        </div>
      </section>
      
      {/* Process Overview */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-brand-100 text-brand-700 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-medium mb-2">1. Search for Services</h3>
              <p className="text-gray-600">
                Browse through categories or search for specific services in your area. Filter by location, price, rating, and availability.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent2-100 text-accent2-700 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-medium mb-2">2. Book an Appointment</h3>
              <p className="text-gray-600">
                Select a service provider, choose a convenient time slot, and book your appointment. Receive instant confirmation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-amber-100 text-amber-700 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Star className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-medium mb-2">3. Get Quality Service</h3>
              <p className="text-gray-600">
                Receive professional service at your location. After completion, leave a review to help others in the community.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Detailed Steps */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Detailed Walkthrough</h2>
          
          <div className="space-y-16">
            {/* Step 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="p-1 bg-white rounded-lg shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Search for services" 
                    className="w-full h-auto rounded"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <span className="inline-block bg-brand-100 text-brand-700 px-3 py-1 rounded-full text-sm font-medium mb-2">Step 1</span>
                <h3 className="text-2xl font-bold mb-4">Finding the Right Service</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-brand-500 mr-3 shrink-0" />
                    <p>Browse service categories or use the search bar to find specific services</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-brand-500 mr-3 shrink-0" />
                    <p>Enter your location to see providers in your area</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-brand-500 mr-3 shrink-0" />
                    <p>Filter results by price, rating, availability, and specific skills</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-brand-500 mr-3 shrink-0" />
                    <p>View detailed profiles with reviews, photos of past work, and service details</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <span className="inline-block bg-accent2-100 text-accent2-700 px-3 py-1 rounded-full text-sm font-medium mb-2">Step 2</span>
                <h3 className="text-2xl font-bold mb-4">Booking Your Service</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-accent2-600 mr-3 shrink-0" />
                    <p>Select a service provider based on their profile, pricing, and availability</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-accent2-600 mr-3 shrink-0" />
                    <p>Choose from available time slots that fit your schedule</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-accent2-600 mr-3 shrink-0" />
                    <p>Provide details about your service needs and location</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-accent2-600 mr-3 shrink-0" />
                    <p>Receive instant confirmation and appointment details</p>
                  </div>
                </div>
              </div>
              <div className="md:w-1/2">
                <div className="p-1 bg-white rounded-lg shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Book an appointment" 
                    className="w-full h-auto rounded"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2 order-2 md:order-1">
                <div className="p-1 bg-white rounded-lg shadow-lg">
                  <img 
                    src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Get quality service" 
                    className="w-full h-auto rounded"
                    loading="lazy"
                  />
                </div>
              </div>
              <div className="md:w-1/2 order-1 md:order-2">
                <span className="inline-block bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium mb-2">Step 3</span>
                <h3 className="text-2xl font-bold mb-4">Receiving Your Service</h3>
                <div className="space-y-4">
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-amber-600 mr-3 shrink-0" />
                    <p>Provider arrives at your location and completes the service as scheduled</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-amber-600 mr-3 shrink-0" />
                    <p>Rate your experience and leave feedback for the provider</p>
                  </div>
                  <div className="flex">
                    <CheckCircle className="h-6 w-6 text-amber-600 mr-3 shrink-0" />
                    <p>Your location is <strong>only shared with your explicit permission</strong> and is used solely to connect you with local professionals. You can control location sharing at any time in your settings.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose LocalPro</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-brand-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="font-medium mb-2">Verified Professionals</h3>
              <p className="text-gray-600">
                All service providers undergo background checks and credential verification
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="font-medium mb-2">Location-Based Matching</h3>
              <p className="text-gray-600">
                Find professionals in your area with real-time availability
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="font-medium mb-2">Secure Communication</h3>
              <p className="text-gray-600">
                In-app messaging keeps your conversations organized and secure
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-brand-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-brand-500" />
              </div>
              <h3 className="font-medium mb-2">Trusted Reviews</h3>
              <p className="text-gray-600">
                Verified customer reviews help you make informed decisions
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-16 px-4 bg-brand-500 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="max-w-2xl mx-auto text-lg opacity-90 mb-8">
            Join thousands of customers finding reliable service professionals in their area.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/services">Browse Services</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10" asChild>
              <Link to="/register">Create an Account</Link>
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
