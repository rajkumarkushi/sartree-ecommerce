import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import ProductCard, { ProductProps } from '../components/ProductCard';
import ChatWidget from '../components/ChatWidget';
import { productAPI } from '@/api/modules/products';

// Local images as fallback
const LOCAL_IMAGES = [
  '/images/1.jpeg',
  '/images/2.jpeg', 
  '/images/3.jpeg',
  '/images/4.jpg',
  '/images/5.jpg',
  '/images/6.jpg',
  '/images/7.jpg',
  '/images/8.jpg'
];

const Products = () => {
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Helper function to get a local image
  const getLocalImage = (index: number) => {
    return LOCAL_IMAGES[index % LOCAL_IMAGES.length];
  };

  // Fetch products using the API service
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('Fetching products from API...');
      
      // Try to get products from the API service
      const result = await productAPI.list();
      
      console.log('API Response:', result); // Debug log
      

      const rawData = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
        ? result.data
        : [];

      // If no data from API, use mock data
      if (rawData.length === 0) {
        console.log('No data from API, using mock data');
        const mockProducts: ProductProps[] = [
          {
            id: '1',
            name: 'Toor Dal / kandipappu',
            price: 110.00,
            originalPrice: 140.00,
            image: '/images/1.jpeg',
            weight: '1kg',
            isNew: false,
            isOnSale: true,
            isSoldOut: false,
          },
          {
            id: '2',
            name: 'Urad Gola White / Gundu Minapappu',
            price: 110.00,
            originalPrice: 110.00,
            image: '/images/2.jpeg',
            weight: '1kg',
            isNew: false,
            isOnSale: false,
            isSoldOut: false,
          },
          {
            id: '3',
            name: 'Moong Dal (pesarapappu)',
            price: 90.00,
            originalPrice: 90.00,
            image: '/images/3.jpeg',
            weight: '500g',
            isNew: false,
            isOnSale: false,
            isSoldOut: false,
          },
          {
            id: '4',
            name: 'Chana Dal / Chanagappu',
            price: 70.00,
            originalPrice: 80.00,
            image: '/images/4.jpg',
            weight: '1kg',
            isNew: false,
            isOnSale: true,
            isSoldOut: false,
          },
          {
            id: '5',
            name: 'Green Moong Whole / pesarlu',
            price: 75.00,
            originalPrice: 90.00,
            image: '/images/5.jpg',
            weight: '500g',
            isNew: false,
            isOnSale: true,
            isSoldOut: false,
          },
          {
            id: '6',
            name: 'Black Brown Chana / Senagalu',
            price: 35.00,
            originalPrice: 44.00,
            image: '/images/6.jpg',
            weight: '250g',
            isNew: false,
            isOnSale: true,
            isSoldOut: false,
          },
          {
            id: '7',
            name: 'Tasting Salt / Ajinamato',
            price: 30.00,
            originalPrice: 30.00,
            image: '/images/7.jpg',
            weight: '200g',
            isNew: false,
            isOnSale: false,
            isSoldOut: true,
          },
          {
            id: '8',
            name: 'Everest Tikhalal Powder',
            price: 45.00,
            originalPrice: 45.00,
            image: '/images/8.jpg',
            weight: '100g',
            isNew: false,
            isOnSale: false,
            isSoldOut: false,
          },
        ];
        setProducts(mockProducts);
        return;
      }

      // Map and clean data
      const formatted: ProductProps[] = rawData.map((item: any, index: number) => {
        console.log('Processing item:', item); // Debug log
        
        // Handle different possible image field structures
        let imageUrl = '';
        
        if (item.image && typeof item.image === 'string') {
          // Direct image URL
          imageUrl = item.image.startsWith('http') 
            ? item.image 
            : `/${item.image}`;
        } else if (item.images && Array.isArray(item.images) && item.images.length > 0) {
          // Images array - take the first image
          const firstImage = item.images[0];
          if (typeof firstImage === 'string') {
            imageUrl = firstImage.startsWith('http') 
              ? firstImage 
              : `/${firstImage}`;
          } else if (firstImage && firstImage.url) {
            imageUrl = firstImage.url.startsWith('http') 
              ? firstImage.url 
              : `/${firstImage.url}`;
          }
        } else if (item.image_url) {
          // Alternative field name
          imageUrl = item.image_url.startsWith('http') 
            ? item.image_url 
            : `/${item.image_url}`;
        }
        
        // Fallback to local image if no image found
        if (!imageUrl) {
          imageUrl = getLocalImage(index);
        }

        return {
          id: item.id || item.product_id || String(index + 1),
          name: item.name || item.title || 'Unnamed Product',
          price: Number(item.price || item.sale_price || 0),
          originalPrice: item.original_price ? Number(item.original_price) : undefined,
          image: imageUrl,
          weight: item.weight || item.quantity || 'N/A',
          isNew: item.is_new || false,
          isOnSale: item.is_on_sale || false,
          isSoldOut: item.is_sold_out || false,
        };
      });

      console.log('Formatted products:', formatted); // Debug log
      setProducts(formatted);
    } catch (err: any) {
      console.error('Error fetching products:', err); // Debug log
      setError(err.message || 'Something went wrong');
      
      // Use mock data as fallback on error
      console.log('Using mock data as fallback due to API error');
      const mockProducts: ProductProps[] = [
        {
          id: '1',
          name: 'Toor Dal / kandipappu',
          price: 110.00,
          originalPrice: 140.00,
          image: '/images/1.jpeg',
          weight: '1kg',
          isNew: false,
          isOnSale: true,
          isSoldOut: false,
        },
        {
          id: '2',
          name: 'Urad Gola White / Gundu Minapappu',
          price: 110.00,
          originalPrice: 110.00,
          image: '/images/2.jpeg',
          weight: '1kg',
          isNew: false,
          isOnSale: false,
          isSoldOut: false,
        },
        {
          id: '3',
          name: 'Moong Dal (pesarapappu)',
          price: 90.00,
          originalPrice: 90.00,
          image: '/images/3.jpeg',
          weight: '500g',
          isNew: false,
          isOnSale: false,
          isSoldOut: false,
        },
        {
          id: '4',
          name: 'Chana Dal / Chanagappu',
          price: 70.00,
          originalPrice: 80.00,
          image: '/images/4.jpg',
          weight: '1kg',
          isNew: false,
          isOnSale: true,
          isSoldOut: false,
        },
      ];
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const handleDelete = async (id: string) => {
    try {
      const confirmed = window.confirm('Are you sure you want to delete this product?');
      if (!confirmed) return;

      // Use the API service for deletion
      // optional: add admin delete later via API
      fetchProducts(); // Refresh
    } catch (err: any) {
      alert(err.message);
    }
  };

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

            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-farm-primary text-sm"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <p className="font-medium">API Error:</p>
              <p>{error}</p>
              <p className="text-sm mt-2">Using mock data as fallback.</p>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
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
                <div key={product.id}>
                  <ProductCard {...product} />
                </div>
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
