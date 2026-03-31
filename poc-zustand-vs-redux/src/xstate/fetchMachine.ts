import { createMachine, assign } from 'xstate';

interface Post { id: number; title: string }

interface FetchContext {
  posts: Post[];
  error: string | null;
}

// invoke runs a Promise (or callback/observable) inside a state
// The machine automatically handles:
//   - onDone: Promise resolved → transition to next state with data
//   - onError: Promise rejected → transition to error state
// This replaces manual loading/error state management

export const fetchMachine = createMachine({
  id: 'fetch',
  initial: 'idle',
  context: { posts: [], error: null } as FetchContext,

  states: {
    idle: {
      on: { FETCH: { target: 'loading' } },
    },

    loading: {
      // invoke runs the Promise when entering this state
      invoke: {
        id: 'fetchPosts',
        src: async () => {
          const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        },
        // onDone fires when the Promise resolves
        onDone: {
          target: 'success',
          actions: assign({ posts: ({ event }) => event.output, error: null }),
        },
        // onError fires when the Promise rejects
        onError: {
          target: 'failure',
          actions: assign({ error: ({ event }: any) => event.error?.message ?? 'Unknown error' }),
        },
      },
    },

    success: {
      on: { FETCH: { target: 'loading' } }, // allow refetch
    },

    failure: {
      on: { RETRY: { target: 'loading' } },
    },
  },
});
