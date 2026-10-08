// The attribution build adds debug info (element selector, event target,
// resource URL...) at the cost of a few extra KB; fine for diagnosis.
import { onCLS, onFCP, onINP, onLCP, onTTFB } from 'web-vitals/attribution';
import { report } from './report';

export function startVitals() {
  onTTFB(report);
  onFCP(report);
  onLCP(report);
  onCLS(report);
  // reportAllChanges makes INP/CLS show up live while experimenting,
  // instead of only when the page is hidden.
  onINP(report, { reportAllChanges: true });
}
