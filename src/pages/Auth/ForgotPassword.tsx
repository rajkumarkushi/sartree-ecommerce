import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { authAPI } from '@/services/productPageApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'email' | 'code' | 'reset'>('email');
  const { toast } = useToast();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authAPI.forgotPassword(email);
      toast({
        title: "Verification code sent",
        description: "Please check your email for the verification code",
      });
      setStep('code');
    } catch (error: any) {
      toast({
        title: "Failed to send code",
        description: error.response?.data?.message || "Please check your email and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authAPI.verifyCode(email, verificationCode);
      toast({
        title: "Code verified",
        description: "Please enter your new password",
      });
      setStep('reset');
    } catch (error: any) {
      toast({
        title: "Invalid code",
        description: error.response?.data?.message || "Please check the code and try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "The passwords you entered don't match. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      await authAPI.resetPassword(email, newPassword, confirmPassword);
      toast({
        title: "Password reset successful",
        description: "You can now sign in with your new password",
      });
      // Redirect to sign in page
      window.location.href = '/signin';
    } catch (error: any) {
      toast({
        title: "Password reset failed",
        description: error.response?.data?.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-farm-primary">SAR TREE INDUSTRIES</h1>
          <p className="mt-2 text-gray-600">Reset your password</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>
              {step === 'email' && "Enter your email to receive a verification code"}
              {step === 'code' && "Enter the verification code sent to your email"}
              {step === 'reset' && "Enter your new password"}
            </CardDescription>
          </CardHeader>

          {step === 'email' && (
            <form onSubmit={handleSendEmail}>
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
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-farm-primary hover:bg-farm-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
                <div className="text-center text-sm">
                  Remember your password?{" "}
                  <Link to="/signin" className="text-farm-primary hover:underline">
                    Sign in
                  </Link>
                </div>
              </CardFooter>
            </form>
          )}

          {step === 'code' && (
            <form onSubmit={handleVerifyCode}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="Enter verification code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-farm-primary hover:bg-farm-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify Code"}
                </Button>
                <div className="text-center text-sm">
                  Didn't receive the code?{" "}
                  <button
                    type="button"
                    onClick={handleSendEmail}
                    className="text-farm-primary hover:underline"
                  >
                    Resend
                  </button>
                </div>
              </CardFooter>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetPassword}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button
                  type="submit"
                  className="w-full bg-farm-primary hover:bg-farm-dark"
                  disabled={isLoading}
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword; 