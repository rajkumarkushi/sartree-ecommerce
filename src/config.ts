export const config = {
  baseURL: (import.meta as any).env?.VITE_API_URL ? `${(import.meta as any).env.VITE_API_URL}/api` : 'https://api.sartree.com/api',
  clientId: (import.meta as any).env?.VITE_CLIENT_ID || '',
  clientSecret: (import.meta as any).env?.VITE_CLIENT_SECRET || '',
};