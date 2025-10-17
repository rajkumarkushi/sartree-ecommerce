import axios from 'axios';
import { config } from '@/config';

const api = axios.create({
  baseURL: import.meta?.env?.DEV ? '/api' : config.baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced Token management utilities
export const tokenManager = {
  getAccessToken: () => {
    try {
      return localStorage.getItem('access_token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  
  getRefreshToken: () => {
    try {
      return localStorage.getItem('refresh_token');
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      return null;
    }
  },
  
  setTokens: (accessToken: string, refreshToken?: string) => {
    try {
      localStorage.setItem('access_token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }
      // Set token expiry timestamp for easier checking
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      localStorage.setItem('token_expiry', payload.exp.toString());
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  },
  
  clearTokens: () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiry');
    } catch (error) {
      console.error('Error clearing tokens:', error);
    }
  },
  
  isTokenExpired: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
  
  // New: Get token expiry time
  getTokenExpiry: () => {
    try {
      const expiry = localStorage.getItem('token_expiry');
      return expiry ? parseInt(expiry) * 1000 : null;
    } catch {
      return null;
    }
  },
  
  // New: Check if token will expire soon (within 5 minutes)
  isTokenExpiringSoon: () => {
    const expiry = tokenManager.getTokenExpiry();
    if (!expiry) return true;
    return expiry - Date.now() < 5 * 60 * 1000; // 5 minutes
  },
  
  // New: Get token payload safely
  getTokenPayload: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload;
    } catch {
      return null;
    }
  }
};

// New: Client credentials management
export const clientTokenManager = {
  getClientId: () => localStorage.getItem('client_id'),
  getClientSecret: () => localStorage.getItem('client_secret'),
  setClientTokens: (clientId: string, clientSecret: string) => {
    localStorage.setItem('client_id', clientId);
    localStorage.setItem('client_secret', clientSecret);
  },
  clearClientTokens: () => {
    localStorage.removeItem('client_id');
    localStorage.removeItem('client_secret');
  },
  hasClientTokens: () => {
    return !!(clientTokenManager.getClientId() && clientTokenManager.getClientSecret());
  }
};

// Add request interceptor to add auth token
/*api.interceptors.request.use((config) => {
  const requestUrl = config.url || '';
  const noAuthUrls = [
    '/v1/product',        // you can match base path
    '/v1/product/*',       // wildcard if needed
  ];

  // Check if the current request matches any "no-auth" URL
  const skipAuth = noAuthUrls.some((url) => config.url.startsWith(url));

  if (!skipAuth) {

    const token = tokenManager.getAccessToken();
    if (token && !tokenManager.isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', requestUrl);
    } else {
      console.log('No valid auth token found for request:', requestUrl);
    }
    return config;
  }
  else {
    console.log('Skipping auth for:', requestUrl);
  }
});*/

api.interceptors.request.use(
  (config) => {
    if (!config || !config.url) {
      console.warn("Request config or URL missing:", config);
      return config; // return early to avoid crash
    }

    const requestUrl = config.url;

    const noAuthUrls = [
      '/v1/product',
      '/v1/product/*',
    ];

    const skipAuth = noAuthUrls.some((url) =>
      requestUrl.startsWith(url) || requestUrl.includes(url)
    );

    if (!skipAuth) {
      const token = tokenManager.getAccessToken();
      if (token && !tokenManager.isTokenExpired(token)) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log("Adding auth token to request:", requestUrl);
      } else {
        console.log("No valid auth token found for request:", requestUrl);
      }
    } else {
      console.log("Skipping auth for:", requestUrl);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not intercept for client token requests to avoid loops
    if (originalRequest.url?.includes('/client/token')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = tokenManager.getRefreshToken();
      if (refreshToken) {
        try {
          // Ensure we have client tokens for refresh
          const clientId = clientTokenManager.getClientId();
          const clientSecret = clientTokenManager.getClientSecret();

          if (!clientId || !clientSecret) {
            // If we don't have them, we can't refresh. Clear tokens and reject.
            tokenManager.clearTokens();
            clientTokenManager.clearClientTokens(); // Also clear client tokens
            // Optionally redirect to login or show a message
            return Promise.reject(new Error("Client credentials not found for token refresh."));
          }

          const response = await api.post('/user/refresh', {
            refresh_token: refreshToken,
            client_id: clientId,
            client_secret: clientSecret,
            grant_type: 'refresh_token'
          });
          
          const { access_token, refresh_token } = response.data.tokenDetails;
          tokenManager.setTokens(access_token, refresh_token);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Silent failure - just clear tokens without redirect
          tokenManager.clearTokens();
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, just clear tokens without redirect
        tokenManager.clearTokens();
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  // New: Function to get client tokens
  getClientTokens: async () => {
    if (clientTokenManager.hasClientTokens()) {
      return;
    }
    // Prefer env-provided client if available
    const envClientId = (import.meta as any).env?.VITE_CLIENT_ID;
    const envClientSecret = (import.meta as any).env?.VITE_CLIENT_SECRET;
    if (envClientId && envClientSecret) {
      clientTokenManager.setClientTokens(envClientId, envClientSecret);
      return;
    }

    try {
      // If backend does not expose a client token endpoint publicly, skip remote fetch.
      // We'll rely on env or explicit user-provided credentials.
      throw new Error('Client token endpoint unavailable');
    } catch (error) {
      console.error('Failed to get client tokens:', error);
      throw new Error('Could not initialize application. Please try again.');
    }
  },

  login: async (email: string, password: string) => {
    try {
      // Ensure we have client tokens before logging in
      await authAPI.getClientTokens();
      
      const clientId = clientTokenManager.getClientId();
      const clientSecret = clientTokenManager.getClientSecret();

      if (!clientId || !clientSecret) {
        throw new Error('Client credentials are not available.');
      }

      const response = await api.post('/login', {
        email,
        password,
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'password'
      });
      
      // Store tokens using token manager
      const { access_token, refresh_token } = response.data.tokenDetails;
      tokenManager.setTokens(access_token, refresh_token);
      
      return response.data;
    } catch (error: any) {
      // Enhanced error handling
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid request parameters');
      } else if (error.response?.status >= 500) {
        throw new Error('Server error. Please try again later.');
      } else {
        throw new Error('Login failed. Please check your connection.');
      }
    }
  },

  register: async (userData: {
    salutations_id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    //role_id: number;
    phone: string;
  }) => {
    try {
      const response = await api.post('/register', userData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 409) {
        throw new Error('User with this email already exists');
      } else if (error.response?.status === 400) {
        throw new Error('Please check your registration details');
      } else {
        throw new Error('Registration failed. Please try again.');
      }
    }
  },

  forgotPassword: async (email: string) => {
    try {
      const response = await api.post('/forgotPassword/email', { email });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        throw new Error('Email not found');
      } else {
        throw new Error('Failed to send reset email. Please try again.');
      }
    }
  },

  verifyCode: async (email: string, code: string) => {
    try {
      const response = await api.post('/forgotPassword/code', { email, code });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Invalid verification code');
      } else {
        throw new Error('Code verification failed. Please try again.');
      }
    }
  },

  resetPassword: async (email: string, password: string, password_confirmation: string) => {
    try {
      const response = await api.post('/forgotPassword/reset', {
        email,
        password,
        password_confirmation
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('Password reset failed. Please check your details.');
      } else {
        throw new Error('Password reset failed. Please try again.');
      }
    }
  },

  logout: async () => {
    try {
      await api.get('/user/logout');
    } catch (error) {
      // Silent failure - just clear local tokens
      console.log('Logout API failed, but clearing local tokens');
    } finally {
      tokenManager.clearTokens();
    }
  },

  // Enhanced method to check if user is authenticated
  isAuthenticated: () => {
    const token = tokenManager.getAccessToken();
    return token && !tokenManager.isTokenExpired(token);
  },

  // Enhanced method to get user info from token
  getUserFromToken: () => {
    const token = tokenManager.getAccessToken();
    if (!token || tokenManager.isTokenExpired(token)) {
      return null;
    }
    
    const payload = tokenManager.getTokenPayload(token);
    if (!payload) {
      return null;
    }
    
    return {
      id: payload.sub,
      username: payload.username,
      email: payload.email,
      role: payload.role,
      exp: payload.exp
    };
  },

  // New: Force token refresh
  refreshToken: async () => {
    const refreshToken = tokenManager.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await api.post('/user/refresh', {
        refresh_token: refreshToken,
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'refresh_token'
      });
      
      const { access_token, refresh_token } = response.data.tokenDetails;
      tokenManager.setTokens(access_token, refresh_token);
      
      return response.data;
    } catch (error: any) {
      tokenManager.clearTokens();
      throw new Error('Token refresh failed. Please login again.');
    }
  },

  // New: Check if token needs refresh
  shouldRefreshToken: () => {
    return tokenManager.isTokenExpiringSoon();
  },

  // New: Get user permissions/roles
  getUserPermissions: () => {
    const user = authAPI.getUserFromToken();
    if (!user) return [];
    
    // You can extend this based on your role system
    switch (user.role) {
      case 'admin':
        return ['read', 'write', 'delete', 'admin'];
      case 'user':
        return ['read', 'write'];
      default:
        return ['read'];
    }
  }
};

// Product APIs
export const getProducts = async () => {
  const response = await api.get('/v1/product');
  return response.data;
};

export const productAPI = {
  getProduct: async (id: string) => {
    const response = await api.get(`/v1/product/${id}`);
    return response.data.data;
  },

  getCategories: async () => {
    const response = await api.get('/productCategory');
    return response.data;
  },

  /*deleteProduct: async (id: string) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  }*/
};

// User APIs
export const userAPI = {
  getAddresses: async () => {
    const response = await api.get('/address');
    return response.data;
  },

  addAddress: async (addressData: {
    user_id: number;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    zip_code: string;
    type?: string;
    is_default: number;
    quantity?: number;
    image?: string;
    state_id?: number;
    country_id?: number;
  }) => {
    const response = await api.post('/address', addressData);
    return response.data;
  },

  updateAddress: async (id: number, addressData: any) => {
    const response = await api.post(`/users/address/${id}`, addressData);
    return response.data;
  },

  deleteAddress: async (id: number) => {
    const response = await api.delete(`/users/address/${id}`);
    return response.data;
  },

  // New: Get user profile
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // New: Update user profile
  updateProfile: async (profileData: {
    first_name?: string;
    last_name?: string;
    email?: string;
    mobile?: string;
    avatar?: string;
  }) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },

  // New: Change password
  changePassword: async (passwordData: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }) => {
    const response = await api.post('/users/change-password', passwordData);
    return response.data;
  }
};

// Order APIs
export const orderAPI = {
  // Get user orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  // Get specific order
  getOrder: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },

  // Create new order
  createOrder: async (orderData: {
    items: Array<{
      product_id: string;
      quantity: number;
      price: number;
    }>;
    shipping_address: {
      first_name: string;
      last_name: string;
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
    billing_address?: {
      first_name: string;
      last_name: string;
      address_line_1: string;
      address_line_2?: string;
      city: string;
      state: string;
      zip_code: string;
      country: string;
    };
    payment_method: 'card' | 'cod' | 'upi';
    payment_details?: {
      card_number?: string;
      cardholder_name?: string;
      expiry_date?: string;
      cvv?: string;
    };
    notes?: string;
    email: string;
    phone: string;
  }) => {
    try {
      console.log('Creating order with data:', orderData);
      console.log('API base URL:', config.baseURL);
      console.log('Full endpoint:', `${config.baseURL}/checkout`);
      
      // Use /checkout endpoint instead of /orders
      const response = await api.post('/checkout', orderData);
      console.log('Order created successfully:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Order creation failed:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        console.error('Response headers:', error.response.headers);
      }
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (orderId: string, reason?: string) => {
    const response = await api.post(`/checkout/cancel`, { reason });
    return response.data;
  },

  // Track order
  trackOrder: async (orderId: string) => {
    const response = await api.get(`/checkout/tracking`);
    return response.data;
  }
};

// Cart APIs
export const cartAPI = {
  // Get user cart
  getCart: async () => {
    const response = await api.get('/cart-items');
    return response.data;
  },

  // Add item to cart
  addToCart: async (itemData: {
    product_id: string;
    quantity: number;
  }) => {
    const response = await api.post('/cart/add', itemData);
    return response.data;
  },

  // Update cart item quantity
  updateCartItem: async (itemId: string, quantity: number) => {
    const response = await api.put(`/cart/items/${itemId}`, { quantity });
    return response.data;
  },

  // Remove item from cart
  removeFromCart: async (itemId: string) => {
    const response = await api.delete(`/cart/items/${itemId}`);
    return response.data;
  },

  // Clear cart
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },

  // Apply coupon
  applyCoupon: async (couponCode: string) => {
    const response = await api.post('/cart/coupon', { code: couponCode });
    return response.data;
  },

  // Remove coupon
  removeCoupon: async () => {
    const response = await api.delete('/cart/coupon');
    return response.data;
  }
};

// Wishlist APIs
export const wishlistAPI = {
  // Get user wishlist
  getWishlist: async () => {
    const response = await api.get('/wishlist');
    return response.data;
  },

  // Add to wishlist
  addToWishlist: async (productId: string) => {
    const response = await api.post('/wishlist', { product_id: productId });
    return response.data;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId: string) => {
    const response = await api.delete(`/wishlist/${productId}`);
    return response.data;
  },

  // Check if product is in wishlist
  isInWishlist: async (productId: string) => {
    const response = await api.get(`/wishlist/${productId}/check`);
    return response.data;
  }
};

// Review APIs
export const reviewAPI = {
  // Get product reviews
  getProductReviews: async (productId: string, params?: {
    page?: number;
    limit?: number;
    rating?: number;
  }) => {
    const response = await api.get(`/products/${productId}/reviews`, { params });
    return response.data;
  },

  // Add product review
  addReview: async (productId: string, reviewData: {
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }) => {
    const response = await api.post(`/products/${productId}/reviews`, reviewData);
    return response.data;
  },

  // Update review
  updateReview: async (reviewId: string, reviewData: {
    rating?: number;
    title?: string;
    comment?: string;
    images?: string[];
  }) => {
    const response = await api.put(`/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete review
  deleteReview: async (reviewId: string) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  }
};

// Search APIs
export const searchAPI = {
  // Search products
  searchProducts: async (query: string, params?: {
    page?: number;
    limit?: number;
    category?: string;
    min_price?: number;
    max_price?: number;
    sort_by?: 'price' | 'name' | 'rating' | 'created_at';
    sort_order?: 'asc' | 'desc';
  }) => {
    const response = await api.get('/search/products', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },

  // Get search suggestions
  getSearchSuggestions: async (query: string) => {
    const response = await api.get('/search/suggestions', { 
      params: { q: query } 
    });
    return response.data;
  },

  // Get popular searches
  getPopularSearches: async () => {
    const response = await api.get('/search/popular');
    return response.data;
  }
};

// Notification APIs
export const notificationAPI = {
  // Get user notifications
  getNotifications: async (params?: {
    page?: number;
    limit?: number;
    read?: boolean;
  }) => {
    const response = await api.get('/notifications', { params });
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/read-all');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  }
};

// Analytics APIs
export const analyticsAPI = {
  // Get user analytics
  getUserAnalytics: async (params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/analytics/user', { params });
    return response.data;
  },

  // Get product analytics
  getProductAnalytics: async (productId: string, params?: {
    period?: 'day' | 'week' | 'month' | 'year';
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get(`/analytics/products/${productId}`, { params });
    return response.data;
  }
};

export default api; 