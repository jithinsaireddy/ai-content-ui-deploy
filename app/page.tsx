'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/hooks/apiUtil';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    if (!authApi.isAuthenticated()) {
      router.push('/login');
    } else {
      router.push('/dashboard');
    }
  }, [router]);

  return null;
}

