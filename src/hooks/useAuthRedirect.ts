import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useAuthRedirect = (redirectTo: string = '/') => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Check if there's a redirect location from the state
      const from = (location.state as any)?.from?.pathname;
      if (from && from !== '/signin' && from !== '/signup') {
        navigate(from, { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, navigate, location.state, redirectTo]);

  return { isAuthenticated, isLoading };
}; 