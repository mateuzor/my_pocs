import { useId, type InputHTMLAttributes } from 'react';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label, also the accessible name. */
  label: string;
  /** Error message; marks the field invalid for assistive tech. */
  error?: string;
  /** Helper text shown under the input. */
  hint?: string;
}

export function TextField({ label, error, hint, ...rest }: TextFieldProps) {
  const id = useId();
  const descId = `${id}-desc`;
  return (
    <div style={{ display: 'grid', gap: '0.25rem', width: 260 }}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        aria-invalid={!!error}
        // WHY: aria-describedby links the message to the input so screen readers announce it.
        aria-describedby={error || hint ? descId : undefined}
        style={{ padding: '0.5rem', border: `1px solid ${error ? 'var(--danger)' : 'var(--border)'}`, borderRadius: 6 }}
        {...rest}
      />
      {(error || hint) && (
        <small id={descId} role={error ? 'alert' : undefined} style={{ color: error ? 'var(--danger)' : 'var(--muted)' }}>
          {error ?? hint}
        </small>
      )}
    </div>
  );
}
