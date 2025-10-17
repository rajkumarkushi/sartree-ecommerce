import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Minus, Plus, Heart } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { productAPI } from '@/services/productPageApi';

interface ProductImage {
  id: number;
  url: string;
}

interface Specification {
  label: string;
  value: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  color?: string;
  brand_name?: string;
  weight?: string;
  category?: string;
  originalPrice?: number;
  images: ProductImage[];
  specifications: Specification[];
}

const mockProducts: Product[] = [
  {
    id: "1",
    name: "Premium Sona Masoori Rice",
    description:
      "Experience the authentic taste of premium quality Sona Masoori Rice. Known for its light, fluffy texture and subtle aroma, this medium-grain rice is perfect for daily consumption. Low in starch and easy to digest, it's an ideal choice for health-conscious individuals.",
    price: 49.99,
    originalPrice: 59.99,
    color: "White",
    brand_name: "Premium Rice Co.",
    weight: "25",
    category: "Rice",
    images: [
      { id: 1, url: "/images/1.jpeg" },
      { id: 2, url: "/images/2.jpeg" },
      { id: 3, url: "/images/3.jpeg" },
      { id: 4, url: "/images/4.jpg" },
    ],
    specifications: [
      { label: "Weight", value: "25 kg" },
      { label: "Type", value: "Medium Grain" },
      { label: "Origin", value: "India" },
      { label: "Processing", value: "Steam Processed" },
      { label: "Quality", value: "Premium Grade" },
      { label: "Packaging", value: "Food Grade PP Bag" },
    ],
  },
];

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError("Product ID is missing");
        setLoading(false);
        setProduct(null);
        return;
      }

      setLoading(true);
      setError("");
      setProduct(null);

      try {
        console.log("Fetching product details for id:", id);
        const data = await productAPI.getProduct(id);
        console.log("Product API response:", data);

        if (data) {
          console.log("Category:", JSON.stringify(data.category));
          const mappedProduct: Product = {
            id: data.id?.toString() || id,
            name: data.name || "",
            description: data.description || "",
            color: data.color || "",
            brand_name: data.brand_name || "",
            weight: data.weight?.toString() || "",
            category: data.category?.title || data.category || "",
            price: parseFloat(data.price) || 0,
            originalPrice: data.original_price ? parseFloat(data.original_price) : undefined,
            images: Array.isArray(data.images) && data.images.length > 0
              ? data.images.map((img: any, index: number) => ({
                  id: img?.id ?? index,
                  url: img?.name ?? img?.url ?? img ?? "/images/3.jpeg",
                }))
              : [{ id: 1, url: data.image ?? "/images/3.jpeg" }],
            specifications: Array.isArray(data.specifications)
              ? data.specifications.map((spec: any) => ({
                  label: spec.label || spec.name || "",
                  value: spec.value || ""
                }))
              : [],
          };

          setProduct(mappedProduct);
          setError("");
        } else {
          throw new Error("No product data received");
        }
      } catch (error: unknown) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details. Using mock data.");
        
        // Fallback to mock data
        const mock = mockProducts.find((p) => p.id === id);
        if (mock) {
          setProduct(mock);
        } else {
          setProduct(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) {
      console.error("No product available");
      return;
    }else{

    }
    
    if (quantity < 1) {
      console.error("Invalid quantity:", quantity);
      return;
    }

    setActionLoading(true);
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0]?.url || "/images/default.jpg",
      };
      
      console.log("Adding to cart:", cartItem, "quantity:", quantity);
      await addItem(cartItem, quantity);
      
      // Show success message or feedback here if needed
      console.log("Successfully added to cart");
      
    } catch (error: any) {
      console.error("Failed to add to cart:", error);
      if (error.response?.data) {
        console.error("Error response data:", error.response.data);
      }
      // Show error message to user here if needed
      setError("Failed to add item to cart. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleBuyNow = async () => {
    if (!product) {
      console.error("No product available");
      return;
    }
    
    if (quantity < 1) {
      console.error("Invalid quantity:", quantity);
      return;
    }

    setActionLoading(true);
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.images[0]?.url || "/images/default.jpg",
      };
      
      console.log("Adding to cart for buy now:", cartItem, "quantity:", quantity);
      await addItem(cartItem, quantity);
      navigate("/checkout");
      
    } catch (error: any) {
      console.error("Failed to add to cart for buy now:", error);
      if (error.response?.data) {
        console.error("Error response data:", error.response.data);
      }
      setError("Failed to process buy now. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
          <p className="text-gray-600">The requested product could not be loaded.</p>
          <Button 
            onClick={() => navigate('/')} 
            className="mt-4"
          >
            Go Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const totalWeightKg = product.weight ? parseFloat(product.weight) : 1;
  const pricePerKg = totalWeightKg > 0 ? product.price / totalWeightKg : product.price;

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
          <p className="text-yellow-800">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image Slider */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            <img
              src={product.images[selectedImage]?.url}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/default.jpg";
              }}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`aspect-square rounded-lg overflow-hidden border-2 ${
                  selectedImage === index
                    ? "border-farm-primary"
                    : "border-transparent"
                }`}
              >
                <img
                  src={image.url}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/default.jpg";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Information */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center flex-wrap gap-4">
              <span className="text-3xl font-bold text-farm-primary">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-sm">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}% OFF
                  </span>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* Product Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 border-t border-b">
            <div className="space-y-2">
              {product.brand_name && (
                <p className="text-gray-500">
                  Brand Name: <span className="font-medium text-black">{product.brand_name}</span>
                </p>
              )}
              {product.category && (
                <p className="text-gray-500">
                  Category: <span className="font-medium text-black">{product.category}</span>
                </p>
              )}
              <p className="text-gray-500">
                Price per kg: <span className="font-medium text-black">{pricePerKg.toFixed(2)}</span>
              </p>
            </div>
            <div className="space-y-2">
              {product.color && (
                <p className="text-gray-500">
                  Colour: <span className="font-medium text-black">{product.color}</span>
                </p>
              )}
              {product.weight && (
                <p className="text-gray-500">
                  Weight: <span className="font-medium text-black">{product.weight} KG</span>
                </p>
              )}
            </div>
          </div>

          {/* Specifications */}
          {product.specifications.length > 0 && (
            <div className="border-t border-b py-4">
              <h3 className="text-lg font-semibold mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {product.specifications.map((spec, index) => (
                  <div key={index}>
                    <span className="text-gray-600">{spec.label}:</span>{" "}
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-md">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1 || actionLoading}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={actionLoading}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="ghost" size="icon" className="border rounded-xl">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-3 flex flex-col md:items-end">
              <Button
                className="w-full md:w-96  bg-amber-400 hover:bg-yellow-500 text-white py-6 text-lg text-center"
                onClick={handleAddToCart}
                disabled={actionLoading}
              >
                {actionLoading ? "Adding..." : "Add to Cart"}
              </Button>

              <Button
                className="w-full md:w-96 bg-farm-primary hover:bg-farm-dark text-white py-6 text-lg text-center"
                onClick={handleBuyNow}
                disabled={actionLoading}
              >
                {actionLoading ? "Processing..." : "Buy Now"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;