import type { ReactNode } from 'react';

export interface BadgeProps {
  tone?: 'neutral' | 'success' | 'danger';
  children: ReactNode;
}

const colors = { neutral: 'var(--muted)', success: '#15803d', danger: 'var(--danger)' } as const;

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return (
    <span style={{ border: `1px solid ${colors[tone]}`, color: colors[tone], borderRadius: 999, padding: '0 0.6rem', fontSize: '0.8rem' }}>
      {children}
    </span>
  );
}
