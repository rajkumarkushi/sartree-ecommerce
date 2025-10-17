
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4"> <Link to="/" className="flex-shrink-0">
                        <img 
                          src="/images/logo.png" 
                          alt="SAR TREE INDUSTRIES" 
                          className="h-12 w-auto object-contain"
                        />
                      </Link></h3>
            <p className="text-gray-300 mb-4">
              Premium quality rice products directly from farm to your table. We focus on sustainable farming and quality assurance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-300 hover:text-white transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Product Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products/basmati" className="text-gray-300 hover:text-white transition-colors">Basmati Rice</Link>
              </li>
              <li>
                <Link to="/products/sona-masoori" className="text-gray-300 hover:text-white transition-colors">Sona Masoori Rice</Link>
              </li>
              <li>
                <Link to="/products/ponni" className="text-gray-300 hover:text-white transition-colors">Ponni Rice</Link>
              </li>
              <li>
                <Link to="/products/brown" className="text-gray-300 hover:text-white transition-colors">Brown Rice</Link>
              </li>
              <li>
                <Link to="/products/organic" className="text-gray-300 hover:text-white transition-colors">Organic Rice</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 mt-1 flex-shrink-0" />
                <span className="text-gray-300">123 Rice Farm Road, Farmville, District 12345, Country</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-colors">+91 7331103675</a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 flex-shrink-0" />
                <a href="mailto:info@sartreeindustries.com" className="text-gray-300 hover:text-white transition-colors">sartreeindustries@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
      

        {/* Copyright */}
        <div className="border-t border-gray-700 pt-6 mt-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()}SAR TREE INDUSTRIES. All rights reserved. Made with  by DD Cloud.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
