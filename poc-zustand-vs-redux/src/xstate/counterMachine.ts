import { createMachine, assign } from 'xstate';

// A simple counter machine with context
// Context in XState = the machine's internal data that can change without changing state
export const counterMachine = createMachine({
  id: 'counter',
  initial: 'active',
  context: {
    count: 0,
    step: 1,
  },
  states: {
    active: {
      on: {
        INCREMENT: {
          actions: assign({ count: ({ context }) => context.count + context.step }),
        },
        DECREMENT: {
          actions: assign({ count: ({ context }) => context.count - context.step }),
        },
        SET_STEP: {
          actions: assign({ step: ({ event }) => event.step }),
        },
        RESET: {
          actions: assign({ count: 0, step: 1 }),
        },
      },
    },
  },
});
