import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-100 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center space-x-6 text-sm text-gray-600">
          <Link to="/privacy" className="hover:text-primary transition-colors">
            Privacy
          </Link>
          <Link to="/about" className="hover:text-primary transition-colors">
            About Us
          </Link>
        </div>
        <div className="text-center mt-4 text-xs text-gray-500">
          © {new Date().getFullYear()} WhatAGirlWants.ai. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;