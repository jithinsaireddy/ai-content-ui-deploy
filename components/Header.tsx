'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
    console.log("handleLogout");
    authApi.removeToken();
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto py-4 flex justify-between items-center">
        <Link 
          href="/home" 
          className="text-2xl font-bold hover:text-primary transition-colors"
        >
          AI Content Platform
        </Link>
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
      </div>
    </header>
  );
} 