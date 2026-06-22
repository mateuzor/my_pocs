import { useLocation } from "preact-iso";

// About route — also demonstrates `useLocation`, preact-iso's hook for reading
// and programmatically changing the current route.
export function About() {
  const { url, route } = useLocation();
  return (
    <section>
      <h2>About</h2>
      <p>Current route: <code>{url}</code></p>
      <p>
        preact-iso is the official ~1kB router: isomorphic (same code SSR +
        client), with async route prerendering built in.
      </p>
      <button onClick={() => route("/")}>go home programmatically</button>
    </section>
  );
}
