import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from './Counter';

// Test the behaviour the user sees, not the hook's internals.
it('updates the displayed count on clicks', async () => {
  const user = userEvent.setup();
  render(<Counter />);

  await user.click(screen.getByRole('button', { name: 'Increment' }));
  await user.click(screen.getByRole('button', { name: 'Increment' }));
  expect(screen.getByRole('status')).toHaveTextContent('2'); // <output> has implicit role "status"

  await user.click(screen.getByRole('button', { name: 'Reset' }));
  expect(screen.getByRole('status')).toHaveTextContent('0');
});
