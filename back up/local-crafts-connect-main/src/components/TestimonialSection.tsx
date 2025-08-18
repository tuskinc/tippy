
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { testimonials } from "@/data/testimonials";

const TestimonialSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const currentTestimonial = testimonials[currentIndex];
  
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="max-w-4xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`h-5 w-5 ${i < currentTestimonial.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                
                <p className="text-lg italic mb-6">"{currentTestimonial.testimonial}"</p>
                
                <Avatar className="h-16 w-16 mb-4">
                  <AvatarImage src={currentTestimonial.avatar} alt={currentTestimonial.name} />
                  <AvatarFallback>{currentTestimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-medium">{currentTestimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {currentTestimonial.role}, {currentTestimonial.location}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8 space-x-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={prevTestimonial}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous testimonial</span>
            </Button>
            
            <Button 
              variant="outline" 
              size="icon" 
              onClick={nextTestimonial}
              className="rounded-full"
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next testimonial</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
