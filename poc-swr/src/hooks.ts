import useSWR from 'swr';
import { getTodos, getClock } from './api';

// Key = cache identity, fetcher = how to load it. Same key in many components
// => one shared cache entry and (within dedupingInterval) one request.
export function useTodos() {
  return useSWR('/api/todos', getTodos);
}

// refreshInterval turns SWR into simple polling.
export function useClock() {
  return useSWR('/api/clock', getClock, { refreshInterval: 1000 });
}
