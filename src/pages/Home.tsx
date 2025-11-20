import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import HeroSlider from '../components/HeroSlider';
import ProductCard, { ProductProps } from '../components/ProductCard';
import { config } from '../config';
import { productAPI } from '@/api/modules/products';

const Home = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Add a timeout to prevent hanging
    const timeoutId = setTimeout(() => {
      setError("Request timeout. Please check your connection.");
      setLoading(false);
    }, 10000);
    
    productAPI.list()
      .then((data) => {
        clearTimeout(timeoutId);
        console.log("Products loaded:", data);
        const list = Array.isArray(data) ? data : (data?.data && Array.isArray(data.data) ? data.data : []);
        setProducts(list.map((p: any) => ({
          id: p.id,
          name: p.name || p.title || `Product ${p.id}`,
          price: Number(p.price ?? p.finalPrice ?? p.sale_price ?? 0),
          originalPrice: Number(p.original_price ?? p.mrp ?? p.price) || undefined,
          image: p.image || p.thumbnail || (p.images && p.images[0]) || '/images/1.jpeg',
          weight: p.weight || p.size || '1kg',
          isNew: !!p.is_new,
          isOnSale: !!p.is_on_sale,
          isSoldOut: !!p.is_sold_out,
        })));
        setLoading(false);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        console.error("Fetch error:", error);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
        // Set empty products array as fallback
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchValue = params.get('search') || '';
    setSearchTerm((prev) => (prev === searchValue ? prev : searchValue));
  }, [location.search]);

  const filteredProducts = products.filter((product) =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const displayedProducts = filteredProducts.slice(0, 8);

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
            <div className="mt-8 flex justify-center px-4 sm:px-0">
              <div className="relative w-full max-w-2xl group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 opacity-60 blur-xl group-focus-within:opacity-80 transition-opacity"></div>
                <div className="relative flex items-center gap-3 rounded-full bg-white/95 backdrop-blur border-2 border-green-100 shadow-[0_10px_35px_rgba(34,197,94,0.2)] focus-within:border-green-400 focus-within:shadow-[0_12px_45px_rgba(34,197,94,0.28)] px-5 py-3">
                  <Search className="text-green-600" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search fresh products..."
                    className="flex-1 bg-transparent text-base md:text-lg font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                  {searchTerm && (
                    <span className="text-xs font-semibold uppercase tracking-wide text-green-600 bg-green-50 px-3 py-1 rounded-full">
                      {filteredProducts.length} match{filteredProducts.length === 1 ? '' : 'es'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center col-span-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-farm-primary mx-auto mb-4"></div>
              <p className="text-gray-500">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center col-span-full">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-farm-primary text-white rounded hover:bg-farm-dark"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                {displayedProducts.length > 0 ? (
                  displayedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      {...product} 
                    />
                  ))
                ) : (
                  <div className="text-center col-span-full">
                    <p className="text-gray-500 mb-4">
                      {products.length === 0
                        ? 'No products available at the moment.'
                        : 'No products match your search. Try a different keyword.'}
                    </p>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="px-4 py-2 bg-farm-primary text-white rounded hover:bg-farm-dark"
                    >
                      Refresh
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
