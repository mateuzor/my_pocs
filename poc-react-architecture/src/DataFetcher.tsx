import { useState, useEffect, ReactNode } from 'react';

interface Props<T> {
  url: string;
  render: (data: T | null, loading: boolean, error: string | null) => ReactNode;
}

function DataFetcher<T>({ url, render }: Props<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(url).then(res => res.json()).then(setData).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [url]);

  return <>{render(data, loading, error)}</>;
}

export default DataFetcher;
