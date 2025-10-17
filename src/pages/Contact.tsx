import React, { useState } from 'react';
import { toast } from 'sonner';
import { Mail, Phone, Clock, Send } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent successfully! We'll get back to you soon.");
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
   
      <main className="flex-grow">
        {/* Page Header */}
        <div className="bg-farm-primary text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
            <p className="text-gray-100">Reach out to us with your questions or feedback</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="col-span-1">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Get In Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-farm-light text-farm-primary rounded-full p-3 mr-4">
                      <Mail size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Email Address</h3>
                      <p className="text-gray-600 mt-1">info@sartreeindustries.com</p>
                      <p className="text-gray-600">support@sartreeindustries.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-farm-light text-farm-primary rounded-full p-3 mr-4">
                      <Phone size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone Number</h3>
                      <p className="text-gray-600 mt-1">+91 98765 43210</p>
                      <p className="text-gray-600">+91 12345 67890</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-farm-light text-farm-primary rounded-full p-3 mr-4">
                      <Clock size={20} />
                    </div>
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-gray-600 mt-1">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 9:00 AM - 1:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="col-span-1 md:col-span-2">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h2 className="text-2xl font-semibold mb-6">Send Us a Message</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farm-primary"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farm-primary"
                        placeholder="example@email.com"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farm-primary"
                        placeholder="How can we help you?"
                        required
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Message <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-farm-primary"
                        placeholder="Write your message here..."
                        required
                      ></textarea>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    className="bg-farm-primary hover:bg-farm-dark text-white font-medium py-3 px-6 rounded-md transition-colors duration-300 flex items-center justify-center"
                  >
                    <Send size={18} className="mr-2" /> Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold">Frequently Asked Questions</h2>
              <p className="text-gray-600 mt-2">Find answers to common questions about our products and services</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="font-medium text-lg mb-3">Do you offer wholesale prices?</h3>
                <p className="text-gray-600">Yes, we offer competitive wholesale prices for bulk orders. Please contact our sales team for more information and pricing.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="font-medium text-lg mb-3">What are your shipping options?</h3>
                <p className="text-gray-600">We offer standard and express shipping options. Delivery timeframes depend on your location and the shipping method chosen at checkout.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="font-medium text-lg mb-3">How can I track my order?</h3>
                <p className="text-gray-600">Once your order ships, you'll receive a tracking number via email that you can use to monitor the status of your delivery.</p>
              </div>
              
              <div className="bg-white shadow-sm rounded-lg p-6">
                <h3 className="font-medium text-lg mb-3">What is your return policy?</h3>
                <p className="text-gray-600">We offer a 30-day return policy for most products. Please refer to our Returns & Refunds page for detailed information.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <ChatWidget />
    </div>
  );
};

export default Contact;
