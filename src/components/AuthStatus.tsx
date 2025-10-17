import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { authAPI } from '@/services/productPageApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, User, Shield, Clock } from 'lucide-react';

export const AuthStatus: React.FC = () => {
  const { user, isAuthenticated, isLoading, error, logout, clearError, refreshAuth } = useAuth();

  const handleRefreshToken = async () => {
    try {
      await refreshAuth();
    } catch (error) {
      console.error('Token refresh failed:', error);
    }
  };

  const getTokenExpiryInfo = () => {
    if (!isAuthenticated) return null;
    
    const expiry = authAPI.getUserFromToken()?.exp;
    if (!expiry) return null;
    
    const expiryDate = new Date(expiry * 1000);
    const now = new Date();
    const timeLeft = expiryDate.getTime() - now.getTime();
    const minutesLeft = Math.floor(timeLeft / (1000 * 60));
    
    return {
      expiryDate,
      minutesLeft,
      isExpiringSoon: minutesLeft < 5
    };
  };

  const tokenInfo = getTokenExpiryInfo();
  const permissions = authAPI.getUserPermissions();

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center p-6">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="ml-2">Checking authentication...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription className="flex items-center justify-between">
              <span>{error}</span>
              <Button variant="ghost" size="sm" onClick={clearError}>
                ×
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {isAuthenticated ? (
          <div className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
              <User className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <Badge variant="secondary" className="mt-1">
                  {user?.role}
                </Badge>
              </div>
            </div>

            {/* Token Info */}
            {tokenInfo && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Token Expires</p>
                  <p className="text-sm text-gray-600">
                    {tokenInfo.minutesLeft > 0 
                      ? `in ${tokenInfo.minutesLeft} minutes`
                      : 'Expired'
                    }
                  </p>
                  {tokenInfo.isExpiringSoon && (
                    <Badge variant="destructive" className="mt-1">
                      Expiring Soon
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Permissions */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Permissions:</p>
              <div className="flex flex-wrap gap-1">
                {permissions.map((permission) => (
                  <Badge key={permission} variant="outline">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshToken}
                disabled={!authAPI.shouldRefreshToken()}
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh Token
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <Shield className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Not authenticated</p>
            </div>
            <p className="text-sm text-gray-500">
              Please log in to access protected features
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthStatus; 