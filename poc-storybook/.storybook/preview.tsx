import type { Decorator, Preview } from '@storybook/react';
import '../src/theme.css';

// WHY: a global decorator wraps EVERY story, so shared concerns (theme, layout, providers) live in one place.
const withTheme: Decorator = (Story, context) => (
  <div data-theme={context.globals.theme} style={{ padding: '1rem', background: 'var(--bg)', color: 'var(--fg)' }}>
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withTheme],
  // WHY: globalTypes add a toolbar switcher; its value is read via context.globals in decorators.
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { theme: 'light' },
  parameters: {
    // Any prop matching these patterns gets an automatic control/action, no argTypes needed.
    controls: { matchers: { color: /(background|color)$/i } },
    actions: { argTypesRegex: '^on[A-Z].*' },
    // WHY: 'todo' reports violations in the panel without failing; use 'error' in CI to block regressions.
    a11y: { test: 'todo', config: { rules: [{ id: 'color-contrast', enabled: true }] } },
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default preview;
