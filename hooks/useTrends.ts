import { useState, useEffect } from 'react';
import { TrendsResponse } from '@/lib/types/trends';
import { authApi, API_ENDPOINTS } from '@/hooks/apiUtil';

export function useTrends() {
  const [data, setData] = useState<TrendsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = async (category?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = category
        ? API_ENDPOINTS.trends.getByCategory(category)
        : API_ENDPOINTS.trends.getAll;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authApi.getToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch trends");
      }
      
      const result = await response.json();
      setData(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchTrends };
}
