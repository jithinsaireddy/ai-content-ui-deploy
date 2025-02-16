'use client';

import { useRouter } from 'next/navigation';
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { authApi } from '@/hooks/apiUtil';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';

export default function Header() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(authApi.isAuthenticated());
  }, []);

  const handleLogout = () => {
    authApi.removeToken();
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  };

  return (
    <header className="container mx-auto py-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold">AI Content Platform</h1>
      <div className="flex items-center gap-4">
        {isAuthenticated && (
          <Button
            variant="ghost"
            onClick={handleLogout}
          >
            Logout
          </Button>
        )}
        <ThemeToggle />
      </div>
    </header>
  );
} 