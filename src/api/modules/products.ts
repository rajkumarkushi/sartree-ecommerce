import client from '@/api/client';

export const productAPI = {
  list: async () => {
    const res = await client.get('/v1/product');
    return res.data;
  },
  get: async (id: string | number) => {
    const res = await client.get(`/v1/product/${id}`);
    return res.data?.data ?? res.data;
  },
};


