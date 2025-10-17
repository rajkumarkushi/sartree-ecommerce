import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import HeroSlider from '../components/HeroSlider';
import ProductCard, { ProductProps } from '../components/ProductCard';
import AuthStatus from '../components/AuthStatus';
import { config } from '../config';
import { fetchProducts, Product } from '../services/productApi';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProducts()
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      });
  }, []);

  // Hero Slides Data
  const heroSlides = [
    {
      title: "Premium Quality Rice",
      subtitle: "Direct from local farms to your table",
      image: "https://img.freepik.com/free-photo/sesame-seeds-dark-background_1150-45326.jpg"
    },
    {
      title: "Organic Farm Fresh",
      subtitle: "The freshest selection available",
      image: "https://img.freepik.com/free-photo/sack-rice-seed-with-white-rice-small-glass-bowl-rice-plant_1150-35747.jpg"
    },
    {
      title: "100% Natural & Pure",
      subtitle: "Certified organic produce",
      image: "https://img.freepik.com/free-photo/sack-rice-seed-with-white-rice-small-wooden-spoon-rice-plant_1150-35745.jpg"
    }
  ];

  console.log("Products to render:", products);
  products.forEach(product => console.log("Product image URL:", product.image));
  return (
    <div className="w-full bg-white">
      {/* Hero Slider Section */}
      <HeroSlider slides={heroSlides} />
      
      {/* Our Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Our Products</h2>
            <p className="text-lg text-gray-600">
              {isAuthenticated 
                ? "Discover the Convenience of Fresh Club: Your personalized product recommendations"
                : "Discover the Convenience of Fresh Club: Our Products Online Delivery in Hyderabad"
              }
            </p>
            {isAuthenticated && (
              <p className="text-sm text-green-600 mt-2">
                🎉 You're logged in! Enjoy personalized shopping experience.
              </p>
            )}
          </div>
          
          {loading ? (
            <p className="text-center col-span-full text-gray-500">Loading products...</p>
          ) : error ? (
            <p className="text-center col-span-full text-red-600">{error}</p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {products.length > 0 ? (
                  products.slice(0, 8).map((product) => (
                    <ProductCard 
                      key={product.id} 
                      {...product} 
                    />
                  ))
                ) : (
                  <p className="text-center col-span-full text-gray-500">No products available at the moment.</p>
                )}
              </div>
              {/* Debug: simple list of product names */}
            </>
          )}
        </div>
      </section>

      {/* Mobile Auth Status (shown only on mobile) */}
      {isAuthenticated && (
        <div className="md:hidden fixed bottom-4 right-4 z-50">
          <AuthStatus />
        </div>
      )}
    </div>
  );
};

export default Home;
