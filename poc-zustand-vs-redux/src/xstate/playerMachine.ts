import { createMachine, assign } from 'xstate';

// Parallel states allow multiple independent regions to be active simultaneously
// type: 'parallel' means ALL child states are active at the same time
// Each region tracks its own state independently

export const playerMachine = createMachine({
  id: 'player',
  type: 'parallel', // all child states active simultaneously

  states: {
    // Region 1: playback state
    playback: {
      initial: 'paused',
      states: {
        paused: {
          on: { PLAY: { target: 'playing' } },
        },
        playing: {
          on: { PAUSE: { target: 'paused' } },
        },
      },
    },

    // Region 2: volume state — independent of playback
    volume: {
      initial: 'unmuted',
      states: {
        unmuted: {
          on: { MUTE: { target: 'muted' } },
        },
        muted: {
          on: { UNMUTE: { target: 'unmuted' } },
        },
      },
    },

    // Region 3: fullscreen state — independent of both above
    display: {
      initial: 'windowed',
      states: {
        windowed: {
          on: { FULLSCREEN: { target: 'fullscreen' } },
        },
        fullscreen: {
          on: { EXIT_FULLSCREEN: { target: 'windowed' } },
        },
      },
    },
  },
});
