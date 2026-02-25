import { QueryClient } from '@tanstack/react-query';

// Central QueryClient instance — shared across the entire app via QueryClientProvider
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min fresh window, no refetch during this period
      gcTime: 1000 * 60 * 10,   // cached data removed after 10 min of inactivity
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});
