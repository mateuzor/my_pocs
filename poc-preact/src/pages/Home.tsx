import { Counter } from "../components/Counter";
import { SignalsCart } from "../components/SignalsCart";

// Home route — hosts the hooks + signals demos.
export function Home() {
  return (
    <>
      <Counter />
      <SignalsCart />
    </>
  );
}
