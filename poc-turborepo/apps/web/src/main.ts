// The app imports the shared package by NAME (not a relative path). This only
// works because both live in the same workspace graph — that single import is
// what makes Turborepo schedule @poc/ui's build before this app's.
import { button, version } from '@poc/ui';

const page = `
  <h1>@poc/web</h1>
  ${button({ label: 'Primary' })}
  ${button({ label: 'Ghost', variant: 'ghost' })}
  <small>using @poc/ui@${version}</small>
`;

console.log(page);
