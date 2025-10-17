import { config } from '../config';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  weight?: string;
  isNew?: boolean;
  isOnSale?: boolean;
  isSoldOut?: boolean;
  title?: string;
}

const baseURL = config.baseURL;

export async function fetchProducts(): Promise<Product[]> {
  const headers: Record<string, string> = {};
  if (config.clientId) {
    headers['X-Client-Id'] = config.clientId;
  }
  if (config.clientSecret) {
    headers['X-Client-Secret'] = config.clientSecret;
  }
  const response = await fetch(`${baseURL}/v1/home/products`,{headers});
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  const data = await response.json();
  console.log('API response:', data);
  // Assuming data is an array or nested in data.products or data.data
  let products: Product[] = [];
  if (Array.isArray(data)) {
    products = data;
  } else if (data && Array.isArray(data.products)) {
    products = data.products;
  } else if (data && Array.isArray(data.data)) {
    products = data.data;
  } else if (data && Array.isArray(data.item)) {
    products = data.item;
  } else if (data && data.data && Array.isArray(data.data.item)) {
    products = data.data.item;
  } else if (data && data.data && Array.isArray(data.data.items)) {
    products = data.data.items;
  } else {
    products = [];
  }
  // Convert price and originalPrice to numbers if they are strings
  products = products.map(product => {
    let imageUrl = product.image;
    // If image is missing or not a valid image URL, map to local placeholder images
    const localImages = [
      '/images/1.jpeg',
      '/images/2.jpeg',
      '/images/3.jpeg',
      '/images/4.jpg',
      '/images/5.jpg',
      '/images/6.jpg',
      '/images/7.jpg',
      '/images/8.jpg',
    ];
    if (!imageUrl || !imageUrl.match(/\.(jpeg|jpg|png|gif|svg)$/i)) {
      // Assign a random local image as fallback
      imageUrl = localImages[Math.floor(Math.random() * localImages.length)];
    } else if (!imageUrl.startsWith('http') && !imageUrl.startsWith('https')) {
      imageUrl = `${baseURL.replace(/\/$/, '')}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
    }
    return {
      ...product,
      name: product.name || product.title || '',
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      originalPrice: typeof product.originalPrice === 'string' ? parseFloat(product.originalPrice) : product.originalPrice,
      image: imageUrl,
      // color : typeof product.color === 'string' ? parseFloat(product.color) : product.color,
    };
  });
  console.log('Formatted products:', products);
  return products;
}

export async function createProduct(product: Product): Promise<Product> {
  const response = await fetch(`${baseURL}/v1/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to create product');
  }
  return response.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const response = await fetch(`${baseURL}/v1/product/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    throw new Error('Failed to update product');
  }
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${baseURL}/v1/product/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete product');
  }
}
