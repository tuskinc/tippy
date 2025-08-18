
import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6 mt-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4">
        <div className="text-sm text-gray-500 mb-2 md:mb-0">
          &copy; {new Date().getFullYear()} Tippy. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <a href="/privacy" className="text-xs text-gray-500 underline ml-2">Privacy Policy</a>
          <span className="text-xs text-gray-400">Your data and location are protected and never shared without your consent.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
