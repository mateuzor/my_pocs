import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { Button } from './Button';
import { Card } from './Card';

const meta = {
  title: 'Components/Card',
  component: Card,
  args: { title: 'Deploy status', children: 'Last deploy finished 3 minutes ago.' },
  // WHY: a story-level decorator adds context only this component needs (here: a constrained container).
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', background: 'var(--border)', borderRadius: 8 }}>
        <Story />
      </div>
    ),
  ],
  // Per-component parameters override the global ones from preview.tsx.
  parameters: { layout: 'padded', docs: { description: { component: 'Container with a title, body and optional footer slot.' } } },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

// Composition: stories can render other library components inside args.
export const WithActions: Story = {
  args: {
    footer: (
      <>
        <Button size="sm">Redeploy</Button>
        <Button size="sm" variant="secondary">Logs</Button>
      </>
    ),
  },
};

export const WithBadgeContent: Story = {
  args: {
    children: (
      <>
        <Badge tone="success">healthy</Badge> <Badge tone="danger">1 alert</Badge>
      </>
    ),
  },
  // Force the dark theme for this story via globals, useful for visual regression of each theme.
  globals: { theme: 'dark' },
};

// Disable the a11y check for a story that intentionally shows low contrast (documented exception).
export const KnownLowContrast: Story = {
  args: { children: <Badge>neutral</Badge> },
  parameters: { a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } } },
};
