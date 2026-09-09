import useSWRInfinite from 'swr/infinite';
import { getPosts, Post } from '../api';

const PAGE_SIZE = 5;

// getKey builds the key per page; returning null stops loading further pages.
const getKey = (index: number, previous: Post[] | null) => {
  if (previous && previous.length < PAGE_SIZE) return null;
  return ['posts', index] as const;
};

export function Posts() {
  const { data, size, setSize, isLoading, isValidating } = useSWRInfinite(
    getKey,
    ([, page]) => getPosts(page, PAGE_SIZE),
  );
  const posts = data?.flat() ?? [];
  const reachedEnd = data ? data[data.length - 1].length < PAGE_SIZE : false;

  return (
    <section>
      <h2>Infinite posts (useSWRInfinite)</h2>
      {isLoading && <p>Loading...</p>}
      <ul>{posts.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
      <button disabled={isValidating || reachedEnd} onClick={() => setSize(size + 1)}>
        {reachedEnd ? 'No more posts' : isValidating ? 'Loading...' : 'Load more'}
      </button>
    </section>
  );
}
