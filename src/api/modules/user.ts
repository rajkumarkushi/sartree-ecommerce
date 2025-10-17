import client from '@/api/client';

export const userAPI = {
  getProfile: async () => {
    const res = await client.get('/v1/users/profile');
    return res.data;
  },
  updateProfile: async (payload: any) => {
    const res = await client.put('/v1/users/profile', payload);
    return res.data;
  },
  getAddresses: async () => {
    const res = await client.get('/v1/address');
    return res.data;
  },
  addAddress: async (payload: any) => {
    const res = await client.post('/v1/address', payload);
    return res.data;
  },
  updateAddress: async (id: number, payload: any) => {
    const res = await client.post(`/v1/users/address/${id}`, payload);
    return res.data;
  },
  deleteAddress: async (id: number) => {
    const res = await client.delete(`/v1/users/address/${id}`);
    return res.data;
  },
};


