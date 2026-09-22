import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { Button } from './Button';

// WHY: Meta is the "default export" contract (CSF3): title, component and the defaults shared by all stories.
const meta = {
  title: 'Components/Button',
  component: Button,
  // argTypes refine what react-docgen inferred: pick a control type and group props in the docs table.
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'danger'], description: 'Visual weight' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    loading: { control: 'boolean' },
    onClick: { action: 'clicked', table: { category: 'events' } },
  },
  // Default args: stories inherit them and override only what differs.
  args: { children: 'Click me', onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Each export is one state of the component, a living, visual test case.
export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };

export const Loading: Story = { args: { loading: true } };

export const Disabled: Story = { args: { disabled: true } };

// WHY: render() lets one story show several variants side by side without a control.
export const AllSizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
      <Button {...args} size="sm">Small</Button>
      <Button {...args} size="md">Medium</Button>
      <Button {...args} size="lg">Large</Button>
    </div>
  ),
};

// play() runs after render: it simulates user behaviour and asserts, so the story doubles as an interaction test.
export const ClickCallsHandler: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /click me/i }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

export const LoadingBlocksClicks: Story = {
  args: { loading: true },
  play: async ({ args, canvasElement }) => {
    const button = within(canvasElement).getByRole('button');
    await expect(button).toBeDisabled();
    await userEvent.click(button);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};
