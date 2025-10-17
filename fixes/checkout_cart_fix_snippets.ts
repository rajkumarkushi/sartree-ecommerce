/**
 * Corrected createOrder function in productPageApi.ts
 */
import api from '../src/services/productPageApi'; // Assuming api is exported from productPageApi.ts

export const orderAPI = {
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
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Cart is empty. Cannot create order.');
    }
    try {
      const response = await api.post('/checkout', orderData);
      return response.data;
    } catch (error) {
      console.error('Order creation failed:', error);
      throw error;
    }
  }
};

/**
 * Corrected getCart function in productPageApi.ts
 */
export const cartAPI = {
  getCart: async () => {
    try {
      const response = await api.get('/cart');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return [];
    }
  },
  // other cartAPI methods...
};

/**
 * Relevant snippet from Checkout.tsx handlePlaceOrder function
 */
const handlePlaceOrder = async () => {
  if (items.length === 0) {
    toast({
      title: "Cart Empty",
      description: "Please add items to your cart before placing an order.",
      variant: "destructive"
    });
    return;
  }

  const orderData = {
    items: items.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    })),
    shipping_address: {
      first_name: shippingInfo.firstName,
      last_name: shippingInfo.lastName,
      address_line_1: shippingInfo.address,
      city: shippingInfo.city,
      state: shippingInfo.state,
      zip_code: shippingInfo.zipCode,
      country: shippingInfo.country,
    },
    payment_method: paymentMethod,
    payment_details: paymentMethod === 'card' ? {
      card_number: cardInfo.cardNumber,
      cardholder_name: cardInfo.cardholderName,
      expiry_date: cardInfo.expiryDate,
      cvv: cardInfo.cvv,
    } : undefined,
    notes: '',
    email: shippingInfo.email,
    phone: shippingInfo.phone,
  };

  // Proceed with order creation...
};
