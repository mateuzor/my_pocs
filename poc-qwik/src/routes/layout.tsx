import { component$, Slot } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';

// A layout.tsx wraps every route in its folder (and nested folders). <Slot/> is
// where the matched child route renders. <Link> does SPA navigation and Qwik
// City prefetches the target route's chunks as the link enters the viewport.
export default component$(() => {
  return (
    <div>
      <nav>
        <Link href="/">home</Link> | <Link href="/about">about</Link> |
        <Link href="/users/1">user 1</Link> | <Link href="/contact">contact</Link>
      </nav>
      <hr />
      <Slot />
    </div>
  );
});
