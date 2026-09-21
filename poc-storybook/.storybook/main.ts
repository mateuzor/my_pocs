import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // WHY: globs decide which files become stories; co-locating them with components keeps docs near code.
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials', // controls, actions, docs, viewport, backgrounds...
    '@storybook/addon-interactions', // shows play() steps in a debuggable panel
    '@storybook/addon-a11y', // runs axe-core against every story
  ],
  framework: { name: '@storybook/react-vite', options: {} },
  // WHY: infer argTypes/controls and descriptions straight from TS props and JSDoc.
  typescript: { reactDocgen: 'react-docgen-typescript' },
};

export default config;
