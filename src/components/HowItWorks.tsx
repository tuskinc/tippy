
import { cn } from "@/lib/utils";
import { Search, Calendar, Star } from "lucide-react";

const steps = [
  {
    icon: <Search className="h-10 w-10" />,
    title: "Search for Services",
    description: "Browse through our wide range of services and professionals in your area.",
    color: "bg-brand-100 text-brand-700",
  },
  {
    icon: <Calendar className="h-10 w-10" />,
    title: "Book an Appointment",
    description: "Choose a convenient time and date for the service you need.",
    color: "bg-accent2-100 text-accent2-700",
  },
  {
    icon: <Star className="h-10 w-10" />,
    title: "Get Quality Service",
    description: "Receive professional service and leave a review to help others.",
    color: "bg-amber-100 text-amber-700",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How LocalPro Works</h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Our platform makes it easy to find, book, and receive professional services in your area.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 right-0 w-full h-0.5 bg-gray-100 z-0 transform translate-x-1/2">
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0 6L12 6" stroke="#E5E7EB" strokeWidth="2"/>
                      <path d="M6 0L6 12" stroke="#E5E7EB" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              )}
              <div className="relative z-10 flex flex-col items-center text-center p-6">
                <div className={cn("rounded-full p-4", step.color)}>
                  {step.icon}
                </div>
                <h3 className="mt-6 text-xl font-medium">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
