import { assign, fromPromise, setup } from 'xstate';

// XState models state as a FINITE STATE MACHINE: a small set of named states
// + the transitions between them. The benefit: it's impossible to land in an
// invalid combination (e.g. "loading + showing error" at the same time)
// because each state is mutually exclusive.
//
// This machine models a 3-step signup wizard:
//   profile → preferences → review → submitting → (success | error)
// The user can move back and forth between steps; submission has its own
// loading and error states that can only happen from `review`.

interface SignupContext {
  // The `context` is the "extended state" — arbitrary data that lives alongside
  // the named state. Whereas the state name is finite, the context is open.
  name: string;
  email: string;
  newsletter: boolean;
  theme: 'light' | 'dark';
  errorMessage: string | null;
}

// Events are the only way to transition the machine. Discriminated union
// gives us exhaustive checking at compile time.
type SignupEvent =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'RESET' }
  | { type: 'UPDATE_PROFILE'; name: string; email: string }
  | { type: 'UPDATE_PREFS'; newsletter: boolean; theme: 'light' | 'dark' }
  | { type: 'SUBMIT' };

// Fake API call — fails 1/3 of the time to demonstrate the error path
async function submitSignup(input: { name: string; email: string }) {
  await new Promise((r) => setTimeout(r, 800));
  if (Math.random() < 0.33) throw new Error('Email already taken');
  return { id: Math.floor(Math.random() * 10000), ...input };
}

export const signupMachine = setup({
  // `types` is just a TypeScript helper — it makes context/events fully typed
  // inside guards, actions, and transitions.
  types: {} as { context: SignupContext; events: SignupEvent },

  // `actors` are external work (async, callbacks, child machines).
  // fromPromise wraps an async function so the machine can invoke it.
  actors: {
    submitSignup: fromPromise(
      async ({ input }: { input: { name: string; email: string } }) => submitSignup(input)
    ),
  },

  // `guards` are pure boolean functions checked before a transition fires.
  guards: {
    isProfileValid: ({ context }) =>
      context.name.trim().length > 0 && /^\S+@\S+\.\S+$/.test(context.email),
  },
}).createMachine({
  id: 'signup',
  initial: 'profile',
  context: {
    name: '',
    email: '',
    newsletter: true,
    theme: 'light',
    errorMessage: null,
  },
  states: {
    profile: {
      on: {
        UPDATE_PROFILE: {
          // assign updates the context. It's a function that returns a partial
          // context patch.
          actions: assign(({ event }) => ({
            name: event.name,
            email: event.email,
          })),
        },
        // Guarded transition — only fires if isProfileValid returns true.
        NEXT: { target: 'preferences', guard: 'isProfileValid' },
      },
    },

    preferences: {
      on: {
        UPDATE_PREFS: {
          actions: assign(({ event }) => ({
            newsletter: event.newsletter,
            theme: event.theme,
          })),
        },
        BACK: { target: 'profile' },
        NEXT: { target: 'review' },
      },
    },

    review: {
      on: {
        BACK: { target: 'preferences' },
        SUBMIT: { target: 'submitting' },
      },
    },

    submitting: {
      // `invoke` spawns an actor when entering this state.
      // The actor's onDone / onError become transitions.
      invoke: {
        src: 'submitSignup',
        input: ({ context }) => ({ name: context.name, email: context.email }),
        onDone: { target: 'success' },
        onError: {
          target: 'review',
          actions: assign({
            errorMessage: ({ event }) =>
              event.error instanceof Error ? event.error.message : 'Unknown error',
          }),
        },
      },
    },

    success: {
      // `type: 'final'` marks a terminal state — the machine is done.
      type: 'final',
      on: { RESET: { target: 'profile' } },
    },
  },
  // Top-level events apply to ANY state.
  on: {
    RESET: {
      target: '.profile',
      actions: assign({
        name: '',
        email: '',
        newsletter: true,
        theme: 'light',
        errorMessage: null,
      }),
    },
  },
});
