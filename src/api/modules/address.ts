import client from '@/api/client';

export const addressAPI = {
  // Create new address
  createAddress: async (addressData: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    user_id?: string | number;
  }) => {
    const res = await client.post('/v1/address', addressData);
    return res.data;
  },

  // Get user addresses
  getAddresses: async () => {
    const res = await client.get('/v1/address');
    return res.data;
  },

  // Get specific address
  getAddress: async (addressId: string | number) => {
    const res = await client.get(`/v1/address/${addressId}`);
    return res.data;
  },

  // Update address
  updateAddress: async (addressId: string | number, addressData: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    pincode?: string;
  }) => {
    const res = await client.put(`/v1/address/${addressId}`, addressData);
    return res.data;
  },

  // Delete address
  deleteAddress: async (addressId: string | number) => {
    const res = await client.delete(`/v1/address/${addressId}`);
    return res.data;
  },
};
