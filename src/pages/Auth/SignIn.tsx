import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useAuthRedirect('/');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    clearError();

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: "🎉 Login successful!",
          description: "Welcome back to SAR TREE INDUSTRIES. Redirecting...",
          duration: 3000,
        });
        const redirectQuery = new URLSearchParams(location.search).get("redirect");
const redirectTo = redirectQuery || (location.state as any)?.from || "/";
setTimeout(() => navigate(redirectTo, { replace: true }), 800);

      } else {
        toast({
          title: "❌ Login failed",
          description: error || "Please check your credentials.",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      toast({
        title: "❌ Login failed",
        description: error?.message || "An unexpected error occurred.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value);
    else setPassword(value);
    if (error) clearError();
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side (Brand Section) */}
      <div className="hidden lg:flex w-1/2 bg-farm-primary text-white items-center justify-center flex-col p-10">
        <h1 className="text-4xl font-extrabold mb-4">SAR TREE INDUSTRIES</h1>
        {/* <p className="text-lg text-gray-100 text-center max-w-md">
          Empowering sustainable solutions for a better tomorrow 🌱
        </p> */}
      </div>

      {/* Right Side (Sign-in Form) */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-farm-primary">Welcome Back 👋</h1>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to continue</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="pl-10"
                      value={email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10"
                      value={password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-sm text-farm-primary hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-farm-primary hover:bg-farm-dark"
                  disabled={isSubmitting || isLoading}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>

                <div className="text-center text-sm">
                  Don’t have an account?{" "}
                  <Link to="/signup" className="text-farm-primary hover:underline">
                    Sign up
                  </Link>
                </div>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
