import React from "react";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export interface ProductProps {
  id: string | number;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  weight?: string | number;
  isNew?: boolean;
  isOnSale?: boolean;
  isSoldOut?: boolean;
}

const ProductCard: React.FC<ProductProps> = ({
  id,
  name,
  price,
  originalPrice,
  image,
  weight,
  isNew = false,
  isOnSale = false,
  isSoldOut = false,
}) => {
  const { addItem } = useCart();
  const discount =
    originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const handleAddToCart = async () => {
    await addItem(
      {
        id,
        name,
        price,
        image,
        originalPrice,
        weight,
        isNew,
        isOnSale,
      },
      1
    );
  };

  return (
    <div className="group relative h-full overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="relative h-48 overflow-hidden md:h-56">
        <Link to={`/products/${id}`}>
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const localImages = [
                "/images/1.jpeg",
                "/images/2.jpeg",
                "/images/3.jpeg",
                "/images/4.jpg",
                "/images/5.jpg",
                "/images/6.jpg",
                "/images/7.jpg",
                "/images/8.jpg",
              ];
              (e.target as HTMLImageElement).src =
                localImages[Math.floor(Math.random() * localImages.length)];
            }}
          />
        </Link>

        <div className="absolute left-2 top-2 flex flex-col gap-2">
          {isNew && <span className="rounded bg-blue-600 px-2 py-1 text-xs text-white">NEW</span>}
          {isOnSale && <span className="rounded bg-red-600 px-2 py-1 text-xs text-white">SALE</span>}
          {isSoldOut && (
            <span className="rounded bg-gray-700 px-2 py-1 text-xs text-white">SOLD OUT</span>
          )}
        </div>

        <div className="absolute right-2 top-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <button
            className="rounded-full bg-white p-2 shadow-md transition-colors hover:bg-gray-100"
            aria-label="Add to wishlist"
            type="button"
          >
            <Heart className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="p-4">
        <Link to={`/products/${id}`} className="hover:text-farm-primary">
          <h3 className="min-h-[40px] line-clamp-2 font-medium text-gray-800 transition-colors">
            {name}
          </h3>
        </Link>

        <p className="mb-2 text-xs text-gray-500">Quantity: {weight ? weight : "1 kg"}</p>

        <div className="mb-3 flex items-center">
          <span className="text-lg font-semibold text-farm-primary">
            Rs. {(price || 0).toFixed(2)}
          </span>
          {originalPrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              Rs. {(originalPrice || 0).toFixed(2)}
            </span>
          )}
          {discount > 0 && (
            <span className="ml-2 rounded bg-red-100 px-1.5 py-0.5 text-xs text-red-700">
              {discount}% OFF
            </span>
          )}
        </div>

        {isSoldOut ? (
          <button className="w-full cursor-not-allowed rounded bg-gray-500 px-4 py-2 text-white" disabled>
            Sold out
          </button>
        ) : (
          <button
            type="button"
            className="w-full rounded bg-black px-4 py-2 text-white transition-colors duration-300 hover:bg-gray-800"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
