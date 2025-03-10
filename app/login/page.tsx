'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/hooks/apiUtil';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Clear any existing token first
      authApi.removeToken();
      
      console.log('Before login - Token:', authApi.getToken());
      const response = await authApi.login(formData);
      console.log('Got login response:', response);
      
      if (!response?.accessToken) {
        throw new Error('No access token received');
      }
      
      // Ensure token is in correct format
      if (!response.accessToken.includes('.')) {
        throw new Error('Invalid token format received');
      }
      
      // Store the token with Bearer prefix
      const token = `${response.tokenType || 'Bearer'} ${response.accessToken}`;
      console.log('Storing token format:', token.substring(0, 20) + '...');
      authApi.setToken(token);
      
      // Verify token was stored
      const storedToken = authApi.getToken();
      console.log('Stored token exists:', !!storedToken);
      
      if (!storedToken) {
        throw new Error('Failed to store token');
      }
      toast({
        title: "Success",
        description: "Login successful!",
      });
      console.log('Token before redirect:', authApi.getToken());
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-background relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10" aria-hidden="true" />
      <div className="absolute inset-0 bg-grid-black/5 -z-10" aria-hidden="true" />

      <Card className="w-[400px] border-primary/10 shadow-xl">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                id="usernameOrEmail"
                name="usernameOrEmail"
                type="text"
                required
                placeholder="Username or Email"
                value={formData.usernameOrEmail}
                onChange={handleChange}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="h-11"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </CardFooter>
        </form>

        <div className="text-center pb-6">
          <p className="text-sm text-muted-foreground mb-3">Don't have an account?</p>
          <Button 
            variant="outline" 
            className="w-full h-11"
            onClick={() => router.push('/register')}
          >
            Create Account
          </Button>
        </div>
      </Card>
    </div>
  );
} 