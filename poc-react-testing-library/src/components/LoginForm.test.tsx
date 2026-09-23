import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('submits valid values', async () => {
    // WHY: userEvent.setup() simulates the full interaction (focus, keydown, input, keyup), unlike fireEvent.
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'ada@example.com');
    await user.type(screen.getByLabelText('Password'), 'supersecret');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(onSubmit).toHaveBeenCalledWith({ email: 'ada@example.com', password: 'supersecret' });
  });

  it('shows validation errors and does not submit', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText('Email'), 'nope');
    await user.type(screen.getByLabelText('Password'), '123');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent('Enter a valid email');
    expect(alert).toHaveTextContent(/at least 8 characters/);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('clears errors once the form becomes valid', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={() => {}} />);

    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Email'), 'a@b.co');
    await user.type(screen.getByLabelText('Password'), '12345678');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});
