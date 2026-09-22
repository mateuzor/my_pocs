import type { Meta, StoryObj } from '@storybook/react';
import { expect, fn, userEvent, within } from '@storybook/test';
import { TextField } from './TextField';

const meta = {
  title: 'Components/TextField',
  component: TextField,
  args: { label: 'Email', placeholder: 'you@example.com', onChange: fn() },
  argTypes: {
    // Hide props that make no sense as controls to keep the panel focused.
    className: { table: { disable: true } },
    type: { control: 'select', options: ['text', 'email', 'password'] },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = { args: { hint: 'We never share your email.' } };

export const WithError: Story = { args: { error: 'Enter a valid email', defaultValue: 'nope' } };

// Stories can be chained: `play` steps are grouped and shown in the Interactions panel for debugging.
export const TypingUpdatesValue: Story = {
  play: async ({ args, canvasElement, step }) => {
    const input = within(canvasElement).getByLabelText('Email');

    await step('type an email', async () => {
      await userEvent.type(input, 'ada@example.com', { delay: 20 });
    });

    await step('value and handler are in sync', async () => {
      await expect(input).toHaveValue('ada@example.com');
      await expect(args.onChange).toHaveBeenCalled();
    });
  },
};

// Reuse another story's play function, then continue from that state.
export const TypingThenClearing: Story = {
  play: async (ctx) => {
    await TypingUpdatesValue.play?.(ctx);
    const input = within(ctx.canvasElement).getByLabelText('Email');
    await userEvent.clear(input);
    await expect(input).toHaveValue('');
  },
};

// a11y: the error is exposed via role=alert + aria-invalid, which the addon and this assertion verify.
export const ErrorIsAccessible: Story = {
  args: { error: 'Enter a valid email' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Email')).toBeInvalid();
    await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a valid email');
  },
};
