export const tokenManager = {
  getAccessToken: () => {
    try {
      return (
        localStorage.getItem('access_token') ||
        localStorage.getItem('auth_token') ||
        null
      );
    } catch { return null; }
  },
  getRefreshToken: () => {
    try { return localStorage.getItem('refresh_token'); } catch { return null; }
  },
  setTokens: (accessToken: string, refreshToken?: string) => {
    try {
      localStorage.setItem('access_token', accessToken);
      // mirror to auth_token for legacy callers
      localStorage.setItem('auth_token', accessToken);
      if (refreshToken) localStorage.setItem('refresh_token', refreshToken);
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      localStorage.setItem('token_expiry', payload.exp.toString());
    } catch {}
  },
  clearTokens: () => {
    try {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expiry');
    } catch {}
  },
  isTokenExpired: (token: string) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch { return true; }
  },
};


