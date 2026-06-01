// Shared design-system primitive consumed by every app in the monorepo.
// In a real setup this would export React components; kept framework-free
// here so the POC stays about the *build graph*, not the UI library.

export interface ButtonOptions {
  label: string;
  variant?: 'primary' | 'ghost';
}

// Returns the HTML a button would render — the point is that this code is
// authored once and shared across apps by package name.
export function button({ label, variant = 'primary' }: ButtonOptions): string {
  const cls = variant === 'primary' ? 'btn btn--primary' : 'btn btn--ghost';
  return `<button class="${cls}">${label}</button>`;
}

export const version = '0.0.1';
