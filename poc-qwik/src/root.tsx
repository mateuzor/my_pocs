import { component$ } from '@builder.io/qwik';
import { QwikCityProvider, RouterOutlet } from '@builder.io/qwik-city';

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
      </body>
    </QwikCityProvider>
  );
});
