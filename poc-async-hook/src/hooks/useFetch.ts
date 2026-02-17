import { useState, useEffect, useCallback, useRef } from 'react';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface UseFetchState<T> {
  data: T | null;
  status: Status;
  error: string | null;
}

interface UseFetchOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  immediate?: boolean; // fetch on mount automatically
  timeoutMs?: number;
}

interface UseFetchReturn<T> extends UseFetchState<T> {
  execute: (overrideUrl?: string) => void;
  reset: () => void;
  isLoading: boolean;
}

export function useFetch<T = unknown>(
  url: string,
  options: UseFetchOptions = {}
): UseFetchReturn<T> {
  const { method = 'GET', body, headers, immediate = true, timeoutMs } = options;

  const [state, setState] = useState<UseFetchState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (overrideUrl?: string) => {
      // Cancel any in-flight request
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      // Optional timeout
      let timeoutId: ReturnType<typeof setTimeout> | null = null;
      if (timeoutMs) {
        timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      }

      setState({ data: null, status: 'loading', error: null });

      try {
        const res = await fetch(overrideUrl ?? url, {
          method,
          signal: controller.signal,
          headers: {
            ...(body ? { 'Content-Type': 'application/json' } : {}),
            ...headers,
          },
          ...(body ? { body: JSON.stringify(body) } : {}),
        });

        if (timeoutId) clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const data: T = await res.json();
        setState({ data, status: 'success', error: null });
      } catch (err: any) {
        if (timeoutId) clearTimeout(timeoutId);

        if (err.name === 'AbortError') return; // ignore abort errors

        setState({ data: null, status: 'error', error: err.message });
      }
    },
    [url, method, body, headers, timeoutMs]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ data: null, status: 'idle', error: null });
  }, []);

  // Auto-fetch on mount when immediate = true
  useEffect(() => {
    if (immediate) execute();
    return () => abortRef.current?.abort(); // cleanup on unmount
  }, [execute, immediate]);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.status === 'loading',
  };
}
