"use client";

import { useState, useEffect, useCallback } from "react";

interface UseApiOptions {
  /** Ne pas fetch automatiquement au mount */
  manual?: boolean;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useApi<T = any>(url: string, options?: UseApiOptions): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!options?.manual);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erreur ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Erreur réseau");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!options?.manual) {
      fetchData();
    }
  }, [fetchData, options?.manual]);

  return { data, loading, error, refetch: fetchData };
}
