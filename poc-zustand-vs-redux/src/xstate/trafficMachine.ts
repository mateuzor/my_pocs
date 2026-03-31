import { createMachine } from 'xstate';

// A state machine defines ALL possible states and the transitions between them
// This makes impossible states truly impossible — the machine can never be in two states at once
// Key concepts:
//   - states: the finite set of situations the system can be in
//   - events: what triggers a transition
//   - transitions: which state to go to when an event happens

export const trafficMachine = createMachine({
  // id identifies the machine in DevTools
  id: 'traffic',

  // initial: the starting state
  initial: 'red',

  states: {
    red: {
      // on: defines which events are handled in this state
      on: {
        // NEXT event transitions from red → green
        NEXT: { target: 'green' },
      },
    },
    green: {
      on: {
        NEXT: { target: 'yellow' },
      },
    },
    yellow: {
      on: {
        NEXT: { target: 'red' },
      },
    },
  },
});
