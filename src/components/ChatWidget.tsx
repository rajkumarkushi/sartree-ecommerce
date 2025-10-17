
import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ text: string; sender: 'user' | 'agent' }[]>([
    { text: "Hello! 👋 How can we help you today? Our team is ready to assist with any questions about our rice products.", sender: 'agent' }
  ]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message to chat
    setChatHistory([...chatHistory, { text: message, sender: 'user' }]);
    setMessage('');
    
    // Simulate agent response
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev, 
        { 
          text: "Thank you for your message! Our team will get back to you shortly. In the meantime, feel free to browse our premium rice collection.", 
          sender: 'agent' 
        }
      ]);
    }, 1000);
  };

  return (
    <>
      {/* Chat toggle button */}
      <button 
        className={`fixed bottom-5 right-5 z-50 bg-farm-primary hover:bg-farm-dark text-white rounded-full p-3 shadow-md transition-all duration-300 ${isOpen ? 'rotate-90' : ''}`}
        onClick={toggleChat}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-20 right-5 z-50 w-80 md:w-96 bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col transition-all duration-300">
          {/* Chat header */}
          <div className="bg-farm-primary text-white px-4 py-3 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">Live Chat</h3>
              <p className="text-xs opacity-80">We typically reply within minutes</p>
            </div>
            <button 
              className="text-white hover:bg-white/20 rounded-full p-1"
              onClick={toggleChat}
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Chat messages */}
          <div className="flex-1 p-4 overflow-y-auto max-h-80 space-y-3">
            {chatHistory.map((msg, index) => (
              <div 
                key={index} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.sender === 'user' 
                      ? 'bg-farm-primary text-white rounded-br-none' 
                      : 'bg-gray-100 text-gray-800 rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          {/* Chat input */}
          <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
            <div className="flex items-center">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..." 
                className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-farm-primary"
              />
              <button 
                type="submit" 
                className="bg-farm-primary hover:bg-farm-dark text-white px-4 py-2 rounded-r-md transition-colors"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
