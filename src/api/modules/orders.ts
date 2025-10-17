import client from '@/api/client';

export const orderAPI = {
  getOrders: async (params?: any) => {
    const res = await client.get('/v1/orders', { params });
    return res.data;
  },
  getOrder: async (orderId: string | number) => {
    const res = await client.get(`/v1/orders/${orderId}`);
    return res.data;
  },
  createOrder: async (payload: any) => {
    const res = await client.post('/v1/checkout', payload);
    return res.data;
  },
};


