import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard, { ProductProps } from './ProductCard';

interface ProductSliderProps {
  title: string;
  subtitle?: string;
  products: ProductProps[];
}

const ProductSlider: React.FC<ProductSliderProps> = ({ title, subtitle, products }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const productsPerSlide = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 3 : 2;
  const slideCount = Math.ceil(products.length / productsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideCount);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideCount) % slideCount);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getVisibleProducts = () => {
    const start = currentSlide * productsPerSlide;
    return products.slice(start, start + productsPerSlide);
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        <div className="relative">
          {/* Slider navigation */}
          {slideCount > 1 && (
            <>
              <button 
                className="absolute left-0 top-1/3 z-10 transform -translate-y-1/2 -translate-x-1/2 bg-white hover:bg-gray-100 text-gray-700 rounded-full p-3 shadow-md transition-colors"
                onClick={prevSlide}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <button 
                className="absolute right-0 top-1/3 z-10 transform -translate-y-1/2 translate-x-1/2 bg-white hover:bg-gray-100 text-gray-700 rounded-full p-3 shadow-md transition-colors"
                onClick={nextSlide}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Products */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {getVisibleProducts().map((product) => (
              <ProductCard 
                key={product.id} 
                {...product} 
              />
            ))}
          </div>
        </div>

        {/* Slider dots */}
        {slideCount > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: slideCount }).map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  index === currentSlide 
                    ? 'bg-farm-primary' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link 
            to="/products" 
            className="inline-block border border-farm-primary text-farm-primary hover:bg-farm-primary hover:text-white px-6 py-2 rounded-md transition-colors duration-300"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
