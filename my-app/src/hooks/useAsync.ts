import { useState, useCallback, useRef } from 'react';

type Status = 'idle' | 'pending' | 'success' | 'error';

interface AsyncState<T> {
  status: Status;
  data: T | null;
  error: Error | null;
}

export function useAsync<T>(asyncFunction: () => Promise<T>) {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const isMounted = useRef(true);

  const execute = useCallback(async () => {
    setState({ status: 'pending', data: null, error: null });
    try {
      const data = await asyncFunction();
      if (isMounted.current) {
        setState({ status: 'success', data, error: null });
      }
    } catch (error: any) {
      if (isMounted.current) {
        setState({ status: 'error', data: null, error });
      }
    }
  }, [asyncFunction]);

  return { ...state, execute };
}