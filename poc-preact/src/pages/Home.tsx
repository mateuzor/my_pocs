import { useRef } from "preact/hooks";
import { Counter } from "../components/Counter";
import { SignalsCart } from "../components/SignalsCart";
import { Badge } from "../components/CompatBadge";

// Home route — hosts the hooks + signals demos, plus a compat component
// driven through a forwarded ref.
export function Home() {
  const badgeRef = useRef<HTMLSpanElement>(null);

  return (
    <>
      <Counter />
      <SignalsCart />
      <section>
        <h2>Compat</h2>
        <Badge ref={badgeRef} label="memo + forwardRef" />{" "}
        <button onClick={() => alert(badgeRef.current?.textContent)}>
          read via ref
        </button>
      </section>
    </>
  );
}
