
import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Slide {
  title: string;
  subtitle: string;
  image: string;
}

interface HeroSliderProps {
  slides: Slide[];
  autoPlay?: boolean;
  interval?: number;
}

const HeroSlider: React.FC<HeroSliderProps> = ({ 
  slides, 
  autoPlay = true, 
  interval = 5000
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    if (!autoPlay) return;
    
    const slideInterval = setInterval(nextSlide, interval);
    return () => clearInterval(slideInterval);
  }, [autoPlay, interval]);

  return (
    <div className="relative overflow-hidden h-[500px] md:h-[600px] w-full">
      <div 
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="min-w-full h-full relative"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-black opacity-50"></div>
            </div>
            <div className="container mx-auto px-4 h-full flex flex-col justify-center relative z-10 text-white">
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{slide.title}</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-xl">{slide.subtitle}</p>
              <div className="flex space-x-4">
                <a 
                  href="#products" 
                  className="bg-farm-primary hover:bg-farm-dark text-white px-6 py-3 rounded-md transition-colors duration-300"
                >
                  Shop Now
                </a>
                <a 
                  href="/about" 
                  className="bg-transparent border border-white hover:bg-white hover:text-gray-900 text-white px-6 py-3 rounded-md transition-colors duration-300"
                >
                  Learn More
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation arrows */}
      <button 
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
        onClick={prevSlide}
      >
        <ArrowLeft className="w-6 h-6" />
      </button>
      <button 
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/30 hover:bg-white/50 text-white rounded-full p-2 backdrop-blur-sm transition-colors"
        onClick={nextSlide}
      >
        <ArrowRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              currentSlide === index ? 'bg-white' : 'bg-white/50'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
