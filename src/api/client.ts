import axios from 'axios';
import { config } from '@/config';
import { tokenManager } from '@/api/tokens';

const client = axios.create({
  baseURL: import.meta?.env?.DEV ? '/api' : config.baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

client.interceptors.request.use((cfg) => {
  const token = tokenManager.getAccessToken();
  if (token && !tokenManager.isTokenExpired(token)) {
    cfg.headers = cfg.headers || {};
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

client.interceptors.response.use(
  (resp) => resp,
  async (error) => {
    return Promise.reject(error);
  }
);

export default client;

