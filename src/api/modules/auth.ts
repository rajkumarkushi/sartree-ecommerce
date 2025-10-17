import client from '@/api/client';
import { tokenManager } from '@/api/tokens';
import { config } from '@/config';

export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await client.post('/login', {
      email,
      password,
      client_id: (import.meta as any).env?.VITE_CLIENT_ID || config.clientId,
      client_secret: (import.meta as any).env?.VITE_CLIENT_SECRET || config.clientSecret,
      grant_type: 'password',
    });
    const { access_token, refresh_token } = response.data.tokenDetails || {};
    if (access_token) tokenManager.setTokens(access_token, refresh_token);
    return response.data;
  },
  register: async (payload: any) => {
    const response = await client.post('/register', payload);
    return response.data;
  },
  logout: async () => {
    try { await client.get('/user/logout'); } finally { tokenManager.clearTokens(); }
  },
};


