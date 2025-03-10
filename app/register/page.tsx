'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/hooks/apiUtil';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from 'lucide-react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: ''
  });
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    if (!formData.username || formData.username.length < 3) {
      toast({
        title: "Validation Error",
        description: "Username must be at least 3 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.industry) {
      toast({
        title: "Validation Error",
        description: "Please enter your industry",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.password || formData.password.length < 8) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive",
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        industry: formData.industry,
      });
      
      const loginResponse = await authApi.login({
        usernameOrEmail: formData.username,
        password: formData.password,
      });
      
      authApi.setToken(loginResponse.accessToken);
      
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      
      router.push('/trends');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      toast({
        title: "Registration Error",
        description: errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
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
      <Link 
        href="/home"
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 self-start"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
      <Card className="w-[400px] border-primary/10 shadow-xl">
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Create your AI Content Platform account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Username (min. 3 characters)"
                value={formData.username}
                onChange={handleChange}
                className="h-11"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="h-11"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="industry"
                name="industry"
                type="text"
                required
                placeholder="Industry"
                value={formData.industry}
                onChange={handleChange}
                className="h-11"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password (min. 8 characters)"
                value={formData.password}
                onChange={handleChange}
                className="h-11"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="h-11"
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              type="submit" 
              className="w-full h-11"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Creating Account</span>
                  <span className="animate-pulse">...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
          </CardFooter>
        </form>
        <div className="text-center pb-6">
          <p className="text-sm text-muted-foreground mb-3">Already have an account?</p>
          <Button 
            variant="outline" 
            className="w-full h-11"
            onClick={() => router.push('/login')}
            disabled={isLoading}
          >
            Sign In
          </Button>
        </div>
      </Card>
    </div>
  );
} 