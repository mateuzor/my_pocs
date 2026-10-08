import type { MetricWithAttribution } from 'web-vitals/attribution';

export type Listener = (m: MetricWithAttribution) => void;
const listeners = new Set<Listener>();
export const subscribe = (l: Listener) => (listeners.add(l), () => listeners.delete(l));

export function report(metric: MetricWithAttribution) {
  listeners.forEach((l) => l(metric));

  // Attribution tells WHICH element/event/script caused the metric,
  // turning a number into something actionable. Keep the payload small.
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    attribution: metric.attribution,
  });

  // sendBeacon is queued by the browser and survives page unload, which is
  // exactly when CLS/INP final values are reported (visibilitychange).
  // fetch with keepalive is the fallback.
  if (!navigator.sendBeacon('/vitals', body)) {
    fetch('/vitals', { method: 'POST', body, keepalive: true });
  }
}
