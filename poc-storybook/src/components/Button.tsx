import type { ButtonHTMLAttributes } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight of the button. */
  variant?: 'primary' | 'secondary' | 'danger';
  /** Controls padding and font size. */
  size?: 'sm' | 'md' | 'lg';
  /** Shows a spinner label and blocks clicks. */
  loading?: boolean;
}

export function Button({ variant = 'primary', size = 'md', loading = false, disabled, children, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn--${variant} btn--${size}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
