import type { ReactNode } from 'react';

export interface CardProps {
  title: string;
  /** Slot for actions, rendered in the footer. */
  footer?: ReactNode;
  children: ReactNode;
}

export function Card({ title, footer, children }: CardProps) {
  return (
    <article style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '1rem', width: 320 }}>
      <h3 style={{ margin: 0 }}>{title}</h3>
      <div style={{ margin: '0.75rem 0' }}>{children}</div>
      {footer && <footer style={{ display: 'flex', gap: '0.5rem' }}>{footer}</footer>}
    </article>
  );
}
