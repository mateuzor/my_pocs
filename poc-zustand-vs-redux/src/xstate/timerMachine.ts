import { createMachine, assign } from 'xstate';

// after() defines a delayed transition — the machine moves automatically after N milliseconds
// No setTimeout needed — XState manages the timer and cancels it if the state changes

export const timerMachine = createMachine({
  id: 'timer',
  initial: 'idle',
  context: { elapsed: 0, duration: 5 },

  states: {
    idle: {
      on: {
        START: { target: 'running' },
      },
    },

    running: {
      // after: automatic transition after the specified delay (ms)
      after: {
        // Dynamic delay using context — duration * 1000ms
        TIMER_DURATION: { target: 'done' },
      },
      on: {
        CANCEL: { target: 'idle' },
        SET_DURATION: {
          actions: assign({ duration: ({ event }: any) => event.value }),
        },
      },
    },

    done: {
      on: {
        RESET: {
          target: 'idle',
          actions: assign({ elapsed: 0 }),
        },
      },
    },
  },

  // delays can be dynamic functions — resolved from context at runtime
  delays: {
    TIMER_DURATION: ({ context }: any) => context.duration * 1000,
  },
});
