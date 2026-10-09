# poc-web-vitals

## What
Captures LCP, CLS, INP, FCP and TTFB with the `web-vitals` library
(attribution build), shows them live in the UI and sends each one with
`navigator.sendBeacon` to a tiny Node collector. Each tab deliberately
causes one problem: late hero (LCP), late banner (CLS), blocking click (INP).

## Why
Lab tools (Lighthouse) miss what real users experience. Measuring in the
field and attributing the cause (element, event, resource) turns a metric
into a fix.

## How to run
```
npm install
npm run collector   # terminal 1, logs beacons on :4000
npm run dev         # terminal 2, Vite proxies /vitals to the collector
```
Open the app, use the tabs, then switch tabs or close the page so final
CLS/LCP values are flushed. Watch the collector terminal.

## Notes
- `sendBeacon` survives unload; metrics like CLS are only final on hide.
- Thresholds (good / poor): LCP 2.5s / 4s, CLS 0.1 / 0.25, INP 200ms / 500ms.
- Decisions use the 75th percentile across users, not single samples.

## What to tell a mentor
I instrument real-user metrics with web-vitals, ship them reliably with
sendBeacon, and use the attribution build to find the culprit element or
event. I reproduced each bad metric on purpose and know the typical fix:
reserve space for CLS, prioritize/preload the hero for LCP, yield long
tasks for INP, and cache/CDN for TTFB.
