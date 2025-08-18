
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2">
              <MapPin className="h-6 w-6 text-brand-500" />
              <span className="font-bold text-xl">LocalPro</span>
            </Link>
            <p className="mt-4 text-gray-600 max-w-md">
              LocalPro connects customers with trusted local service professionals.
              Find the help you need for any job, big or small, right in your neighborhood.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">For Customers</h3>
            <ul className="space-y-3">
              <li><Link to="/services" className="text-gray-600 hover:text-brand-500 transition">Find Services</Link></li>
              <li><Link to="/how-it-works" className="text-gray-600 hover:text-brand-500 transition">How It Works</Link></li>
              <li><Link to="/pricing" className="text-gray-600 hover:text-brand-500 transition">Pricing</Link></li>
              <li><Link to="/faq" className="text-gray-600 hover:text-brand-500 transition">FAQ</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">For Professionals</h3>
            <ul className="space-y-3">
              <li><Link to="/register/provider" className="text-gray-600 hover:text-brand-500 transition">Join as Pro</Link></li>
              <li><Link to="/resources" className="text-gray-600 hover:text-brand-500 transition">Resources</Link></li>
              <li><Link to="/success-stories" className="text-gray-600 hover:text-brand-500 transition">Success Stories</Link></li>
              <li><Link to="/pro-app" className="text-gray-600 hover:text-brand-500 transition">Pro Mobile App</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} LocalPro. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-brand-500">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-500 hover:text-brand-500">
              Terms of Service
            </Link>
            <Link to="/contact" className="text-sm text-gray-500 hover:text-brand-500">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
