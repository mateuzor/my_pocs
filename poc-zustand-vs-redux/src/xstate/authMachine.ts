import { createMachine, assign } from 'xstate';

// Guards are conditions that must be true for a transition to happen
// If the guard returns false, the transition is blocked — the machine stays in the current state
// assign() is used to update the machine's context (its internal data)

interface AuthContext {
  user: string | null;
  errorMessage: string | null;
  attempts: number;
}

export const authMachine = createMachine({
  id: 'auth',
  initial: 'idle',

  // context is the machine's internal data — like component state but inside the machine
  context: {
    user: null,
    errorMessage: null,
    attempts: 0,
  } as AuthContext,

  states: {
    idle: {
      on: {
        LOGIN: { target: 'loading' },
      },
    },

    loading: {
      on: {
        // Guard: only succeed if password is 'secret'
        SUCCESS: {
          target: 'authenticated',
          // assign updates context when the transition happens
          actions: assign({
            user: ({ event }: any) => event.username,
            errorMessage: null,
            attempts: 0,
          }),
        },
        FAILURE: [
          {
            // Guard: if attempts >= 2, go to locked state
            target: 'locked',
            guard: ({ context }: { context: AuthContext }) => context.attempts >= 2,
            actions: assign({ attempts: ({ context }) => context.attempts + 1 }),
          },
          {
            // Otherwise, go back to idle with an error message
            target: 'idle',
            actions: assign({
              errorMessage: 'Invalid password. Try "secret".',
              attempts: ({ context }: { context: AuthContext }) => context.attempts + 1,
            }),
          },
        ],
      },
    },

    authenticated: {
      on: {
        LOGOUT: {
          target: 'idle',
          actions: assign({ user: null, errorMessage: null }),
        },
      },
    },

    locked: {
      on: {
        RESET: {
          target: 'idle',
          actions: assign({ attempts: 0, errorMessage: null }),
        },
      },
    },
  },
});
