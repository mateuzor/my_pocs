import { render, screen, within } from '@testing-library/react';
import { LoginForm } from './LoginForm';

// Query priority (most to least like a real user / assistive tech):
//   getByRole > getByLabelText > getByPlaceholderText > getByText > getByDisplayValue > getByAltText > getByTitle > getByTestId
// WHY: queries that mirror accessibility also catch a11y regressions for free.
describe('query priority', () => {
  beforeEach(() => render(<LoginForm onSubmit={() => {}} />));

  it('prefers role with an accessible name', () => {
    expect(screen.getByRole('button', { name: /sign in/i })).toBeEnabled();
    expect(screen.getByRole('form', { name: 'login' })).toBeInTheDocument();
  });

  it('uses label text for form fields', () => {
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');
    expect(screen.getByLabelText(/password/i)).toHaveValue('');
  });

  // get* throws if missing, query* returns null (use it to assert absence), find* waits (async).
  it('uses queryBy to assert absence', () => {
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('scopes queries with within', () => {
    const form = screen.getByRole('form', { name: 'login' });
    expect(within(form).getAllByRole('textbox')).toHaveLength(1); // password inputs have no textbox role
  });
});
