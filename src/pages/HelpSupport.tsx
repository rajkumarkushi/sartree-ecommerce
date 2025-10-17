import { useState } from 'react';
import { MessageCircle, Phone, Mail, FileText, ExternalLink, Search, Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';

const HelpSupport = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: "support", time: "now" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, 
        { id: messages.length + 1, text: newMessage, sender: "user", time: "now" },
        { id: messages.length + 2, text: "Thank you for your message. A support agent will respond shortly.", sender: "support", time: "now" }
      ]);
      setNewMessage("");
    }
  };

  const handleStartChat = () => {
    setIsChatOpen(true);
  };
  const supportOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      icon: MessageCircle,
      action: 'Start Chat',
      available: true
    },
    {
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      icon: Phone,
      action: 'Call Now',
      available: true,
      details: '+1 (555) 123-HELP'
    },
    {
      title: 'Email Support',
      description: 'Send us a detailed message',
      icon: Mail,
      action: 'Send Email',
      available: true,
      details: 'support@company.com'
    }
  ];

  const faqItems = [
    {
      question: 'How can I track my order?',
      answer: 'You can track your order using the tracking number provided in your order confirmation email or in the Order History section.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items. Items must be unused and in original packaging.'
    },
    {
      question: 'How do I change my shipping address?',
      answer: 'You can update your shipping address in the Settings section before your order ships.'
    },
    {
      question: 'Do you offer international shipping?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.'
    }
  ];

  const resources = [
    { title: 'User Guide', icon: FileText, description: 'Complete guide to using our platform' },
    { title: 'Shipping Information', icon: FileText, description: 'Delivery times and shipping policies' },
    { title: 'Return Instructions', icon: FileText, description: 'Step-by-step return process' },
    { title: 'Account Settings', icon: FileText, description: 'Manage your account preferences' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-semibold text-foreground mb-2">Help & Support</h3>
        <p className="text-muted-foreground">We're here to help you with any questions or concerns</p>
      </div>

      {/* Search Bar */}
      <Card className="p-6 bg-gradient-card border border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            placeholder="Search for help articles, FAQs, or guides..."
            className="pl-10 bg-accent border-border"
          />
        </div>
      </Card>

      {/* Contact Options */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Contact Support</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {supportOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card key={option.title} className="p-6 bg-gradient-card border border-border hover:shadow-glow transition-all duration-300">
                <div className="text-center space-y-4">
                  <div className="p-3 bg-primary/20 rounded-full w-fit mx-auto">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground">{option.title}</h5>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                    {option.details && (
                      <p className="text-sm text-primary font-medium mt-2">{option.details}</p>
                    )}
                  </div>
                   <Dialog open={isChatOpen} onOpenChange={setIsChatOpen}>
                     <DialogTrigger asChild>
                       <Button 
                         className="w-full" 
                         variant={option.available ? "default" : "outline"}
                         onClick={option.title === 'Live Chat' ? handleStartChat : undefined}
                       >
                         {option.action}
                       </Button>
                     </DialogTrigger>
                     {option.title === 'Live Chat' && (
                       <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col" aria-describedby="live-chat-description">
                         <DialogHeader>
                           <DialogTitle>Live Chat Support</DialogTitle>
                           <DialogDescription id="live-chat-description" className="sr-only">
                             Chat with our support team in real-time.
                           </DialogDescription>
                         </DialogHeader>
                         <div className="flex-1 flex flex-col">
                           <div className="flex-1 space-y-4 p-4 bg-accent/50 rounded-lg overflow-y-auto max-h-[400px]">
                             {messages.map((message) => (
                               <div 
                                 key={message.id} 
                                 className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                               >
                                 <div 
                                   className={`max-w-[80%] p-3 rounded-lg ${
                                     message.sender === 'user' 
                                       ? 'bg-primary text-primary-foreground' 
                                       : 'bg-background border'
                                   }`}
                                 >
                                   <p className="text-sm">{message.text}</p>
                                   <span className="text-xs opacity-70">{message.time}</span>
                                 </div>
                               </div>
                             ))}
                           </div>
                           <div className="flex gap-2 mt-4">
                             <Input
                               placeholder="Type your message..."
                               value={newMessage}
                               onChange={(e) => setNewMessage(e.target.value)}
                               onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                               className="flex-1"
                             />
                             <Button onClick={handleSendMessage} size="sm">
                               <Send className="w-4 h-4" />
                             </Button>
                           </div>
                         </div>
                       </DialogContent>
                     )}
                   </Dialog>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Frequently Asked Questions</h4>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <Card key={index} className="p-6 bg-gradient-card border border-border">
              <h5 className="font-semibold text-foreground mb-2">{item.question}</h5>
              <p className="text-muted-foreground">{item.answer}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Help Resources */}
      <div>
        <h4 className="text-lg font-semibold text-foreground mb-4">Help Resources</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Card key={resource.title} className="p-4 bg-gradient-card border border-border hover:shadow-glow transition-all duration-300 cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary/20 rounded-lg">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h5 className="font-semibold text-foreground">{resource.title}</h5>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Support Hours */}
      <Card className="p-6 bg-gradient-card border border-border">
        <h4 className="text-lg font-semibold text-foreground mb-4">Support Hours</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Live Chat & Phone</p>
            <p className="text-foreground">Monday - Friday: 9 AM - 8 PM EST</p>
            <p className="text-foreground">Saturday: 10 AM - 6 PM EST</p>
            <p className="text-foreground">Sunday: 12 PM - 5 PM EST</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email Support</p>
            <p className="text-foreground">Available 24/7</p>
            <p className="text-foreground">Response within 24 hours</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HelpSupport;