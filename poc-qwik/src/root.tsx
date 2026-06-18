import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet, ServiceWorkerRegister } from '@builder.io/qwik-city';

// The document root. QwikCityProvider enables routing; RouterOutlet renders the
// matched route. Crucially: there is NO hydration call anywhere. Qwik serializes
// the app's state + listeners into the HTML, and the client RESUMES execution
// from that snapshot — it never re-runs the whole component tree to "wake up".
export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <meta charSet="utf-8" />
        <title>Qwik POC</title>
      </head>
      <body>
        <RouterOutlet />
        {/* Registers the prefetch service worker: it speculatively caches the
            $ chunks a user is likely to need next, so interactions feel instant. */}
        <ServiceWorkerRegister />
      </body>
    </QwikCityProvider>
  );
});
