import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import ProductCard, { ProductProps } from '../components/ProductCard';
import ChatWidget from '../components/ChatWidget';
import { productAPI } from '@/api/modules/products';
import { extractProductImage } from '@/lib/image';

// Local fallback images
const LOCAL_IMAGES = [
  '/images/1.jpeg',
  '/images/2.jpeg',
  '/images/3.jpeg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg',
];

const Products = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    const params = new URLSearchParams(location.search);
    return params.get('search') || '';
  });

  // Pick fallback image
  const getLocalImage = (index: number) =>
    LOCAL_IMAGES[index % LOCAL_IMAGES.length];

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      const result = await productAPI.list();

      const rawData = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];

      if (rawData.length === 0) {
        setProducts([]);
        return;
      }

      const formatted: ProductProps[] = rawData.map((item: any, index: number) => {
        console.log("🟦 PRODUCT ITEM:", item);

        // Backend already returns full URL
        const backendImage = item.image || null;

        const resolvedImage =
          backendImage ||
          extractProductImage(item) ||
          getLocalImage(index);

        return {
          id: item.id || item.product_id || String(index + 1),
          name: item.name || item.title || 'Unnamed Product',

          // FINALLY the correct image
          image: resolvedImage,

          price: Number(item.price || item.sale_price || 0),
          originalPrice: item.original_price
            ? Number(item.original_price)
            : undefined,

          weight: item.weight || item.quantity || 'N/A',
          isNew: item.is_new || false,
          isOnSale: item.is_on_sale || false,
          isSoldOut: item.is_sold_out || false,
        };
      });

      setProducts(formatted);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Sync search with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchValue = params.get('search') || '';
    setSearchTerm((prev) => (prev === searchValue ? prev : searchValue));
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter by search
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow bg-gray-50">
        <div className="bg-farm-primary text-white py-10">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2">Our Rice Products</h1>
            <p className="text-gray-100">Discover our wide range of premium quality rice varieties</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold mb-2 md:mb-0">All Products</h2>

            <div className="mt-8 flex justify-center px-4 sm:px-0">
              <div className="relative w-full max-w-2xl group">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 opacity-60 blur-xl group-focus-within:opacity-80 transition-opacity"></div>
                <div className="relative flex items-center gap-3 rounded-full bg-white/95 backdrop-blur border-2 border-green-100 shadow-lg px-5 py-3">
                  <Search className="text-green-600" size={20} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search fresh products..."
                    className="flex-1 bg-transparent text-base md:text-lg font-medium text-gray-800 placeholder:text-gray-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">API Error:</p>
              <p>{error}</p>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse"
                >
                  <div className="h-48 md:h-56 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
};

export default Products;
